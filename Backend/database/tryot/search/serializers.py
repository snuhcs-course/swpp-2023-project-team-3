from rest_framework import serializers
from serializers import NotDeletedModelSerializer

from search.models import *

class SearchLogSerializer(NotDeletedModelSerializer):
    class Meta:
        model = SearchLog
        fields = "__all__"

class ChatRoomSerializer(NotDeletedModelSerializer):
    class Meta:
        model = ChatLog
        fields = "__all__"

class UserChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserChat
        fields = "__all__"

class GptChatSerializer(NotDeletedModelSerializer):
    class Meta:
        model = GptChat
        fields = "__all__"

class UserChatWithGptSerializer(NotDeletedModelSerializer):
    gpt_chat = GptChatSerializer(many=True, source="gptChat")

    class Meta:
        model = UserChat
        fields = "__all__"

class ChatLogSerializer(NotDeletedModelSerializer):
    user_chat = UserChatWithGptSerializer(many=True, source="userChat")

    class Meta:
        model = ChatLog
        fields = "__all__"
