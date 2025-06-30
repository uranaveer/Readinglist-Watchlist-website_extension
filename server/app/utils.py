import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import environ
import secrets
import string
import re
from urllib.parse import urlparse, parse_qs


env = environ.Env()
environ.Env.read_env()

def clean_text(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text) 
    text = re.sub(r'\s([?.!"](?:\s|$))', r'\1', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def truncate_to_words(text, max_words=500):
    words = text.split()
    return ' '.join(words[:max_words])

def preprocess_description(desc):
    text = clean_text(desc)
    text = truncate_to_words(text)
    return text



import re

def is_youtube_video(url):
    if not url:
        return False
    youtube_regex = r"(https?://)?(www\.)?(youtube\.com|youtu\.be)/"
    return re.search(youtube_regex, url) is not None



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