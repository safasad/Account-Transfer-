from django.urls import path
from .views import *

urlpatterns = [
    path('import-accounts/', import_accounts, name='import_accounts'),
    path('get-accounts/', get_accounts, name='get_accounts'),
    path('get-transactions/', get_transactions, name='get_transactions'),
    path('transfer/', transfer, name='transfer'),
    path('delete-account/<int:id>/', delete_account, name='delete_account'),
    path('account-details/<int:account_id>/', get_account_details, name='get_account_details'),
    # Other URLs for your Django app
]
