# Generated by Django 3.2.16 on 2024-08-05 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_auto_20240805_1858'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='sequential_number',
            field=models.PositiveIntegerField(editable=False, null=True, unique=True),
        ),
    ]
