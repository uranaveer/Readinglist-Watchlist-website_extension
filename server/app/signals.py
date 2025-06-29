from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post
from .tasks import generate_summary

@receiver(post_save, sender=Post)
def post_created_handler(sender, instance, created, **kwargs):
    if created:
        generate_summary.delay(instance.id)
