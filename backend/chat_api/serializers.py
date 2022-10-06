from rest_framework import serializers
from .models import MyUser
from rest_framework_simplejwt.tokens import RefreshToken

class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id','username','email','is_active','date_joined']

class MyUserSerializerWithToken(MyUserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MyUser
        fields = ['id','username','email','is_active','date_joined', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
