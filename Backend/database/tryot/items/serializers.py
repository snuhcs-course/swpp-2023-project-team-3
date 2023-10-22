from rest_framework import serializers

from items.models import *
from search.serializers import UserChatSerializer, SearchLogSerializer

class ItemSerializer(serializers.ModelSerializer):
    chat_query_history = UserChatSerializer(many=True, source="userchat_set")
    search_query_istory = SearchLogSerializer(many=True, source="searchlog_set")

    class Meta:
        model = Item
        fields = "__all__"
        depth = 5

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"