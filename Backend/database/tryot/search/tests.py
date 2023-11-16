from django.test import TestCase, Client
import requests
import json
from .models import *
from .views import *
from .serializers import *
from users.models import User 
from items.models import *
from .private_constants import (
    SEARCH_API,
    CHATBOT_API
)

client = Client()


class SearchTestCase(TestCase):
    
    def test_queryHistoryAPI(self):
        outputs = self.test_saveSearch()
        user_id = outputs['user_id']
        response = client.get(f'/history/detail/{user_id}')
        self.assertEquals(response.status_code, 200)

    def test_chatHistoryAPI(self):

        return True
    def test_saveChat(self):

        return True
    def test_saveSearch(self):
        user = User.objects.create(
            username = "test_user",
            email = "test_user@test.com",
            nickname = "test01",
            gender = "M",
            age = 1
        )
        user.set_password("test_user")
        user.save()
        inputs = {
            "user_id" : user.id,
            "text" : "fashionable jeans"
        }
        inputs = json.dumps(inputs)
        
        # headers = {'Content-Type': 'application/json'}
        # data = requests.post(SEARCH_API, data=inputs, headers=headers)
        # data = data.json()
        # request = {
        #     "user" : user.id,
        #     "query" : data['text'][0],
        #     "gpt_query1" : data['text'][1],
        #     "gpt_query2" : data['text'][2],
        #     "gpt_query3" : data['text'][3]
        # }
        # tmp
        data = {
            "user" : user.id,
            "query" : "text1", 
            "gpt_query1" : "text1",
            "gpt_query2" : "text2",
            "gpt_query3" : "text3",
        }
        
        searchLogSerializer = SearchLogSerializer(data = data)
        if searchLogSerializer.is_valid():
            response = client.post("/history/search-record/", data=json.dumps(data), content_type='application/json')
            print(response)
            self.assertEqual(response.status_code, 201)
        return response.json()
        
    def test_saveSearchItem(self):
        output = self.test_saveSearch()
        searchLog_id = output['log_id']
        search = SearchLog.objects.get(id=searchLog_id)
        item = Item.objects.create(
            id = 1,
            name = "TEST_CLOTHES",
            description = "TEST_DESCRIPTION",
            price = 10000,
            image_url = ["TEST_URL"],
            order_url = "TEST_URL",
        )
        item.save()
        data = {
            "search" : search.id,
            "item" : item.id,
            "similarity" : 0.5
        }
        searchItemsSerializer = SearchItemsSerializer(data=data)
        if searchItemsSerializer.is_valid():
            response = client.post("/history/search-item-record/", data=json.dumps(data), content_type="application/json")
        self.assertEqual(response.status_code, 201)