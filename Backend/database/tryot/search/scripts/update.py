import pandas as pd
from tqdm import tqdm
import os 
import sys 
import django
from search.models import *
from serializers import *
from users.models import User
from items.models import Item

def run():
    hashtag_df = pd.read_csv("./search/scripts/hashtag.csv")
    user = User.objects.get(pk=1)
    print(hashtag_df)
    for i, tag in tqdm(hashtag_df.iterrows()):
        tag=tag.tolist()
        item = Item.objects.get(pk=tag[0])
        tagList = [tag[1], tag[2], tag[3]]
        for t in tagList:
            data = {"user":user, "query":t, "gpt_query1":None, "gpt_query2":None, "gpt_query3":None}
            searchLog = SearchLog.objects.create(**data)
            # searchLogSerializer = SearchLogSerializer(data = data)
            # if searchLogSerializer.is_valid():
                # searchLogSerializer.save()
            searchLog.save()
            data2 = {
                    "search" : searchLog,
                    "item" : item,
                    "similarity" : 0.5
                }
            searchItems = SearchItems.objects.create(**data2)
            searchItems.save()
                # searchItemsSerializer = SearchItemsSerializer(data=data2)
                # if searchItemsSerializer.is_valid():
                #     print(i)
                #     searchItemsSerializer.save()
            
# if __name__=="__main__":
#     run()