from flask_restx import Api, Resource, reqparse
from typing import List
import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding
from datetime import datetime
from gpt import GPT

app = Flask(__name__)
api = Api(app, version='1.0', title='API 문서', description='Swagger 문서', doc="/api-docs")
test_api = api.namespace('test', description='조회 API')

fclip = ClipTextEmbedding()
gpt = GPT()

def inputQuery(queryList:List[str])->List[int]:
    itemdf = fclip.get_similarity(queryList)
    print(itemdf.info())
    cols = itemdf.columns.tolist()
    itemdf['sum'] = itemdf[cols[1:]].sum(axis=1)
    itemdf = itemdf.sort_values(by="sum", ascending=False)
    itemIDList = itemdf['id'].tolist()
    return itemIDList

@test_api.route('/')
class Test(Resource):
    def get(self):
        health = fclip._check_model()
        status = 200 if health else 404
        return Response(response="\n", status=status, mimetype="application/json")
    
    def post(self):
        return Response(response=output, status=status, mimetype="application/json")

@app.route("/ping", methods=["GET"])
def ping():
    health = fclip._check_model()  # You can insert a health check here
    status = 200 if health else 404
    return Response(response="\n", status=status, mimetype="application/json")

@app.route("/invocations", methods=["POST"])
def predict():
    data = None
    queryList = [] # query를 담을 list
    responseQueryList = []
    itemIDList = []
    if request.content_type == "application/json":
        """
        request body should be :
        {
            "user_id" : 1203,
            "gpt_usable" : 0 | 1, Number
            "text" : ["A-Line Dresses and Skirts"] // first index of list is user query for default
            "target_index" : [1, 0|1, 0|1, 0|1]
        }
        """
        data = request.data.decode("utf-8")
        inputs = json.loads(data)
        queryList.append(inputs['text'][0])
        responseQueryList.append(inputs['text'][0])
        gptUsable = inputs['gpt_usable']
        user_id = inputs['user_id']
        targetIndex = inputs['target_index']
        timestamp = int(datetime.now().timestamp())
    else :
        return Response(
            response="This predictor only supports for plain-text in English", status=415, mimetype="text/plain"
        )

    if gptUsable == 1 : # it might be 0 or 1
        if 1 in set(targetIndex[1:]):
            # gpt 를 한 번 썼고 그 중에 내가 필요한 쿼리만 선택했을 떄
            for index, query in enumerate(inputs['text']):
                if index!=0:
                    responseQueryList.append(query)
                if index != 0 and targetIndex[index] == 1:
                    queryList.append(inputs['text'][index].strip())
            itemIDList = inputQuery(queryList)
            outReason = 0
        else : 
            # gpt를 처음 쓸 때
            gptResponse = gpt.get_response(inputs['text'][0])
            gptResponse = gptResponse["choices"][0]["text"].strip()
            print(gptResponse)
            try : 
                gptResponses = gptResponse.split(",")
                gptInputs = gptResponses[1:]
            except :
                outReason = 1
    
            if gptResponses[0] == "1":
                print("gpt response is available")
                for cnt, query in enumerate(gptInputs):
                    if cnt < 3:
                        responseQueryList.append(query.strip())
                        queryList.append(query.strip())
                itemIDList = inputQuery(queryList)
                targetIndex = []
                for i in range(len(queryList)):
                    targetIndex.append(1)
                outReason = 0
            else :
                outReason = 2
    else :
        for index, query in enumerate(inputs['text']):
            if index != 0:
                responseQueryList.append(query)
            if index != 0 and targetIndex[index] == 1:
                queryList.append(inputs['text'][index].strip())
            itemIDList = inputQuery(queryList)
            outReason = 0
    usedQuery = responseQueryList
    output = {"response":outReason, "gpt_usable":gptUsable, "user_id" : user_id, "text":usedQuery, 'target_index':targetIndex, "item_ids":itemIDList, "timestamp" : timestamp}
    
    """
    Response body
    {
        "response" : number,
        "user_id" : number,
        "text" : String[],
        "target_index : Integer[],
        "item_ids" : Integer[], # item id
        "timestamp" : 160943 unix timestamp
    }
    """

    return Response(response=json.dumps(output), status=200, mimetype="application/json")


