from django.urls import path
from . import views

urlpatterns = [
    path('validate_otp/',views.validate_otp,name="validate otp"),
    path('change_email/',views.change_email,name="change email"),
    path('validate_username/',views.validate_username,name="validate username"),
    path('change_username/',views.change_username,name="change username"),
    path('change_password/',views.change_password,name="change password"),
    path('login/',views.login,name="login"),
    path('sign_up/',views.sign_up,name="sign up"),
    path('test/',views.test_api,name="test"),
    path('set_avatar/',views.set_avatar,name="set avatar"),
    path('add_post/',views.add_post,name="add Post"),
    path('get_data/',views.get_entries,name="Get Data"),
]
