from django.test import TestCase, Client
import json

# from rest_framework.test import APITestCase
from .views import *
from .models import User
from .serializers import *


client = Client()

class UsersTestCase(TestCase):

    def test_create_user(self):
        user = User.objects.create_user(
            username = "test_user",
            email = "test_user@test.com",
            nickname = "test01",
            gender = "M",
            age = 1
        )
        user.set_password("test_user")
    
        self.assertIsInstance(user, User)
        self.assertFalse(user.is_staff)
        self.assertEqual(user.email, "test_user@test.com")


    def test_register_user(self):
        data = {
            "username" : "test01",
            "email" : "test01@test.com",
            "nickname" : "test01",
            "gender" : "M",
            "age" : 1,
            "password" : "test_user"
        }
        data_json = json.dumps(data)
        response = client.post('/user/register/', data=data_json, content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_login_username(self):
        user = User.objects.create_user(
            username = "test_user",
            email = "test_user@test.com",
            nickname = "test01",
            gender = "M",
            age = 1
        )
        user.set_password("test_user")
        user.save()
        data = {
            "username" : "test_user",
            "password" : "test_user"
        }
        data_json = json.dumps(data)
        response = client.post('/user/login/', data=data_json, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_login_email(self):
        user = User.objects.create_user(
            username = "test_user",
            email = "test_user@test.com",
            nickname = "test01",
            gender = "M",
            age = 1
        )
        user.set_password("test_user")
        user.save()
        data = {
            "username" : "test_user@test.com",
            "password" : "test_user"
        }
        data_json = json.dumps(data)
        response = client.post('/user/login/', data=data_json, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_getUserAPI(self):
        user = User.objects.create_user(
            username = "test_user",
            email = "test_user@test.com",
            nickname = "test01",
            gender = "M",
            age = 1
        )
        user.set_password("test_user")
        user.save()
        pk = user.id 
        response = client.get(f'/user/user-info/{pk}')
        self.assertEqual(response.status_code, 200)

    def test_logout(self):
        dict = self.test_login_email()
        token = dict['token']
    
        header = {
            "HTTP_AUTHORIZATION": f"Token {token}"
        }
        response = client.post('/user/logout/', data=json.dumps(dict), content_type='application/json',**header)
        self.assertEqual(response.status_code, 200)

        