from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    GENDER_TYPE = [
        ("M", "Male"),
        ("F", "Female"),
    ]

    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=100, unique=True)
    nickname = models.CharField(max_length=100, unique=True)
    gender = models.CharField(max_length=1, choices=GENDER_TYPE)
    age = models.IntegerField()

    REQUIRED_FIELDS = ['email', 'nickname', 'gender', 'age']
    
    def __str__(self):
        return self.username
