import pandas as pd
import math
from items.models import *

category_hierarchy = {
    'Clothing': {
      'Accessories',
      'Beachwear',
      'Coats',
      'Denim',
      'Dresses',
      'Jackets',
      'Knits',
      'Pants',
      'Skirts',
      'Tailoring',
      'Tops'
   },
    'Activewear': {
      'Performance Jackets',
      'Performance Shorts',
      'Performance Tops',
      'Performance Trousers'
    },
    'Lingerie & Nightwear': {
      'Loungewear',
      'Nightwear',
      'Pantyhose & Stockings'
    }
}

gender_mapping = {
    'Woman': 'F',
    'Man': 'M',
    'Unisex': 'U',
}

def run():
    item_df = pd.read_csv("./items/scripts/item_df.csv")

    Item.objects.all().delete()
    Category.objects.all().delete()
    Brand.objects.all().delete()

    # add categories
    category_id = 0
    category_buffer = {}
    for ctg1 in ['Women', 'Unisex']:
        parent = Category.objects.create(id=category_id, name=ctg1)
        category_id += 1
        for ctg2 in category_hierarchy.keys():
            tmp_parent = parent
            parent = Category.objects.create(id=category_id, name=ctg2, parent=parent)
            category_id += 1
            for ctg3 in category_hierarchy[ctg2]:
                category_buffer[f'{ctg1} {ctg3}'] = Category.objects.create(id=category_id, name=ctg3, parent=parent)
                category_id += 1
            parent = tmp_parent
    
    # add brands
    brand_id = 0
    brand_buffer = {}
    brands = set(item_df['brandName'])
    for brand in brands:
        brand_buffer[brand] = Brand.objects.create(id=brand_id, name=brand)
        brand_id += 1

    # add items
    for item in item_df.itertuples():
        # get brand
        brand = brand_buffer[item.brandName]
        
        # get categories
        categories = []
        all_categories = item.categories.split(', ')
        ctg1 = all_categories[0]
        if all_categories[:2] == ['Women', 'Men'] or all_categories[:2] == ['Men', 'Women']:
            ctg1 = 'Unisex'
        for ctg3 in all_categories:
            if category_buffer.get(f"{ctg1} {ctg3}"):
                categories.append(category_buffer.get(f"{ctg1} {ctg3}"))
        
        item = Item.objects.create(
            id=item.id, 
            name=item.shortDescription,
            description=item.description,
            gender = gender_mapping[item.gender],
            image_url=[item.imageUrl],
            order_url=item.path,
            brand=brand,
            price=item.itemPrice if not math.isnan(item.itemPrice) else None,
            material=item.materials.split(", "), 
            color=item.colors.split(", "),
        )
        item.category.add(*categories)



