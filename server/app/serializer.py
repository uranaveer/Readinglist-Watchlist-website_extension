from .models import Post,UserData
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['username','avatar_id']

class PostSerializers(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Post
        fields =['id','title','description','link','user']