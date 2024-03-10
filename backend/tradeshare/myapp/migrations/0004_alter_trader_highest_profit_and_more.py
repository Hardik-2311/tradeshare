# Generated by Django 4.2.5 on 2024-03-09 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_alter_trader_average_return_alter_trader_experience_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trader',
            name='highest_profit',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='trader',
            name='premium_price',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
    ]
