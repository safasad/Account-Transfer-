
# Create your views here.
from rest_framework import viewsets
from .models import Account, Transactions
from .serializers import AccountSerializer, TransferSerializer
import csv
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.datastructures import MultiValueDictKeyError
from .models import Account  # Adjust according to your actual model
import io
from django.core.paginator import Paginator
import json
from decimal import Decimal
from .exceptions import InsufficientBalanceError
class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


class TransferViewSet(viewsets.ModelViewSet):
    queryset = Transactions.objects.all()
    serializer_class = TransferSerializer


@csrf_exempt
def import_accounts(request):
    if request.method == 'POST':
        try:
            # Account.objects.all().delete()
            csv_file = request.FILES['csvFile']
            decoded_file = csv_file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
            created_accounts = []

            for row in reader:
                account = Account.objects.get(
                    account_id=row['ID']
                )
                if account:
                    if account.balance != Decimal(row['Balance']):
                        account.balance = Decimal(row['Balance'])
                        account.save()
                else:
                    Account.objects.create(
                        account_id=row['ID'],
                        name=row['Name'],
                        balance=row['Balance'],

                    )

            # Convert account objects to a list of dictionaries
            accounts_list = Account.objects.all()
            # Show 10 accounts per page
            paginator = Paginator(accounts_list, 10)

            page = request.GET.get('page')
            accounts = paginator.get_page(page)

            accounts_data = list(
                accounts.object_list.values('id', 'name', 'balance'))
            return JsonResponse({
                'message': 'Import successful',
                'accounts': accounts_data,
                'num_pages': paginator.num_pages,
                'current_page': accounts.number,
            }, status=200)

        except MultiValueDictKeyError:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def get_accounts(request):
    accounts_list = Account.objects.all()

    # Pagination setup
    paginator = Paginator(accounts_list, 10)  # Show 10 accounts per page

    # Get page number from query parameters
    page = request.GET.get('page')

    if not page:
        # Return all accounts if page is not specified
        accounts_data = list(accounts_list.values(
            'id', 'account_id', 'name', 'balance'))
        return JsonResponse({
            'accounts': accounts_data,
            'num_accounts': len(accounts_data),
        })

    # Paginate accounts
    accounts = paginator.get_page(page)
    accounts_data = list(accounts.object_list.values(
        'id', 'name', 'balance'))

    return JsonResponse({
        'accounts': accounts_data,
        'num_pages': paginator.num_pages,
        'current_page': accounts.number,
    })


def get_transactions(request):
    transactions_queryset = Transactions.objects.all().order_by('-timestamp')


    # Pagination
    # Adjust per_page as needed
    paginator = Paginator(transactions_queryset, per_page=10)
    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)

    # Extract values from paginated queryset
    transactions_data = list(page.object_list.values(
        'from_account__name', 'to_account__name', 'amount', 'timestamp'))
    print(f'transactions_data {transactions_data}')
    return JsonResponse({
        'transactions': transactions_data,
        'num_pages': paginator.num_pages,
        'current_page': page.number,
    })


@csrf_exempt
def transfer(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(f'transactions>>>>>>>.{data}')

            transfer_data = data['transfer']
            from_account_id = transfer_data['from_account']
            to_account_id = transfer_data['to_account']
            amount = Decimal(transfer_data['amount'])

            sender_account = Account.objects.get(account_id=from_account_id)
            receiver_account = Account.objects.get(account_id=to_account_id)
            print(f'{sender_account}=>{receiver_account}')
            transaction = Transactions.objects.create(
                from_account=sender_account,
                to_account=receiver_account,
                amount=amount
            )
            print(f'transactions_data>>>>>{transaction}')

            try:
                transaction.save()
                print(f'transactions_data>>>>>{transaction}')

                transactions_list = Transactions.objects.all().order_by('-timestamp')
                paginator = Paginator(transactions_list, 10)
                # page_number = request.GET.get('page', 1)
                transactions = paginator.get_page(1)
                transactions_data = list(
                    transactions.object_list.values('from_account__name', 'to_account__name', 'amount', 'timestamp'))
                print(f'transactions_data>>>>>{transactions_data}')
                return JsonResponse({
                    'message': 'Transfer successful',
                    'transactions': transactions_data,
                    'num_pages': paginator.num_pages,
                    'current_page': transactions.number,
                }, status=200)

            except InsufficientBalanceError as e:
                return JsonResponse({'error': str(e)}, status=400)

        except Account.DoesNotExist:
            return JsonResponse({'error': 'Account not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
