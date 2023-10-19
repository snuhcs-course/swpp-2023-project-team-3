from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404

from .models import *
from .serializers import *


@api_view(['GET'])
def getUserAPI(request, pk):
    if request.method == 'GET':
        user = get_object_or_404(User, pk=pk)
        userSerializer = UserSerializer(user)
        return Response(userSerializer.data, status=status.HTTP_200_OK)
