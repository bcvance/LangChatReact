from uuid import uuid4
from django.db.models.signals import post_save, m2m_changed
from .models import ChatRoom
from .serializers import ChatRoomSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# when chat has been created, send message to all users in group (chat) 
# in order to notify them of creation of chat. this will trigger frontend to make
# call to api to fetch info about new chat
def notify_user(sender, instance, **kwargs):
    print('signal fired')
    chat = instance
    channel_layer = get_channel_layer()
    # user_group_name is a group containing only the user whose username is contained in it
    # by sending a message to this group, only that one user will receive it 
    user_group_name = f'user_{chat.user.username}'
    room_group_name = f'chat_{chat.shared_id}'
    print(room_group_name)
    serializer = ChatRoomSerializer(chat)
    chat_data = serializer.data
    chat_data['type'] = 'new_chat_message'

    # on the frontend, in Conversations.js, this message will trigger an API call to fetch the new chat
    print('before send')
    async_to_sync(channel_layer.group_send)(
        user_group_name,
        {
            'type': 'new_chat_message',
            "shared_id": chat.shared_id,
            # get all users who are in a chatroom with the given shared_id
            "last_saved": chat.last_saved.isoformat(),
            "websocket": str(chat.websocket_url)
        }
    )

    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            'type': 'new_chat_message',
            "shared_id": chat.shared_id,
            # get all users who are in a chatroom with the given shared_id
            "last_saved": chat.last_saved.isoformat(),
            "websocket": str(chat.websocket_url)
        }
    )
    print('after send')
# states that this signal should be executed after a new ChatRoom instance has been saved to the database   
post_save.connect(notify_user, sender=ChatRoom, dispatch_uid='unique string')
# m2m_changed.connect(notify_user)


# # whenever a new message is created, update the timestamp for the most recent message for each chat
# def update_last_saved(sender, instance, **kwargs):
#     message = instance
#     chats = message.chats.all()
#     for chat in chats:
#         chat.send_time = timezone.now()



