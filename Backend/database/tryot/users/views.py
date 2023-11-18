from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist

from .models import *
from .serializers import *

@api_view(['GET'])
def getUserAPI(request, pk):
    if request.method == 'GET':
        user = get_object_or_404(User, pk=pk)
        userSerializer = UserSerializer(user)
        return Response(userSerializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        user = None
        if '@' in username:
            try:
                user = User.objects.get(email=username)
            except ObjectDoesNotExist:
                pass

        if not user:
            user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            userSerializer = UserSerializer(user)
            return Response({**userSerializer.data,'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def user_login_continue(request, token):
    if request.method == 'GET':
        token = Token.objects.get(pk=token)
        user = User.objects.get(id=token.user.id)
        userSerializer = UserSerializer(user)
        return Response(userSerializer.data, status=status.HTTP_200_OK)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    # print(request)
    if request.method == 'POST':
        try:
            # set Headers key : Authorization value : Token YOUR_TOKEN_VALUE
            # Delete the user's token to logout
            request.user.auth_token.delete()
            
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method =='PUT':
        
        uid = request.data.get("user_id")
        oldPassword = request.data.get("old_password")
        newPassword = request.data.get("new_password")
        
        try:
            user = User.objects.get(id=uid)
        except ObjectDoesNotExist as e:
            return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ChangePasswordSerializer(data={'old_password': oldPassword, 'password': newPassword}, context={'request': request})
        
        if serializer.is_valid():
            try:
                serializer.validate_old_password(oldPassword)
            except Exception as e:
                return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)

            serializer.update(user, serializer.validated_data)
            token, _ = Token.objects.get_or_create(user=user)
            userSerializer = UserSerializer(user)
            return Response({**userSerializer.data, 'token': token.key}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    if request.method =="POST":
        uid = request.data.get("user_id")
        try:
            user = User.objects.get(id=uid)
        except Exception as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        if user:
            user.delete()
            return Response(status=status.HTTP_200_OK)
    return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# @api_view(['GET'])
# def reset_password(request):
#     if request.method == "POST":
#         return Response()
#     return Response()