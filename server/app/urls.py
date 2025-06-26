from django.urls import path
from . import views

urlpatterns = [
    path('helloworld/', views.helloworld, name="hello world"),
    path('validate-otp/', views.validate_otp, name="validate otp"),
    path('change-user-data/', views.change_user_data, name="change data"),
    path('validate-username/', views.validate_username, name="validate username"),
    path('login/', views.login, name="login"),
    path('sign-up/', views.sign_up, name="sign up"),
    path('test-protected/', views.test_api, name="test"),
    path('add-post/', views.add_post, name="add post"),
    path('get-data/', views.get_entries, name="get data"),
    path('get-user-posts/', views.user_posts, name="get user posts"),
    path('user-data/',views.user_data, name='User data'),
    path('add-like/',views.user_data, name='add Like'),
    path('profile/<str:username>/',views.get_profile_data,name='Get profile data'),
]

