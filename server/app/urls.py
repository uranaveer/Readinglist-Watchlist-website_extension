from django.urls import path
from . import views

urlpatterns = [
    path('validate_otp/',views.validate_otp,name="validate otp"),
    path('register_email/',views.register_email,name="register email"),
    path('validate_username/',views.validate_username,name="validate username"),
    path('register_username/',views.register_username,name="register username"),
    path('register_password/',views.register_password,name="register password"),
    path('login/',views.login,name="login"),
    path('sign_up/',views.sign_up,name="sign up"),
    path('test/',views.test_api,name="test"),
    path('set_avatar/',views.set_avatar,name="set avatar"),
    path('add_post/',views.add_post,name="add Post"),
    path('get_data/',views.get_entries,name="Get Data"),
]
