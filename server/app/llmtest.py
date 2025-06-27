from llm import summarizer
import os

base_path = os.path.dirname(__file__)
file_path = os.path.join(base_path, "description.txt")

with open(file_path, 'r', encoding='utf-8') as f:
    description = f.read().strip()

text = f"""
summarize: Provide a bullet-point summary of the following:

{description}
"""

result = summarizer(text.strip(), do_sample=False)
summary_text = result[0]['summary_text'].strip()

for sentence in summary_text.split('. '):
    clean = sentence.strip().lstrip('-').strip()
    if clean:
        print(f"- {clean.rstrip('.')}.")
