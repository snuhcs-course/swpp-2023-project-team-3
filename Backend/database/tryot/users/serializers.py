from rest_framework import serializers

from users.models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'nickname', 'gender', 'age']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            nickname=validated_data['nickname'],
            gender=validated_data['gender'],
            age=validated_data['age'],
        )
        user.set_password(validated_data['password'])
        user.is_superuser = False
        user.save()

        return user
    
    
    
