# Generated by Django 4.2.1 on 2023-05-29 17:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0002_rename_cartitem_cartitems'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cartitems',
            name='total_items',
        ),
    ]
