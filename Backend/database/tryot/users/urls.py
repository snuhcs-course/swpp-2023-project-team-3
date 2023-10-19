from django.urls import path
from users import views

urlpatterns = [
    path("user-info/<str:pk>", views.getUserAPI)
]