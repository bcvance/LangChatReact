from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('chat/', views.chat, name='chat'),
    path('conversations/', views.conversations, name='conversations'),
    path('messages/', views.messages, name='messages'),
    path('save_message/', views.save_message, name='save_message'),
    path('register/', views.register_user, name='register'),
    path('delete_convo/', views.delete_convo, name='delete_convo'),
    path('contacts/', views.contacts, name='contacts'),
    path('save_contact/', views.save_contact, name='save_contact'),
    path('manual_chat/', views.manual_chat, name='manual_chat'),
    path('delete_contact/', views.delete_contact, name='delete_contact'),
    path('set_unread/', views.set_unread, name='set_unread'),
    path('set_read/', views.set_read, name='set_read'),
    path('cancel_search/', views.cancel_search, name='cancel_search'),
]