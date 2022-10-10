from email.policy import default
from django.db import models
from datetime import datetime

from unittest.util import _MAX_LENGTH
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

from django.db import models

# Create your models here.

# model used for matching users. users are deleted from this table once they are matched
class TempUser(models.Model):
    username = models.CharField(max_length=20)
    knows = models.CharField(max_length=20)
    learning = models.CharField(max_length=20)
    room_name = models.ForeignKey('ChatRoom', on_delete=models.CASCADE, blank=True, null=True)

class MyUser(AbstractUser):
    email = models.EmailField(unique=True)
    default_knows_language = models.CharField(max_length=200, blank=True, null=True)
    default_learning_language = models.CharField(max_length=200, blank=True, null=True)


class ChatRoom(models.Model):
    users = models.ManyToManyField(MyUser, related_name = 'chats')
    websocket_url = models.URLField(blank=True, null=True)

class Message(models.Model):
    content = models.CharField(max_length=5000)
    sender = models.ForeignKey('MyUser', on_delete = models.SET_NULL, null=True, related_name='sender')
    chat = models.ForeignKey('ChatRoom', related_name='messages', on_delete=models.CASCADE)
    send_time = models.DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        '''On save, update timestamps'''
        if not self.id:
            self.send_time = timezone.now()
            return super(Message, self).save(*args, **kwargs)


