from typing import List
import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding
from datetime import datetime
from gpt import GPT
import requests

app = Flask(__name__)
fclip = ClipTextEmbedding()
gpt = GPT()

@app.route("/ping", methods=["GET"])
def ping():
    health = fclip._check_model()  # You can insert a health check here
    status = 200 if health else 404
    return Response(response="\n", status=status, mimetype="application/json")

@app.route("/invocations", methods=["POST"])
async def predict():
    data = None
    if request.content_type == "application/json":
        """
        request body should be :
        {
            "user_id" : 1203,
            "chatroom_id" : 12, 있을 수도 없을 수도
            "query" : "아무말", 유저 아무말 
        }
        """
        data = request.data.decode("utf-8")
        inputs = json.loads(data)
        userQuery = inputs["query"]
        queries = []
        answer = ""
        summary = ""
        """
        get gpt 3 query and put it into queries[]
        """
        
        if "chatroom_id" in inputs.keys():
            chatroom_id = inputs["chatroom_id"]
            async def get_chatHistory(chatroom_id):
                testing ="http://127.0.0.1:5000/tests"
                response = requests.post(f"http://43.201.105.74/history/chat/{chatroom_id}/")
                return response
            response = await get_chatHistory(chatroom_id)
            response = response.json()
        
            """do something"""
            """
            api call (chat history)
            promt -> queries =[] 3개
            """
        else :
            """do something"""
            """
            prompt -> queries[]  3개
            summary 도 받아야함
            """
            """initiate"""

        user_id = inputs['user_id']
        
        ret_dict, sendDict = fclip.ret_queries(queries)
        """
        ret_dict
        {
         10239 : [sim, index],
         22391 : [],
         9개
        }
        """
        sendDict["user_id"] = user_id
        sendDict["answer"] = answer
        sendDict["items"] = ret_dict
        if chatroom_id : 
            sendDict["chatroom_id"] = chatroom_id
        else :
            sendDict["summary"] = summary
    
    return Response(response=json.dumps(sendDict) status=200, mimetype="application/json")

