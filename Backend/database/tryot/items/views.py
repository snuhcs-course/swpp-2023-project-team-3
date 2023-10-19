from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404

from .models import *
from .serializers import *


@api_view(['GET'])
def itemsAPI(request, pk):
    if request.method == 'GET':
        item = get_object_or_404(Item, pk=pk)
        serializer = ItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)
