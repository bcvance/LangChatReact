from email import message
import json
# from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, MyUser, TempUser
from django.db.models.base import ObjectDoesNotExist
from asgiref.sync import async_to_sync
import urllib.parse

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        

        self.accept()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'connection_message',
                'message': 'connected',
            }
        )

    def receive(self, text_data):
        print('receive')
        text_data_json = json.loads(text_data)
        message_username = text_data_json['message_username']
        message_user_id = text_data_json['message_user_id']

        if text_data_json['type'] == 'indiv_message':
            message_user_id = text_data_json['message_user_id']
            username = text_data_json['username']
            async_to_sync(self.channel_layer.group_send)(
                f'user_{message_user_id}',
                {
                    'type': 'indiv_message',
                    'message_username': message_username,
                    'username': username,
                }
            )
        elif text_data_json['type'] == 'id_message':
            self.user_id = text_data_json['user_id']
            self.username = message_username
            self.user_group_name = f'user_{self.username}'

        #     async_to_sync(self.channel_layer.group_add)(
        #         self.user_group_name,
        #         self.channel_name
        # )       
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'id_message',
                    'message': f'{self.username} connected to chat {self.room_name}'
                }
            )     

        else:
            print("message received")
            message = text_data_json['message']

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message_username': message_username,
                    'message_user_id': message_user_id,
                    'message': message,
                    'chat_id': self.room_name,
                }
            )

    def id_message(self, event):
        message = event['message'],
        print(message)
        type = event['type']

        self.send(text_data = json.dumps({
            'type': type,
            'message': message
        }))

    def chat_message(self, event):
        print('chat_message')
        message = event['message']
        message_username = event['message_username']
        message_user_id = event['message_user_id']
        chat_id = event['chat_id']

        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message,
            'message_username': message_username,
            'message_user_id': message_user_id,
            'chat_id': chat_id
        }))

    def connection_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type': 'connection',
            'message': message,
        }))
    
    def indiv_message(self, event):
        message_username = event['message_username']
        username = event['username']

        self.send(text_data=json.dumps({
            'type': 'indiv_message',
            'message_username': message_username,
            'username': username
        }))

    def disconnect_message(self, event):
        message = event['message']
        message_username = event['message_username']
        message_user_id = event['message_user_id']

        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message,
            'message_username': message_username,
            'message_user_id': message_user_id,
        }))


    def disconnect(self, close_code):
        # self.thread = threading.Thread(target=self.delete_users)
        # self.thread.start()
        self.delete_users_n_chats()
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'disconnect_message',
                'message': 'disconnected',
                'message_username': self.username,
                'message_user_id': self.user_id,
            }
        )
        # delete chat group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

        # delete groups for sending messages to individual users
        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name,
            self.channel_name
        )


    def delete_users_n_chats(self):
        # if MyUser.objects.filter(id = self.user_id).exists():
        #     MyUser.objects.get(id = self.user_id).delete()
        if "temp_user_id" in self.scope["session"]:
            if TempUser.objects.filter(id = self.scope["session"]["temp_user_id"]).exists():
                TempUser.objects.get(id = self.scope["session"]["temp_user_id"]).delete()
        # if ChatRoom.objects.filter(id = self.room_name).exists():
        #     ChatRoom.objects.get(id = self.room_name).delete()

