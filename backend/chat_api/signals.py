from django.db.models.signals import post_save, m2m_changed
from .models import ChatRoom
from .serializers import ChatRoomSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# when chat has been created, send message to all users in group (chat) 
# in order to notify them of creation of chat. this will trigger frontend to make
# call to api to fetch info about new chat
def notify_user(sender, instance, **kwargs):
    print('notify_user triggered')
    chat = instance
    channel_layer = get_channel_layer()
    user_group_name = f'user_{chat.user.username}'

    async_to_sync(channel_layer.group_send)(
        user_group_name,
        {
            'type': 'new_chat_message'
        }
    )
    print(f'sent to {user_group_name}')
    
post_save.connect(notify_user, sender=ChatRoom)
# m2m_changed.connect(notify_user)


