from django.contrib import admin
from .models import *

admin.site.register(SearchLog)
admin.site.register(ChatLog)
admin.site.register(UserChat)
admin.site.register(GptChat)
admin.site.register(ChatItems)
admin.site.register(SearchItems)
