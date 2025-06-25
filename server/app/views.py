from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import UserData, Post
from django.utils import timezone
from datetime import timedelta
from django.db import IntegrityError
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import PostSerializers
from .utils import generate_alphanumeric_otp, send_otp_email


# Create your views here.

@api_view(['GET'])
def helloworld(request):
    return Response({"message":'Hello World Amigo'},status=status.HTTP_200_OK)


@api_view(['GET','OPTIONS'])
def validate_username(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    username = request.data.get('username')

    if UserData.objects.filter(username=username).exists():
        return Response({"message":"username already in use"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"message":"username available"},status=status.HTTP_200_OK)


@api_view(['POST','OPTIONS'])
def sign_up(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    email = request.data.get("email")
    username = request.data.get('username')
    password = request.data.get('password')

    print(f"sign_up {request.data}")
    if UserData.objects.filter(email=email).exists():
        return Response({"message":"email already in use"},status=status.HTTP_400_BAD_REQUEST)
    if UserData.objects.filter(username=username).exists():
        return Response({"message":"username already in use"},status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = UserData(email=email,username=username)
        
    except IntegrityError:
        return Response({"message": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message":"Something went wrong"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    user.set_password(password)
    user.save()
    return Response({"message":"User Created"},status=status.HTTP_201_CREATED)
    
    


@api_view(['POST','OPTIONS'])
def login(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")
    print(f"request data {request.data}")

    if not email and not username:
        return Response({"message": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if email:
            user = UserData.objects.get(email=email)
        else:
            user = UserData.objects.get(username=username)
    except UserData.DoesNotExist:
        return Response({"message": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)

    authenticated_user = authenticate(email=user.email, password=password)

    if authenticated_user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'is_emailverified': user.is_emailverified
        }, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    


@api_view(['POST','OPTIONS'])
@permission_classes([IsAuthenticated])
def validate_otp(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    
    user=request.user
    cooldown_time = user.otp_cooldown
    otp = request.data.get('otp')
    
    if cooldown_time < timezone.now():
        user.email_otp = None
        user.save()
        return Response({"message":"otp expired"},status=status.HTTP_408_REQUEST_TIMEOUT)
    
    if otp == user.email_otp:
        user.is_emailverified = True
        user.email_otp=None
        user.save()
        return Response({"message":"otp validation successful"},status=status.HTTP_200_OK)
    else:
        user.save()
        return Response({"message":"otp validation Un-successful"},status=status.HTTP_401_UNAUTHORIZED)

    

@api_view(['POST','OPTIONS'])
@permission_classes([IsAuthenticated])
def change_user_data(request):
    user = request.user
    email = request.data.get('email')
    password = request.data.get('password')
    username = request.data.get('username')
    avatar_id = request.data.get('avatar_id')

    if email and email != user.email:
        if UserData.objects.filter(email=email).exclude(id=user.id).exists():
            return Response({"message": "email already in use"}, status=status.HTTP_400_BAD_REQUEST)
        user.email = email
        user.is_emailverified = False

    if username and username != user.username:
        if UserData.objects.filter(username=username).exclude(id=user.id).exists():
            return Response({"message": "username already in use"}, status=status.HTTP_400_BAD_REQUEST)
        user.username = username
    
    if  password:
        user.set_password(password)
    if avatar_id:
        user.avatar_id = avatar_id
    
    user.save()
    return Response({"message":"details changed successfully"},status=status.HTTP_201_CREATED)


@api_view(['POST','OPTIONS'])
@permission_classes([IsAuthenticated])
def initiate_email_verification(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    email = request.data.get('email')

    try:
        user = UserData.objects.get(email=email)
    except UserData.DoesNotExist:
        return Response({"message":"No user found"},status=status.HTTP_400_BAD_REQUEST)
    
    user.email_otp = generate_alphanumeric_otp()
    user.otp_cooldown =timezone.now() + timedelta(minutes=10)
    send_otp_email(user.email,user.email_otp)
    user.save()
    return Response({"message":"otp sent successfully"}, status=status.HTTP_200_OK)


@api_view(['GET','OPTIONS'])
@permission_classes([IsAuthenticated])
def test_api(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "message": f"Hi {user.username}, you're authenticated!"
    }, status=status.HTTP_200_OK)


@api_view(['POST','OPTIONS'])
@permission_classes([IsAuthenticated])
def add_post(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    print(f"Title : {request.data.get('title')}")
    print(f"Link : {request.data.get('link')}")
    user = request.user
    title = request.data.get('title')
    link = request.data.get('link')
    description = request.data.get('description')

    post = Post(title=title,link=link,description=description)
    post.user=user

    post.save()

    return Response({'message':"Post Created"},status=status.HTTP_201_CREATED)



@api_view(['GET','OPTIONS'])
@permission_classes([IsAuthenticated])
def get_entries(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    try:
        page_number = int(request.query_params.get('page_number', 1))
        if page_number < 1:
            page_number = 1
    except ValueError:
        page_number = 1
    page_size = 10
    start_index = (page_number-1)*page_size
    end_index = start_index+page_size

    prev_start = max((page_number-2)*page_size,0)
    prev_end = prev_start+page_size

    next_start = (page_number)*page_size
    next_end = next_start+page_size

    queryset = Post.objects.order_by('-created_at')

    entries = queryset[start_index:end_index]
    prev_entries = queryset[prev_start:prev_end]
    next_entries = queryset[next_start:next_end]


    serializer = PostSerializers(entries,many=True)
    prev_serializer = PostSerializers(prev_entries,many=True)
    next_serializer = PostSerializers(next_entries,many=True)

    if page_number ==1:
        return Response({
        "prev data":[],
        "data":serializer.data,
        "next data":next_serializer.data
                     },
                    status=status.HTTP_200_OK)

    return Response({
        "prev data":prev_serializer.data,
        "data":serializer.data,
        "next data":next_serializer.data
                     },
                    status=status.HTTP_200_OK)



@api_view(['GET','OPTIONS'])
@permission_classes([IsAuthenticated])
def user_data(request):
    user = request.user
    
    return Response({'username':user.username,
                     'avatar_id':user.avatar_id,
                     },status=status.HTTP_200_OK)

@api_view(['GET','OPTIONS'])
@permission_classes([IsAuthenticated])
def user_posts(request):
    user = request.user
    posts = Post.objects.filter(user_id=user.id).order_by('-created_at')
    serializer = PostSerializers(posts,many=True)
    return Response({'data':serializer.data},status=status.HTTP_200_OK)










    