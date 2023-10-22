# from s3 import download_imgvector
import torch
from transformers import CLIPModel, CLIPProcessor
import os
import json
import numpy as np
import pandas as pd

cwd = os.getcwd()
model_dir = "model_config"
MODEL_PATH = os.path.join(cwd, model_dir)

"""
before run this code
model = CLIPModel.from_pretrained("patrickjohncyh/fashion-clip")
processor = CLIPProcessor.from_pretrained("patrickjohncyh/fashion-clip")
model.save_pretrained("./model_config")
processor.save_pretrained("./model_config)
"""

class ClipTextEmbedding(object):
    model = None 
    processor = None
    
    @classmethod
    def _check_model(cls):
        return cls.model is not None

    @classmethod
    def __init__(cls):
        cls.model, cls.processor = cls._get_model()

    @classmethod
    def _get_model(cls):
        if cls.model == None:
            model = CLIPModel.from_pretrained(MODEL_PATH)
            processor = CLIPProcessor.from_pretrained(MODEL_PATH)
        return model, processor

    @classmethod
    def encode_text(cls, inputText):
        input_vectors = cls.processor(text=inputText, return_tensors="pt", max_length=77, padding="max_length", truncation=True)
        text_embeddings = cls.model.get_text_features(**input_vectors).detach().cpu().numpy()
        # text_embeddings = text_embeddings[0].tolist()
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
    def get_similarity(cls, inputText):
        # Encode the query text to get a text embedding
        text_embedding = cls.encode_text(inputText)
        # print(max(text_embedding))
        # a = np.array(text_embedding)
        
        image_embeddings, subset = cls.load_imgVector()
        image_embeddings = image_embeddings/np.linalg.norm(image_embeddings, ord=2, axis=-1, keepdims=True)
        text_embedding = text_embedding/np.linalg.norm(text_embedding, ord=2, axis=-1, keepdims=True)
        # print(np.sqrt(np.sum(text_embedding**2)))
        # Compute similarities between the text embedding and image embeddings
        similarities = np.dot(text_embedding, image_embeddings.T)

        # print(similarities.shape)
        # print(similarities[0])
        print(np.max(similarities[0]))
        print(np.min(similarities[0]))
        subset['sim'] = similarities[0]
        
        subset = subset.sort_values(by='sim', ascending=False)
        
        matched_objects = subset.head(50)
        matched_objects = matched_objects['id'].tolist()
        
        # return matched_objects[:50]
        return matched_objects

if __name__=="__main__":
    fclip = ClipTextEmbedding()
    print(fclip._check_model())