# Generated by Django 4.0.6 on 2022-11-09 23:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_api', '0011_chatroom_has_unread'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatroom',
            name='has_unread',
            field=models.BooleanField(default=True),
        ),
    ]