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
]