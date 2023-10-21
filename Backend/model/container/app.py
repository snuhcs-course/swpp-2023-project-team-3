import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding
from datetime import datetime

app = Flask(__name__)
fclip = ClipTextEmbedding()


# django_api_url = "http://your-django-api-url.com"  # Replace with the actual URL

@app.route("/ping", methods=["GET"])
def ping():
    health = fclip.get_model() is not None  # You can insert a health check here

    status = 200 if health else 404
    return Response(response="\n", status=status, mimetype="application/json")

@app.route("/invocations", methods=["POST"])
def predict():
    data = None
    if request.content_type == "application/json":
        """
        request body should be :
        {
            "user_id" : 1203,
            "text" : "A-Line Dresses and Skirts"
        }
        """
        data = request.data.decode("utf-8")
        inputs = json.loads(data)
        inputText = inputs['text']
        user_id = inputs['user_id']
        timestamp = int(datetime.now().timestamp())

        print(timestamp)
        # text 전처리
        print(inputText)
    else :
        return Response(
            response="This predictor only supports for plain-text in English", status=415, mimetype="text/plain"
        )

    itemIDList = fclip.get_similarity(inputText)
    output = {"response":"Sucess", "user_id" : user_id, "item_ids":itemIDList, "timestamp" : timestamp}
    
    async def send_data_to_django():
        async with httpx.AsyncClient() as client:
            payload = {
                "user_id": user_id,
                "query": inputText,
                "is_deleted" : False,
                "timestamp" : timestamp
            }
            response = await client.post("django", json=payload)

            if response.status == 200:
                pass
            else:
                pass

            output = {
                "response": "Success",
                "user_id": user_id,
                "item_ids": itemIDList,
                "timestamp": timestamp,
            }
            return output

    send_data_to_django()

    """
    Response body
    {
        "response" : Sucess,
        "user_id" : 123
        "item_ids" : list[]
        "timestamp" : 160943 unix timestamp
    }
    """

    return Response(response=json.dumps(output), status=200, mimetype="application/json")


