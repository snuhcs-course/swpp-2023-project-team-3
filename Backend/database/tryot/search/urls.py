from django.urls import path
from search import views

urlpatterns = [
    path("detail/<str:user>", views.queryHistoryAPI),
    path("chat/<str:pk>", views.chatHistoryAPI),
    path("chat-record/", views.saveChat),
    path("search-record/", views.saveSearch),
    path("search-item-record/", views.saveSearchItem),
    path("item-click-view/<str:user>", views.clickedItemsAPI)
]