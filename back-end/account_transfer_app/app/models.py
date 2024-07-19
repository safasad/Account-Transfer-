from django.db import models
from .exceptions import InsufficientBalanceError

class Account(models.Model):
    account_id = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    balance = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Transactions(models.Model):
    from_account = models.ForeignKey(
        Account, related_name='transfers_out', on_delete=models.CASCADE)
    to_account = models.ForeignKey(
        Account, related_name='transfers_in', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.timestamp}'

    def save(self, *args, **kwargs):
        if not self.pk:  # Check if this is a new transaction
            if self.from_account.balance >= self.amount:
                self.from_account.balance -= self.amount
                self.to_account.balance += self.amount

                self.from_account.save()
                self.to_account.save()
            else:
                print('Insufficient balance for this transaction')
                raise InsufficientBalanceError('Insufficient balance for this transaction')
        super(Transactions, self).save(*args, **kwargs)
