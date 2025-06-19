from django.db import models
from django.contrib.auth.hashers import make_password , check_password as django_check_passowrd

# Create your models here.

class UserData(models.Model):
    username = models.CharField(max_length=250)
    email = models.EmailField()
    first_name = models.CharField(max_length=250)
    last_name = models.CharField(max_length=250)
    email_isVerified = models.BooleanField(default=False)
    email_otp = models.CharField(max_length=250, null=True , blank=True)
    password = models.CharField(max_length=250)

    def __str__(self):
        return self.username
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self,raw_password):
        return django_check_passowrd(raw_password,self.password)
    

class Post(models.Model):
    title = models.CharField(max_length=250)
    link =models.URLField(max_length=2000)
    description = models.TextField()
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="posts")

    def __str__(self):
        return self.title