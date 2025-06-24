from django.urls import path
from . import views

urlpatterns = [
    path('helloworld/',views.helloworld,name="Hello World"),
    path('validate_otp/',views.validate_otp,name="validate otp"),
    path('change_user_data/',views.change_user_data,name="change data"),
    path('validate_username/',views.validate_username,name="validate username"),
    path('login/',views.login,name="login"),
    path('sign_up/',views.sign_up,name="sign up"),
    path('test_protected/',views.test_api,name="test"),
    path('add_post/',views.add_post,name="add Post"),
    path('get_data/',views.get_entries,name="Get Data"),
]
