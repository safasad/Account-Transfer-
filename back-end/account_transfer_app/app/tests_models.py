from django.test import TestCase
from app.models import Account, Transactions
from decimal import Decimal

class AccountModelTestCase(TestCase):

    def setUp(self):
        self.sender_account = Account.objects.create(
            account_id='1',
            name='Test Sender Account',
            balance=Decimal('1000.00')
        )
        self.receiver_account = Account.objects.create(
            account_id='2',
            name='Test Receiver Account',
            balance=Decimal('500.00')
        )

    def test_account_balance(self):
        self.assertEqual(self.sender_account.balance, Decimal('1000.00'))

    def test_transactions_creation(self):
        amount = Decimal('200.00')

        # Creating a transaction should update account balances
        Transactions.objects.create(
            from_account=self.sender_account,
            to_account=self.receiver_account,
            amount=amount
        )

        # Refresh accounts from the database to get updated balances
        self.sender_account.refresh_from_db()
        self.receiver_account.refresh_from_db()

        self.assertEqual(self.sender_account.balance, Decimal('800.00'))
        self.assertEqual(self.receiver_account.balance, Decimal('700.00'))
