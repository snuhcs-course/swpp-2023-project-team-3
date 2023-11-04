# from flask_restx import Api, Resource, reqparse
from typing import List
import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding
from datetime import datetime
from gpt import GPT
import requests

app = Flask(__name__)
# api = Api(app, version='1.0', title='API 문서', description='Swagger 문서', doc="/api-docs")
# test_api = api.namespace('test', description='조회 API')

fclip = ClipTextEmbedding()
gpt = GPT()

# @test_api.route('/')
# class Test(Resource):
#     def get(self):
#         health = fclip._check_model()
#         status = 200 if health else 404
#         return Response(response="\n", status=status, mimetype="application/json")
    
#     def post(self):
#         return Response(response=output, status=status, mimetype="application/json")

@app.route("/ping", methods=["GET"])
def ping():
    health = fclip._check_model()  # You can insert a health check here
    status = 200 if health else 404
    return Response(response="\n", status=status, mimetype="application/json")

@app.route("/invocations", methods=["POST"])
async def predict():
    data = None
    queryList = [] # query를 담을 list
    if request.content_type == "application/json":
        """
        request body should be :
        {
            "user_id" : 1203,
            "text" : "A-Line Dresses and Skirts", String
        }
        """
        data = request.data.decode("utf-8")
        inputs = json.loads(data)
        queryList.append(inputs['text'])
        user_id = inputs['user_id']
        timestamp = int(datetime.now().timestamp())
    else :
        return Response(
            response="This predictor only supports for plain-text in English", status=415, mimetype="text/plain"
        )
    
    gptResponse = gpt.get_response(queryList[0])
    gptResponse = gptResponse["choices"][0]["text"].strip()
    try : 
        gptResponses = gptResponse.split(",")
    except :
        return Response({"GPT is not available, please turn it off."}, status=424, mimetype="application/json")
    
    gptInputs = gptResponses[1:]

    if gptResponses[0] == "1":
        for cnt, query in enumerate(gptInputs):
            if cnt < 3:
                queryList.append(query.strip())
        finalDict, sendDict = fclip.ret_queries(queryList)
        
        async def post_log(sendDict):
            response = requests.post("http://127.0.0.1:5000/tests", json=sendDict)
            return response
        
        response = await post_log(sendDict)

    else :
        return Response(response={"Your query is not related to Fashion."}, status=400, mimetype="application/json")
    if response.status_code == 200:
        output = {"user_id": user_id,
                "text" : queryList,
                "items":finalDict,
                "timestamp":timestamp}
        
        return Response(response=json.dumps(output), status=200, mimetype="application/json")
    else:
        return Response(response={"Internal Server is not working."}, status=500, mimetype="application/json")


