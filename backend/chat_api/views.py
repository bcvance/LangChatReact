from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import MyUserSerializer, MyUserSerializerWithToken
from .models import *
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from datetime import date

import json
from uuid import uuid4


# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        print(attrs)
        print(self.context["request"])
        data = super().validate(attrs)
        serializer = MyUserSerializer(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = MyUser.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password']),
        )
        serializer = MyUserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail':'User with this email already exists.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def chat(request):
    know_languages = request.POST.get("know-languages")
    learning_languages = request.POST.get("learning-languages")
    username = request.POST.get("username")
    request.session["username"] = username
    user = MyUser.objects.get(username=username)
    if TempUser.objects.filter(knows=learning_languages, learning=know_languages).exists():
        print("found match")
        match = TempUser.objects.filter(knows=learning_languages, learning=know_languages).first()
        room_shared_id = match.room_name.shared_id
        room = ChatRoom(
            user=MyUser.objects.get(username=username), 
            shared_id=room_shared_id
            )
        room.websocket_url = f'ws://127.0.0.1:8000/ws/socket-server/{room.id}/'
        room.save()
        print('room saved')
        # get all users in the chat who are not the users associated with the current account
        other_chats = ChatRoom.objects.filter(shared_id = room_shared_id).exclude(user=user)
        other_users = [chat.user for chat in other_chats]
        room.other_users.add(*other_users)

        # add this user to other_users entry for other chats with same shared_id
        for chat in other_chats:
            chat.other_users.add(user)
        request.session["online_user_id"] = user.id
        request.session.modified = True
        match.delete()
    else:
        print("no match")
        room = ChatRoom(
            user=MyUser.objects.get(username=username), 
            shared_id=uuid4()
            )
        room.websocket_url = f'ws://127.0.0.1:8000/ws/socket-server/{room.id}/'
        room.save()
        temp_user = TempUser.objects.create(username=username, knows=know_languages, learning=learning_languages, room_name=room)
        request.session["temp_user_id"] = temp_user.id
        request.session["online_user_id"] = user.id
        request.session.modifed = True
        room_id = room.id
    return JsonResponse({
    "room_id": room.id,
    "shared_id": room.shared_id,
    # get all users who are in a chatroom with the given shared_id
    "user": room.user.username,
    "other_users": [user.username for user in room.other_users.all()]
})

@csrf_exempt
@api_view(['POST'])
def conversations(request):
    user_id = request.data['user_id']
    user = MyUser.objects.get(id=user_id)
    chats = []
    for chat in user.chats.all():
        chat_info = {}
        chat_info['id'] = chat.id
        chat_info['user'] = chat.user.username
        chat_info['shared_id'] = chat.shared_id

        chat_info['other_users'] = [user.username for user in chat.other_users.all()]
        chats.append(chat_info)
    return Response(chats) 

@csrf_exempt
@api_view(['POST'])
def delete_convo(request):
    chat_id = request.data['chat_id']
    # delete chat from database
    ChatRoom.objects.get(id=chat_id).delete()
    return Response({'detail': 'conversation deleted successfully'}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def messages(request):
    user_id = request.data['user_id']
    user = MyUser.objects.get(id=user_id)
    user_messages = {}
    for chat in user.chats.all():
        chat_messages = []
        for message in chat.messages.all().order_by('send_time'):
            message_info = {
                'content': message.content, 
                'sender': message.sender.id, 
                # all of a messages' chats have the same shared_id
                'chat': message.chats.all().first().shared_id, 
                'send_time': message.send_time.isoformat()
                }
            chat_messages.append(message_info)
        user_messages[chat.shared_id] = chat_messages
    return JsonResponse(user_messages, safe=False)

@csrf_exempt
@api_view(['POST'])
def save_message(request):
    content = request.data['content']
    user_id = request.data['user_id']
    chat_id = request.data['chat_id']
    shared_id = request.data['shared_id']
    new_message = Message(
        content = content, 
        sender = MyUser.objects.get(id=user_id),
        )
    # set all of the chats associated with this message
    all_chats = list(ChatRoom.objects.filter(shared_id=shared_id))
    new_message.save()
    new_message.chats.add(*all_chats)


    return Response({'detail': 'word saved successfully'}, status=status.HTTP_200_OK)
    

