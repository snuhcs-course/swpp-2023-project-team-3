from transformers import CLIPModel, CLIPProcessor
import os
import json
import numpy as np
import pandas as pd
from typing import List

cwd = os.getcwd()
model_dir = "model_config"

MODEL_PATH = os.path.join(cwd, model_dir)
FASHIONCLIP_SOURCE = "patrickjohncyh/fashion-clip"


class ClipTextEmbedding(object):
    model = None 
    processor = None
    
    @classmethod
    def _check_model(cls):
        return cls.model is not None

    @classmethod
    def __init__(cls):
        # if cls.model == None:
        #     print("It's None")
        cls.model, cls.processor = cls._get_model()

    @classmethod
    def _get_model(cls):
        if cls.model == None:
            if os.path.exists(MODEL_PATH) == False:
                cls.model = CLIPModel.from_pretrained(FASHIONCLIP_SOURCE)
                cls.processor = CLIPProcessor.from_pretrained(FASHIONCLIP_SOURCE)
                cls.model.save_pretrained(MODEL_PATH)
                cls.processor.save_pretrained(MODEL_PATH)
            else :
                cls.model = CLIPModel.from_pretrained(MODEL_PATH)
                cls.processor = CLIPProcessor.from_pretrained(MODEL_PATH)
        return cls.model, cls.processor

    @classmethod
    def encode_text(cls, inputText:List[str]):
        input_vectors = cls.processor(text=inputText, return_tensors="pt", max_length=77, padding="max_length", truncation=True)
        text_embeddings = cls.model.get_text_features(**input_vectors).detach().cpu().numpy()
        return text_embeddings
    
    @classmethod
    def load_imgVector(cls):
        # if os.path.exists("./img_vectors.csv") == False :
        #     print("no such file")
        #     download_imgvector()
        img_vector = np.loadtxt("./img_vectors.csv", delimiter=",")
        item_df = pd.read_csv("./item_df.csv")
        subset = item_df[['id']]
        return img_vector, subset

    @classmethod
    def get_similarity(cls, inputText:List[str])->pd.DataFrame:
        # Encode the query text to get a text embedding
        text_embedding = cls.encode_text(inputText)
        
        image_embeddings, subset = cls.load_imgVector()
        image_embeddings = image_embeddings/np.linalg.norm(image_embeddings, ord=2, axis=-1, keepdims=True)
        text_embedding = text_embedding/np.linalg.norm(text_embedding, ord=2, axis=-1, keepdims=True)
        similarities = np.dot(text_embedding, image_embeddings.T)
        
        for i in range(similarities.shape[0]):
            subset[f'query_{i}'] = similarities[i]

        itemdf = subset.copy()
        return itemdf

    @classmethod
    def ret_queries(cls, queryList:List[str]):
        itemdf = cls.get_similarity(queryList)
        means = []
        for col in itemdf.columns.tolist():
            if col != "id":
                means.append(itemdf[col].mean())
        means = np.array(means)
        threshold = means.max()
        returnDict = {}
        sendDict = {}
        dict_key = ["query", "gpt_query1", "gpt_query2", "gpt_query3"]
        for i, query in enumerate(queryList):
            tmpDict = {}
            tmpdf = itemdf[["id", f'query_{i}']]
            for j in range(len(tmpdf)):
                if tmpdf.iloc[j][f'query_{i}'] >= threshold:
                    tmpDict[int(tmpdf.iloc[j]['id'])] = tmpdf.iloc[j][f'query_{i}']
            sendDict[dict_key[i]] = query
            returnDict[dict_key[i]] = tmpDict

        return returnDict, sendDict