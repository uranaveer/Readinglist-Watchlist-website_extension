from celery import shared_task
from .models import Post
from .utils import preprocess_description , is_youtube_video
from .llm import llm
import re



@shared_task
def generate_summary(post_id):
    try:
        post = Post.objects.get(id=post_id)
        if not post.processed:
            description = post.description
            title = post.title
            description = preprocess_description(description)
            prompt = f"""
                You are an intelligent assistant that evaluates web page content.

                Given a page title and its content, do the following:

                1. **Assess Content Quality**:
                - Rate as **High** if the page content clearly supports, explains, or elaborates on the title.
                - Rate as **Medium** if the page content is somewhat related or only partially supports the title.
                - Rate as **Low** if the content is vague, irrelevant, or does not support the title at all.

                2. **Generate a Concise Summary** of what the page content conveys.

                Use this response format:
                Quality: [High/Medium/Low]
                Summary: [One or two sentence summary of the page content]

                Input:
                Page Title: "{title}"
                Page Content: "{description}"

                Response:

                """


            output = llm(prompt, max_tokens=100, temperature=0.7, top_p=0.9, stop=["\n\n", "New Input:"])
            response = output["choices"][0]["text"].strip()
            # Extract using regex
            quality = re.search(r"Quality:\s*(.+)", response)
            summary = re.search(r"Summary:\s*(.+)", response)

            quality = quality.group(1).strip() if quality else None
            summary = summary.group(1).strip() if summary else None
            post.description = summary
            if quality and quality.lower() in ["medium", "high"]:
                post.approved=True
            post.processed=True
            post.save()
            print(f"Summary saved for Post {post_id}")
    except Post.DoesNotExist:
        print(f"Post {post_id} not found")
