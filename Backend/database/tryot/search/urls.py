from django.urls import path
from search import views

urlpatterns = [
    path("detail/<str:user>", views.queryHistoryAPI),
    path("chat/<str:pk>", views.chatHistoryAPI),
]