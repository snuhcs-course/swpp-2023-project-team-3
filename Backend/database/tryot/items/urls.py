from django.urls import path
from items import views

urlpatterns = [
    path("item-info/<str:pk>", views.itemsAPI)
]