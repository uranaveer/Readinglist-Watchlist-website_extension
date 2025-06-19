from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserData, Post
from django.utils import timezone
from datetime import timedelta
import secrets
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.db import IntegrityError
import environ
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.

env = environ.Env()
environ.Env.read_env()

def generate_alphanumeric_otp(length=6):
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))


def send_otp_email(email,otp):
    sender_email =  env("SENDERS_MAIL")
    receiver_email = email
    password = env("APP_PASSWORD")
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your One-Time Password (OTP)"
    message["From"] = sender_email
    message["To"] = receiver_email

    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center;">🔐 Your OTP Code</h2>
            <p style="font-size: 16px; color: #555;">
                Dear user,<br><br>
                Use the following One-Time Password (OTP) to proceed with your action. This OTP is valid for the next 10 minutes.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #2d89ef; letter-spacing: 4px;">{otp}</span>
            </div>
            <p style="font-size: 14px; color: #888; text-align: center;">
                If you did not request this OTP, please ignore this message or contact support.
            </p>
            </div>
        </body>
    </html>
"""
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
            print("OTP email sent successfully!")
    except Exception as e:
        print(f"Error: {e}")


@api_view(['POST'])
def validate_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    
    try:
        user = UserData.objects.get(email=email)
    except UserData.DoesNotExist:
        return Response({"message":"inavlid email"},status=status.HTTP_400_BAD_REQUEST)

    cooldown_time = user.otp_cooldown
    
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

    

@api_view(['POST'])
def register_email(request):
    email=request.data.get('email')
    
    if UserData.objects.filter(email=email).exists():
        return Response({"message":"email already exists"},status = status.HTTP_400_BAD_REQUEST)
    try:
        user = UserData(email=email)
        user.email_otp = generate_alphanumeric_otp()
        user.otp_cooldown = timezone.now() + timedelta(minutes=10)
        user.save()
        send_otp_email(user.email,user.email_otp)
    except IntegrityError:
        return Response({"message": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message":"Something went wrong"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"message":"email stored"},status=status.HTTP_200_OK)


@api_view(['POST'])
def validate_username(request):
    username = request.data.get('username')

    if UserData.objects.filter(username=username).exists():
        return Response({"message":"username already in use"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"message":"username available"},status=status.HTTP_200_OK)


@api_view(['PUT'])
def register_username(request):
    username = request.data.get('username')
    email = request.data.get('email')
    if UserData.objects.filter(username=username).exists():
        return Response({"message":"username already in use"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = UserData.objects.get(email=email)
    except UserData.DoesNotExist:
        return Response({"message": "user not found"}, status=status.HTTP_404_NOT_FOUND)
    user.username = username
    user.save()

    return Response({"message":"username registered"},status=status.HTTP_200_OK)


@api_view(['PUT'])
def register_password(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = UserData.objects.get(email=email)
    except UserData.DoesNotExist:
        return Response({"message": "user not found"}, status=status.HTTP_404_NOT_FOUND)
    user.set_password(password)
    user.save()
    return Response({"message":"Password registered"},status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request):
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")

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

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'is_emailverified': user.is_emailverified
        }, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POST'])
def initiate_email_verification(request):
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








    