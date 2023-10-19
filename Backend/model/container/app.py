import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding

app = Flask(__name__)

@app.route("/ping", methods=["GET"])
def ping():
    health = ClipTextEmbedding.get_model() is not None  # You can insert a health check here

    status = 200 if health else 404
    return Response(response="\n", status=status, mimetype="application/json")

@app.route("/invocations", methods=["POST"])
def predict():
    data = None
    if request.content_type == "application/json":
        data = request.data.decode("utf-8")
        inputs = json.loads(data)
        inputText = inputs['text']
        print(inputText)
    else :
        return Response(
            response="This predictor only supports for plain-text in English", status=415, mimetype="text/plain"
        )

    text_embeddings = ClipTextEmbedding.predict(inputText)
    output = {"response":"Sucess", "textEmbedding":text_embeddings}

    return Response(response=json.dumps(output), status=200, mimetype="application/json")


