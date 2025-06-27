# Initialize summarization pipeline (T5-small on CPU)

from transformers import pipeline

summarizer = pipeline("summarization", model="t5-small", tokenizer="t5-small", device=-1)
