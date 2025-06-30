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
from .serializer import PostSerializers , UserSerializer
from .utils import generate_alphanumeric_otp, send_otp_email
from django.db.models import Case, When,IntegerField, Value
from django.contrib.postgres.search import TrigramSimilarity
from django.db import transaction


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
    print(request.data)
    if not email or not username or not password:
        return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            existing_user = UserData.objects.filter(email=email).first()
            if existing_user:
                if existing_user.is_emailverified:
                    return Response({"message": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    existing_user.delete()

            if UserData.objects.filter(username=username).exists():
                return Response({"message": "Username already in use"}, status=status.HTTP_400_BAD_REQUEST)

            user = UserData(email=email, username=username)
            user.set_password(password)

            user.email_otp = generate_alphanumeric_otp()
            user.otp_cooldown =timezone.now() + timedelta(minutes=10)
            try:
                send_otp_email(user.email,user.email_otp)
            except Exception as e:
                return Response({"message": "something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            user.save()
            return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Sign-up error: {e}")
        return Response({"message": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    


@api_view(['POST','OPTIONS'])
def login(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    email = request.data.get("username")
    username = request.data.get("username")
    password = request.data.get("password")
    print(f"request data {request.data}")

    if not email and not username:
        return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        user = UserData.objects.get(email=email)
    except UserData.DoesNotExist:
        try:
            user = UserData.objects.get(username=username)
        except UserData.DoesNotExist:
            return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

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
def validate_otp(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    
    email = request.data.get('email')
    username = request.data.get('email')
    print(request.data)
    try:
        user = UserData.objects.get(email=email)
    except UserData.DoesNotExist:
        try:
            user = UserData.objects.get(username=username)
        except UserData.DoesNotExist:
            return Response({"message":"user not found"}, status=status.HTTP_400_BAD_REQUEST)
    cooldown_time = user.otp_cooldown
    otp = request.data.get('otp')
    
    if cooldown_time < timezone.now():
        user.email_otp = None
        user.save()
        return Response({"message":"otp expired"},status=status.HTTP_408_REQUEST_TIMEOUT)
    
    print(user.email_otp)
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
    print(request.data)
    user = request.user
    old_password = request.data.get('old_password')
    password = request.data.get('password')
    username = request.data.get('username')
    avatar_id = int(request.data.get('avatar_id'))
    bio = request.data.get('bio')

    authenticated_user = authenticate(email = user.email , password = old_password)

    if authenticated_user is not None:
        if username and username != user.username:
            if UserData.objects.filter(username=username).exclude(id=user.id).exists():
                return Response({"message": "username already in use"}, status=status.HTTP_400_BAD_REQUEST)
            user.username = username
        if avatar_id:
            user.avatar_id = avatar_id

        if password:
            user.set_password(password)

        if bio:
            user.bio =bio
    
        user.save()
        return Response({"message":"details changed successfully"},status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST','OPTIONS'])
# @permission_classes([IsAuthenticated])
def send_otp(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    email = request.data.get('username')
    username = request.data.get('username')
    print(request.data)

    try:
        user = UserData.objects.get(email=email)
    except UserData.DoesNotExist:
        try:
            user = UserData.objects.get(username=username)
        except UserData.DoesNotExist:
            return Response({"message":"user not found"}, status=status.HTTP_400_BAD_REQUEST)
    user.email_otp = generate_alphanumeric_otp()
    user.otp_cooldown =timezone.now() + timedelta(minutes=10)
    try:
        send_otp_email(user.email,user.email_otp)
    except Exception as e:
        return Response({"message": "something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
    if Post.objects.filter(link=link, user_id =user.id).exists():
        return Response({"message":"link already exits for the user"},status=status.HTTP_400_BAD_REQUEST)
    post = Post(title=title,link=link,description=description)
    post.user=user
    print(f"[DEBUG]Approved: {post.approved}")

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
    queryset = Post.objects.filter(approved = True).order_by('-created_at')
    entries = queryset[start_index:end_index]


    serializer = PostSerializers(entries,many=True)

    count = Post.objects.count()



    return Response({
        "total_posts":count,
        "data":serializer.data,
                     },
                    status=status.HTTP_200_OK)



@api_view(['GET','OPTIONS'])
@permission_classes([IsAuthenticated])
def user_data(request):
    user = request.user
    
    return Response({'username':user.username,
                     'avatar_id':user.avatar_id,
                     'bio':user.bio,
                     },status=status.HTTP_200_OK)



@api_view(['GET','OPTIONS'])
@permission_classes([IsAuthenticated])
def user_posts(request):
    user = request.user
    posts = Post.objects.filter(approved =True,user_id=user.id).order_by('-created_at')
    serializer = PostSerializers(posts,many=True)
    return Response({'data':serializer.data},status=status.HTTP_200_OK)



@api_view(['GET','OPTIONS'])
@permission_classes([IsAuthenticated])
def get_profile_data(request,username):
    if UserData.objects.filter(username=username).exists():
        user = UserData.objects.get(username=username)
        posts = Post.objects.filter(approved = True ,user_id=user.id).order_by('-created_at')
        serializer = PostSerializers(posts,many=True)

        return Response({
            'username':user.username,
            'bio':user.bio,
            'avatar_id':user.avatar_id,
            "data":serializer.data,
        },
        status=status.HTTP_200_OK
        )
    return Response(status=status.HTTP_404_NOT_FOUND)



@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def search_user(request):
    username = request.query_params.get('username')

    username = username.strip()
    trigram_users = UserData.objects.annotate(
        similarity=TrigramSimilarity('username', username),
        exact_match=Case(
            When(username__iexact=username, then=Value(1)),
            default=Value(0),
            output_field=IntegerField()
        )
    ).filter(similarity__gt=0.3).order_by('-exact_match', '-similarity')[:5]
    prefix_users = UserData.objects.filter(username__istartswith=username)[:5]

    combined_users = list({user.id: user for user in list(trigram_users) + list(prefix_users)}.values())


    serializer = UserSerializer(combined_users, many=True)
    return Response({'data': serializer.data}, status=status.HTTP_200_OK)













    