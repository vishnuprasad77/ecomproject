# Generated by Django 4.2.1 on 2023-05-29 15:54

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('products', '0004_productimages'),
        ('cart', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='CartItem',
            new_name='CartItems',
        ),
    ]