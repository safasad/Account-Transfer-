from django.contrib import admin
from .models import *
# Register your models here.


class AccountAdmin(admin.ModelAdmin):
    fields = ('account_id', 'name', 'balance')


admin.site.register(Account, AccountAdmin)
admin.site.register(Transactions)
