from django.db import models
from django.contrib.auth.hashers import make_password , check_password as django_check_password
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager

# Create your models here.



class UserData(AbstractBaseUser,PermissionsMixin):
    username = models.CharField(max_length=250,blank=True,null=True)
    email = models.EmailField(unique=True)
    avatar_id = models.IntegerField(default=1)
    is_emailverified = models.BooleanField(default=False)
    email_otp = models.CharField(max_length=250,blank=True,null=True)
    otp_cooldown = models.DateTimeField(blank=True,null=True)
    bio = models.TextField(default="")
    password = models.CharField(max_length=250,blank=True,null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)


    objects = BaseUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self,raw_password):
        return django_check_password(raw_password,self.password)

class Post(models.Model):
    title = models.CharField(max_length=250)
    link =models.URLField(max_length=2000)
    description = models.TextField()
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="posts")
    created_at= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
