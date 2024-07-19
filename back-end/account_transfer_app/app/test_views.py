from django.test import TestCase, Client
from django.urls import reverse
from app.models import Account
from decimal import Decimal
import json

class TransferViewTestCase(TestCase):

    def setUp(self):
        self.client = Client()
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

    def test_transfer_view(self):
        url = reverse('transfer')
        data = {
            'transfer': {
                'from_account': '1',
                'to_account': '2',
                'amount': '200.00'
            }
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('Transfer successful', response.json()['message'])

    def test_transfer_insufficient_balance(self):
        url = reverse('transfer')
        data = {
            'transfer': {
                'from_account': '1',
                'to_account': '2',
                'amount': '1500.00'  # Assuming insufficient balance
            }
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertIn('Insufficient balance', response.json()['error'])
