from django.test import TestCase, Client
import json

# from rest_framework.test import APITestCase
from .views import *
from .models import Item, Brand, Category
from .serializers import *

client = Client()

class ItemTestCase(TestCase):
    def test_item_info(self):
        _brand = Brand.objects.create(
            id = 123,
            name = "TEST_BRAND"
        )
        _category =Category.objects.create(
            id = 123,
            name = "TEST_CATEGORY"
        )
        item = Item.objects.create(
            name = "TEST_CLOTHES",
            description = "TEST_DESCRIPTION",
            price = 10000,
            category = _category,
            image_url = ["TEST_URL"],
            order_url = "TEST_URL",
            brand = _brand,
        )
        pk = item.id 
        response = client.get(f'/item/item-info/{pk}')
        self.assertEqual(response.status_code, 200)

        