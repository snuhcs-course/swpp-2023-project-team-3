# from flask_restx import Api, Resource, reqparse
from typing import List
import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding
from datetime import datetime
from gpt import GPT
import requests
import asyncio

app = Flask(__name__)

fclip = ClipTextEmbedding()
gpt = GPT()

async def post_log(sendDict):
    response = requests.post("http://3.34.1.54/history/search-record/", data=sendDict)
    return response
    
@app.route("/ping", methods=["GET"])
def ping():
    health = fclip._check_model()  # You can insert a health check here
    status = 200 if health else 404
    return Response(response="\n", status=status, mimetype="application/json")

def is_binary(s):
    try: 
        if (int(s) == 0 or int(s) == 1): return True
    except ValueError:
        return False
    else:
        return False

@app.route("/invocations", methods=["POST"])
def predict():
    data = None
    queryList = [] # query를 담을 list
    if request.content_type == "application/json":
        """
        request body should be :
        {
            "user_id" : 1203,
            "text" : "A-Line Dresses and Skirts", String
        }
        or if request is for research
        {
            "user_id" : 1,
            "query" : String,
            "gpt_query1" : String,
            "gpt_query2" : String,
            "gpt_query3" : String
        }
        """

        data = request.data.decode("utf-8")
        inputs = json.loads(data)
        if "query" in inputs.keys():
            timestamp = int(datetime.now().timestamp())
            try :
                user_id =inputs['user_id']
                query =inputs['query']
                gpt_query1 =inputs['gpt_query1']
                gpt_query2 =inputs['gpt_query2']
                gpt_query3 =inputs['gpt_query3']
                queryList = [query, gpt_query1, gpt_query2, gpt_query3]
            except :
                keyset = set(inputs.keys())
                originalKeySet = {'user_id', 'query', 'gpt_query1', 'gpt_query2', 'gpt_query3'}
                missingKeyset = originalKeySet.difference(keyset)
                return Response(response=json.dumps({"message" : f"Research request should have 'user_id', 'query', 'gpt_query1', 'gpt_query2', 'gpt_query3', but now it misses {missingKeyset} keys."}), status=402, mimetype="application/json")
            finalDict, sendDict = fclip.ret_queries(queryList)
            output = {
                "user_id" : user_id,
                "text" : queryList,
                "items" : finalDict,
                "timestamp" : timestamp,
            }
            return Response(response=json.dumps(output), status=200, mimetype="application/json")
        else:
            # for the first time search request
            queryList.append(inputs['text'])
            user_id = inputs['user_id']
            timestamp = int(datetime.now().timestamp())
            try : 
                gptResponse = gpt.get_response(queryList[0])
                gptResponse = gptResponse["choices"][0]["text"].strip()
            except :
                return Response(response=json.dumps({"errorMessage" : "Oops! GPT is currently unavailable. Please disable GPT refinement for now.",
                                                     "statusCode": "424"}), status=200, mimetype="application/json")
            
            gptResponses = gptResponse.split(",")

            if (gptResponses[0] == "0"): 
                return Response(response=json.dumps({"errorMessage" : "Oops! Fashion-related searches only, please.",
                                                     "statusCode": "400"}), status=200, mimetype="application/json")
            if not (is_binary(gptResponses[0]) and len(gptResponses) >= 2):
                return Response(response=json.dumps({"errorMessage" : "Oops! Please try a fashion-related search. Turn off GPT refinement if issues persist.",
                                                     "statusCode": "424"}), status=200, mimetype="application/json")

            gptInputs = gptResponses[1:]

            # if gptResponses[0] == "1":  # user query is fashion-relevant

            # Now gptResponses[0] is always 1
            for cnt, query in enumerate(gptInputs):
                if cnt < 3:
                    queryList.append(query.strip())
            finalDict, sendDict = fclip.ret_queries(queryList)
            sendDict["user"] = user_id
            sendDict = json.dumps(sendDict)
            loop = asyncio.get_event_loop()
            response = loop.run_until_complete(post_log(sendDict))

            # else :
            #     return Response(response=json.dumps({"errorMessage" : "Oops! Fashion-related searches only, please.",
            #                                          "statusCode": "400"}), status=200, mimetype="application/json")
    
            if response.status_code == 201:
                response = response.json()
                log_id = response.get("log_id")
                output = {"user_id": user_id,
                        "log_id" : log_id,
                        "text" : queryList,
                        "items":finalDict,
                        "timestamp":timestamp}
                
                return Response(response=json.dumps(output), status=200, mimetype="application/json")
            else:
                return Response(response=json.dumps({"errorMessage" : "Oops! We're currently facing an issue with the Search History feature. Please bear with us and try again later.",
                                                     "statusCode": "500"}), status=200, mimetype="application/json")
    else :
        return Response(
            response=json.dumps({"errorMessage" : "Unsupported media type. Please use 'application/json' content-type."}), status=415, mimetype="text/plain"
        )