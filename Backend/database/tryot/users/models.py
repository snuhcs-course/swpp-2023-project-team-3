from django.db import models

class User(models.Model):
    GENDER_TYPE = [
        ("M", "Male"),
        ("F", "Female"),
    ]


    login_id = models.CharField(max_length=64)
    email = models.EmailField(max_length=128)
    nickName = models.CharField(max_length=64)
    gender = models.CharField(max_length=1, choices=GENDER_TYPE)
    age = models.IntegerField()