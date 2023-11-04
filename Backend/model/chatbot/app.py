from typing import List
import os
import json
from flask import Flask, jsonify, request, Response
from inference import ClipTextEmbedding
from datetime import datetime
from gpt import GPT
import requests

app = Flask(__name__)

@app.route("/ping", methods=["GET"])
def ping():
    return Response(status=200, mimetype="application/json")
