# Generated by Django 5.1.4 on 2024-12-09 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skills', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='skills',
            name='id',
        ),
        migrations.AlterField(
            model_name='skills',
            name='skill',
            field=models.CharField(max_length=50, primary_key=True, serialize=False),
        ),
    ]
