from django.test import TestCase, Client
import json

# from rest_framework.test import APITestCase
from .views import *
from .models import Item, Brand, Category
from .serializers import *

client = Client()

class ItemTestCase(TestCase):
    
    def test_item_info(self):
        _brand = Brand(
            id = 123,
            name = "TEST_BRAND"
        )
        _brand.save()
        _cat1 = Category.objects.create(id=0, name="cate_1")
        _cat2 = Category.objects.create(id=1, name="cate_2", parent=_cat1)
        _cat1.save()
        _cat2.save()
        _cats = [_cat1, _cat2]
        item = Item.objects.create(
            id = 1,
            name = "TEST_CLOTHES",
            description = "TEST_DESCRIPTION",
            price = 10000,
            image_url = ["TEST_URL"],
            order_url = "TEST_URL",
            brand = _brand,
        )
        item.category.add(*_cats)
        pk = item.id 
        response = client.get(f'/items/item-info/{pk}')
        self.assertEqual(response.status_code, 200)

        
