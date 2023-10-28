from typing import List
import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding
from datetime import datetime
from gpt import GPT

app = Flask(__name__)
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

# django_api_url = "http://your-django-api-url.com"  # Replace with the actual URL

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
            "text" : ["A-Line Dresses and Skirts", "NA", "NA", "NA"] // first index of list is user query for default
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
            outReason = "Sucess!"
        else : 
            # gpt를 처음 쓸 때
            gptResponse = gpt.get_response(inputs['text'][0])
            gptResponse = gptResponse["choices"][0]["text"].strip()
            print(gptResponse)
            try : 
                gptResponses = gptResponse.split(",")
                print(gptResponses)
                gptInputs = gptResponses[1:]
            except :
                outReason = 1
    
            if gptResponses[0] == "1":
                print("gpt response is available")
                for cnt, query in enumerate(gptInputs):
                    if cnt < 3:
                        responseQueryList.append(query.strip())
                        queryList.append(query.strip())
                print(len(queryList))
                itemIDList = inputQuery(queryList)
                outReason = "Sucess!"
            else :
                outReason = 2
    else :
        for index, query in enumerate(inputs['text']):
            if index != 0:
                responseQueryList.append(query)
            if index != 0 and targetIndex[index] == 1:
                queryList.append(inputs['text'][index].strip())
            itemIDList = inputQuery(queryList)
            outReason = "Sucess!"
    usedQuery = responseQueryList
    output = {"response":outReason, "user_id" : user_id, "text":usedQuery, 'target_index':targetIndex, "item_ids":itemIDList, "timestamp" : timestamp}
    
    # async def send_data_to_django():
    #     async with httpx.AsyncClient() as client:
    #         payload = {
    #             "user_id": user_id,
    #             "query": inputText,
    #             "is_deleted" : False,
    #             "timestamp" : timestamp
    #         }
    #         response = await client.post("django", json=payload)

    #         if response.status == 200:
    #             pass
    #         else:
    #             pass

    #         output = {
    #             "response": "Success",
    #             "user_id": user_id,
    #             "item_ids": itemIDList,
    #             "timestamp": timestamp,
    #         }
    #         return output

    # send_data_to_django()

    """
    Response body
    {
        "response" : string,
        "user_id" : number,
        "text" : String[],
        "target_index : Integer[],
        "item_ids" : Integer[], # item id
        "timestamp" : 160943 unix timestamp
    }
    """

    return Response(response=json.dumps(output), status=200, mimetype="application/json")


