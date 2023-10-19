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
    query = models.TextField()
    is_deleted = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default = timezone.now)

    items = models.ManyToManyField(items_models.Item)

class ChatLog(models.Model):
    user = models.ForeignKey(
        users_models.User,
        related_name="chat_log",
        null=True,
        on_delete=models.SET_NULL
    )
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
    timestamp = models.DateTimeField(default = timezone.now)

class GptChat(models.Model):
    log = models.ForeignKey(
        ChatLog,
        blank=True,
        null=True,
        related_name="gptChat",
        on_delete=models.CASCADE
    )
    answer = models.TextField()
    is_deleted = models.BooleanField(default=False) 
    timestamp = models.DateTimeField(default = timezone.now)

    items = models.ManyToManyField(items_models.Item)
