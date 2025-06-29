# ✱ Server - Backend Setup Guide
This folder contains the Django backend for the project. It manages APIs, database models, authentication, admin functionality, and other server-side logic.
## ✱ Features

### Authentication & User Management

- **JWT-based Authentication**: Secure login and signup using JSON Web Tokens.
- **Email Verification**: Verify new user emails via otp.
- **User Search API**: Search for users to explore their content/public profiles.

### Content Summarization & Post Handling

- **Automatic Post Judging & Summarization**:
  - When a user adds a post (video/article), it is **asynchronously processed**.
  - Uses **Gemma-2-2B-it-Q6_K**, a quantized local LLM model, to:
    - Judge content quality
    - Generate meaningful summaries
- **Celery + Redis Integration**:
  - Background task queue to **avoid blocking request/response cycles**.
  
### Public Content Feed

- **User Posts API**: Fetch all internet logs added by a specific user.

### Backend Architecture (Django + DRF)

- **Function-Based Views (FBVs)** using Django REST Framework for simplicity and clarity.
- Clean separation of concerns between authentication, post handling, and background processing.

### LLM & Resource Optimization

- **Local LLM Inference**: Designed to run entirely  on CPU using Llama.cpp.
- **Lightweight Model Support**: Optimized for CPUs without GPUs usign Gemma-2-2b-it-Q6_k.

### Asynchronous Processing

- **Celery Tasks for Summarization**:
  - Non-blocking design pattern
  - Tasks queue automatically upon new post creation
  - Uses Redis as the broker
    
### Internet Accessibility

- **Cloudflared Tunnel Integration**:
  - Exposes the local Django development server to the internet securely.
  - Useful for real-time testing, webhook integration, or sharing your app without deploying.


## ✱ Requirements
* Python (v3.10 or higher recommended)
* pip (comes with Python)
* Virtualenv (python virtual env)
* PostgreSQL
* Redis
 
## ✱ SETUP

### Step-1 : Cloning the repo
```bash
git clone https://github.com/uranaveer/Readinglist-Watchlist-website_extension
cd Readinglist-Watchlist-website_extension/server
```
### Step-2 : Creating Venv and downloading required libraries
```bash
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### Step-3 : Creating env variables

* setting up settings.py env variables
```
cd Readinglist-Watchlist-website_extension/server/server
```
* create a .env file for local postgres details

`SECRET_KEY=YOUR_DJANGO_SECRET_KEY`

`DEBUG=True`

`DB_NAME=YOUR_DB_NAME`

`DB_USER=postgres`

`DB_PASSWORD=DB_password`

`DB_HOST=localhost`

`DB_PORT=5432`
* to generate django secret key
```
cd Readinglist-Watchlist-website_extension/server
python manage.py shell
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

* setting up App env variables
* this are required for otp sending
  
`SENDERS_MAIL=example@gmail.com`

`APP_PASSWORD=gmail_app_passwords`

### Step-4 : Downloading the models
* Download Prebuilt .whl for llama-cpp-python From ->[Link](https://github.com/abetlen/llama-cpp-python/releases/download/v0.3.2/llama_cpp_python-0.3.2-cp310-cp310-win_amd64.whl)
* Place .whl server/app folder
```bash
#run
cd app
pip install llama_cpp_python-0.3.2-cp310-cp310-win_amd64.whl
```
* Download quantised Gemma-2-2b-it from -> [Link](https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/blob/main/gemma-2-2b-it-Q6_K.gguf)
* Place it in server/app folder

### Step-5 : Applying Migrations
```bash
#Applying models(tables) into Database
cd Readinglist-Watchlist-website_extension/server
python manage.py makemigrations
python manage.py migrate
```
### Step-6 : Start Redis server
```bash
#Start the redis server (if you are using windows, you need to start it from wsl)
redis-server
```
### Step-7 :  Start Celery Worker (for Summarization Tasks)
```bash
celery -A server worker --loglevel=info --pool=solo
```
### Step-8 : Run the Development Server
```bash
uvicorn server.asgi:application --host 127.0.0.1 --port 8000 --reload
```
* or
```bash
python manage.py runserver
```
* now server is running on localhost:8000

## ✱ API ENDPOINTS

| Method | Endpoint                 | Description             |
|--------|--------------------------|-------------------------|
| GET    | /helloworld/             | Test "Hello World" API |
| POST   | /send-otp/               | Send OTP to user email |
| POST   | /verify-otp/             | Verify received OTP    |
| POST   | /change-user-data/       | Change user data       |
| GET    | /validate-username/      | Check if username exists |
| POST   | /login/                  | User login (JWT)       |
| POST   | /sign-up/                | User signup            |
| GET    | /test/                   | General test endpoint  |
| POST   | /add-post/               | Add a post (auto summary) |
| GET    | /get-data/               | Get all entries/posts  |
| GET    | /get-user-posts/         | Get posts by the logged-in user |
| GET    | /user-data/              | Get current user data  |
| POST   | /add-like/               | Add like to a post     |
| GET    | /profile/<username>/     | Get public profile data |
| GET    | /search/                 | Search for users       |

