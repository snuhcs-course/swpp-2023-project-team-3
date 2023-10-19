from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404

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

# @api_view(['GET', 'POST'])
# def snacksAPI(request):
#     if request.method == 'GET':
#         snacks = Snack.objects.all()
#         serializer = SnackSerializer(snacks, many=True) # 여러 모델 처리시 many=True로 지정
#         return Response(serializer.data, status=status.HTTP_200_OK) # GET 성공 응답
#     elif request.method == 'POST':
#         serializer = SnackSerializer(data=request.data)
#         if serializer.is_valid(): # 유효성 검사
#             serializer.save() # 역직렬화 후 저장
#             return Response(serializer.data, status=status.HTTP_201_CREATED) # POST 성공 응답
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # 잘못된 요청 응답

# @api_view(['GET'])
# def snackAPI(request, pk): # URL 변수 pk 추출
#     snack = get_object_or_404(Snack, pk=pk)
#     serializer = SnackSerializer(snack)
#     return Response(serializer.data, status=status.HTTP_200_OK)