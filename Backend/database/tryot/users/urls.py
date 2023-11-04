from django.urls import path

from users.views import *

urlpatterns = [
    path("user-info/<str:pk>", getUserAPI),
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('token-check/<str:token>', user_login_continue, name='login-continue'),
    path('logout/', user_logout, name='logout'),
    path('change-password/', change_password, name='change-password'),
    path('delete-account/', delete_account, name='delete-account'),
    path('reset-password/', reset_password, name='reset-password')
]