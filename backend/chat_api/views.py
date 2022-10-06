from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import MyUserSerializer
from .models import *
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


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
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
        )
        serializer = MyTokenObtainPairSerializer(user, many=False)
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
        room_id = match.room_name.id
        room = match.room_name
        room.users.add(user)
        request.session["online_user_id"] = user.id
        request.session.modified = True
        match.delete()
    else:
        print("no match")
        room = ChatRoom.objects.create()
        room.websocket_url = f'ws://127.0.0.1:8000/ws/socket-server/{room.id}/'
        temp_user = TempUser.objects.create(username=username, knows=know_languages, learning=learning_languages, room_name=room)
        room.users.add(user)
        room.save()
        request.session["temp_user_id"] = temp_user.id
        request.session["online_user_id"] = user.id
        request.session.modifed = True
        room_id = room.id
    return JsonResponse({
    "room_id": room_id,
    "users": [user.username for user in room.users.all()],
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
        chat_info['users'] = [user.username for user in chat.users.all()]
        chats.append(chat_info)
    return Response(chats) 

@csrf_exempt
@api_view(['POST'])
def messages(request):
    user_id = request.data['user_id']
    user = MyUser.objects.get(id=user_id)
    user_messages = {}
    for chat in user.chats.all():
        chat_messages = []
        for message in chat.messages.all().order_by('send_time'):
            message_info = {'content': message.content, 'sender': message.sender.id, 'chat': message.chat.id}
            chat_messages.append(message_info)
        user_messages[chat.id] = chat_messages
    return JsonResponse(user_messages, safe=False)

@csrf_exempt
@api_view(['POST'])
def save_message(request):
    content = request.data['content']
    user_id = request.data['user_id']
    chat_id = request.data['chat_id']
    Message.objects.create(
        content=content, 
        sender = MyUser.objects.get(id=user_id),
        chat = ChatRoom.objects.get(id=chat_id)
        )
    return Response({'detail': 'word saved successfully'}, status=status.HTTP_200_OK)
    

