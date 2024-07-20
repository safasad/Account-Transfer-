
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
from django.db.models import Q


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
                try:
                    account = Account.objects.get(
                        account_id=row['ID']
                    )
                    if account.balance != Decimal(row['Balance']):
                        account.balance = Decimal(row['Balance'])
                        account.save()
                except:
                    Account.objects.create(
                        account_id=row['ID'],
                        name=row['Name'],
                        balance=row['Balance'],

                    ).save()
            return JsonResponse({
                'message': 'Import successful',

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
        'id', 'account_id', 'name', 'balance'))

    return JsonResponse({
        'accounts': accounts_data,
        'num_pages': paginator.num_pages,
        'current_page': accounts.number,
    })


# In your Django views.py


def get_account_details(request, account_id):
    try:
        # Retrieve the account
        account = Account.objects.get(id=account_id)

        # Retrieve transactions related to the account
        transactions = Transactions.objects.filter(
            Q(from_account=account) | Q(to_account=account)
        ).values('from_account__name', 'to_account__name', 'amount', 'status', 'timestamp').order_by('-timestamp')

        # Pagination
        page_number = request.GET.get('page', 1)
        per_page = request.GET.get('per_page', 5)
        paginator = Paginator(transactions, per_page)
        page = paginator.get_page(page_number)

        # Prepare the data for response
        account_data = {
            'account_id': account.account_id,
            'id': account.id,
            'name': account.name,
            'balance': account.balance,
        }

        return JsonResponse({
            'account': account_data,
            'transactions': list(page),
            'num_pages': paginator.num_pages,
            'current_page': page.number,
        })
    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)


@csrf_exempt
def delete_account(request, id):
    if request.method == 'DELETE':
        try:
            account = Account.objects.get(id=id).delete()
            return JsonResponse({'message': 'Account deleted successfully'}, status=200)
        except Account.DoesNotExist:
            return JsonResponse({'error': 'Account not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def get_transactions(request):
    transactions_queryset = Transactions.objects.all().order_by('-timestamp')

    # Pagination
    # Adjust per_page as needed
    paginator = Paginator(transactions_queryset, per_page=10)
    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)
    # Extract values from paginated queryset
    transactions_data = list(page.object_list.values(
        'from_account__name', 'to_account__name', 'amount', 'status', 'timestamp'))
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
            transfer_data = data['transfer']
            from_account_id = transfer_data['from_account']
            to_account_id = transfer_data['to_account']
            amount = Decimal(transfer_data['amount'])

            sender_account = Account.objects.get(account_id=from_account_id)
            receiver_account = Account.objects.get(account_id=to_account_id)
            transaction = Transactions.objects.create(
                from_account=sender_account,
                to_account=receiver_account,
                amount=amount
            )
            transaction.save()
            if transaction.status == True:
                return JsonResponse({
                    'message': 'Transfer successful',
                }, status=200)
            else:
                return JsonResponse({'error': 'Insufficient balance for this transaction'}, status=400)

        except Account.DoesNotExist:
            return JsonResponse({'error': 'Account not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
