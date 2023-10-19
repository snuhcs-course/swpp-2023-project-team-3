from rest_framework import serializers

from items.models import *
from search.serializers import GptChatSerializer, SearchLogSerializer

class ItemSerializer(serializers.ModelSerializer):
    gpt_query_history = GptChatSerializer(many=True, source="gptchat_set")
    search_query_istory = SearchLogSerializer(many=True, source="searchlog_set")

    class Meta:
        model = Item
        fields = "__all__"
        depth = 5

    def get_field_names(self, declared_fields, info):
        expanded_fields = super(ItemSerializer, self).get_field_names(declared_fields, info)

        if getattr(self.Meta, 'extra_fields', None):
            return self.Meta.extra_fields + expanded_fields
        else:
            return expanded_fields

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"