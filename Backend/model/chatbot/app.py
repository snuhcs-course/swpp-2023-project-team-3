from typing import List
import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding
from datetime import datetime
import openai
from gpt import GPT
import requests

app = Flask(__name__)
fclip = ClipTextEmbedding()
gpt = GPT()

def get_chatHistory(chatroom):
    response = requests.get(f"http://3.34.1.54/history/chat/{chatroom}")
    return response

def post_log(sendDict):
    response = requests.post("http://3.34.1.54/history/chat-record/", data=sendDict)
    return response

@app.route("/ping", methods=["GET"])
def ping():
    health = fclip._check_model()  # You can insert a health check here
    status = 200 if health else 404
    return Response(response="\n", status=status, mimetype="application/json")

@app.route("/invocations", methods=["POST"])
def predict():
    data = None
    sendDict = {}
    if request.content_type == "application/json":
        """
        request body should be :
        {
            "user" : 1203,
            "chatroom" : 12, 있을 수도 없을 수도
            "query" : "아무말", 유저 아무말 
        }
        """
        data = request.data.decode("utf-8")
        inputs = json.loads(data)
        user_text = inputs["query"]
        user_id= inputs['user']
        
        # is existing chat session
        # receives chat history
        if "chatroom" in inputs.keys():
            chat_id = inputs["chatroom"]
            history_response = get_chatHistory(chat_id)
            if history_response.status_code == 200:
                history_response = history_response.json()
            else :
                return Response(response=json.dumps({"errorMessage": "Sorry, we couldn't retrieve the chat history at the moment. Please try again later.",
                                                     "statusCode": "500"}), status=200, mimetype="application/json")
            
            gpt_response = gpt.get_response(user_text, history_response)
            if len(gpt_response['gpt_queries'])>0 :
                ret_dict, sendDict = fclip.ret_queries(gpt_response['gpt_queries'])
            else:
                sendDict = {"gpt_query1":None,
                            "gpt_query2":None,
                            "gpt_query3":None}
                ret_dict = {}
            sendDict["items"] = ret_dict
            sendDict["answer"] = gpt_response["answer"]
            sendDict["summary"] = gpt_response["summary"]
            sendDict["query"] = user_text
            sendDict["chatroom"] = chat_id

        # a new chat session
        # needs to send user_id
        else :
            gpt_response = gpt.get_response(user_text, chat_history=None)
            if len(gpt_response['gpt_queries'])>0 :
                ret_dict, sendDict = fclip.ret_queries(gpt_response['gpt_queries'])
            else:
                sendDict = {"gpt_query1":None,
                            "gpt_query2":None,
                            "gpt_query3":None}
                ret_dict = {}
            sendDict["user"] = user_id
            sendDict["items"] = ret_dict
            sendDict["answer"] = gpt_response["answer"]
            sendDict["summary"] = gpt_response["summary"]
            sendDict["query"] = user_text

        chatPost_response = post_log(json.dumps(sendDict))
    
        if chatPost_response.status_code == 201:
            chatPost_response = chatPost_response.json()
            chat_id = chatPost_response.get("chatroom_id")

            # needs to send chat_id to the app
            if (chat_id):
                sendDict["chatroom"] = chat_id
                return Response(response=json.dumps(sendDict), status=200, mimetype="application/json")
            
            # shouldn't include chat_id 
            else:
                return Response(response=json.dumps(sendDict), status=200, mimetype="application/json")

    # Handling internal error with a more descriptive message
    return Response(response=json.dumps({"errorMessage": "Internal server error. Please try again later or contact support if the issue persists.",
                                         "statusCode": "400"}), 
                    status=200, mimetype="application/json")