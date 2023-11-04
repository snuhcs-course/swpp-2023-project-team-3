from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from django.db import transaction

import json

from .models import *
from .serializers import *


@api_view(['GET'])
def queryHistoryAPI(request, user):
    if request.method == 'GET':
        searchLog = SearchLog.objects.filter(user=user)
        chatLog = ChatLog.objects.filter(user=user)

        searchLogSerializer = SearchLogSerializer(searchLog, many=True)
        chatLogSerializer = ChatRoomSerializer(chatLog, many=True)
        return Response(searchLogSerializer.data + chatLogSerializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def chatHistoryAPI(request, pk):
    if request.method == 'GET':
        chatLog = ChatLog.objects.get(pk=pk)
        chatLogSerializer = ChatLogSerializer(chatLog)
        return Response(chatLogSerializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@transaction.atomic()
def saveChat(request):
    try:
        if request.method == 'POST':
            # decode body
            data = json.loads(request.body.decode('utf-8'))

            # save chatroom -> user chat -> gpt chat
            # saving chatroom info
            chatRoomSerializer = None
            chatroomId = data["chatroom"] if "chatroom" in data else 0
            if "user" in data: # if there is user key in data
                chatRoomSerializer = ChatRoomSerializer(data = {"user": data["user"], "summary": data["summary"]})
                if chatRoomSerializer.is_valid(raise_exception=True):
                    chatRoomSerializer.save()
                    chatroomId = chatRoomSerializer.data["id"]
                else:
                    return Response(chatRoomSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # saving user chat info
            userChatSerializer = UserChatSerializer(data = {"log": chatroomId, "query": data["query"]})
            if userChatSerializer.is_valid(raise_exception=True):
                userChatSerializer.save()
            else:
                return Response(userChatSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
            userChatId = userChatSerializer.data["id"]

            for item, similarity in data["items"]:
                chatItemsSerializer = ChatItemsSerializer(data={"chat": userChatId, "item": item, "similarity": similarity})
                if chatItemsSerializer.is_valid(raise_exception=True):
                    chatItemsSerializer.save()
                else:
                    return Response(chatItemsSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # saving gpt chat
            gptChatSerializer = GptChatSerializer(data = {
                "user_chat": userChatId,
                "answer": data["answer"], 
                "gpt_query1": data["gpt_query1"],
                "gpt_query2": data["gpt_query2"],
                "gpt_query3": data["gpt_query3"]
            })

            if gptChatSerializer.is_valid(raise_exception=True):
                gptChatSerializer.save()
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(gptChatSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@transaction.atomic()
def saveSearch(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        searchLogSerializer = SearchLogSerializer(data = data)
        if searchLogSerializer.is_valid():
            searchLogSerializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(searchLogSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@transaction.atomic()
def saveSearchItem(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))

        searchItemsSerializer = SearchItemsSerializer(data=data)
        if searchItemsSerializer.is_valid():
            searchItemsSerializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(searchItemsSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
