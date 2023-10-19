import torch
from transformers import CLIPModel, CLIPProcessor
import os
import json

cwd = os.getcwd()
model_dir = "model_config"
MODEL_PATH = os.path.join(cwd, model_dir)

class ClipTextEmbedding(object):
    model = None 
    processor = None

    @classmethod
    def get_model(cls):
        if cls.model == None:
            cls.model = CLIPModel.from_pretrained(MODEL_PATH)
            cls.processor = CLIPProcessor.from_pretrained(MODEL_PATH)
        return cls.model, cls.processor

    @classmethod
    def predict(cls, inputText):
        model, processor = cls.get_model()
        input_vectors = processor(text=inputText, return_tensors="pt", max_length=77, padding="max_length", truncation=True)
        text_embeddings = model.get_text_features(**input_vectors).detach().cpu().numpy()
        return text_embeddings.tolist()

