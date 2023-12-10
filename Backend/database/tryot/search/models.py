from django.db import models
from django.utils import timezone

from users import models as users_models
from items import models as items_models

class SearchLog(models.Model):
    user = models.ForeignKey(
        users_models.User,
        related_name="search_log",
        null=True,
        on_delete=models.SET_NULL
    )
    query = models.TextField(null=True)
    gpt_query1 = models.TextField(null=True)
    gpt_query2 = models.TextField(null=True)
    gpt_query3 = models.TextField(null=True)
    is_deleted = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default = timezone.now)

    items = models.ManyToManyField(items_models.Item, through='SearchItems')

    def __str__(self):
        return self.query

class ChatLog(models.Model):
    user = models.ForeignKey(
        users_models.User,
        related_name="chat_log",
        null=True,
        on_delete=models.SET_NULL
    )
    summary = models.TextField()
    is_deleted = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default = timezone.now)

class UserChat(models.Model):
    log = models.ForeignKey(
        ChatLog,
        blank=True,
        null=True,
        related_name="userChat",
        on_delete=models.CASCADE
    )
    query = models.TextField()
    is_deleted = models.BooleanField(default = False)
    timestamp = models.DateTimeField(default = timezone.now)

    items = models.ManyToManyField(items_models.Item, through='ChatItems')

class GptChat(models.Model):
    user_chat = models.ForeignKey(
        UserChat,
        blank=True,
        null=True,
        related_name="gptChat",
        on_delete=models.CASCADE
    )
    answer = models.TextField()
    gpt_query1 = models.TextField(null=True)
    gpt_query2 = models.TextField(null=True)
    gpt_query3 = models.TextField(null=True)   
    is_deleted = models.BooleanField(default=False) 
    timestamp = models.DateTimeField(default = timezone.now)

class SearchItems(models.Model):
    search = models.ForeignKey(
        SearchLog,
        related_name="searchItems",
        on_delete=models.CASCADE
    )
    item = models.ForeignKey(
        items_models.Item,
        related_name="searchItems",
        on_delete=models.CASCADE
    )
    similarity = models.FloatField()
    

class ChatItems(models.Model):
    chat = models.ForeignKey(
        UserChat,
        related_name="chatItems",
        on_delete=models.CASCADE
    )
    item = models.ForeignKey(
        items_models.Item,
        related_name="chatItems",
        on_delete=models.CASCADE
    )
    similarity = models.FloatField()