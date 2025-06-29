import time
start_time = time.time()
import os
import re
from llama_cpp import Llama
from utils import preprocess_description


model_path = os.path.join(os.path.dirname(__file__), "gemma-2-2b-it-Q6_K.gguf")
llm = Llama(model_path, n_ctx=8192,verbose=False)





# Inputs
title = "Why we need Quantum Computers?"
description = """
"""

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





# Run the model
output = llm(prompt, max_tokens=100, temperature=0.7, top_p=0.9, stop=["\n\n", "New Input:"])

# Extract response text
response = output["choices"][0]["text"].strip()

print(output["choices"][0]["text"].strip())

end_time = time.time()
print(f"\n⏱ Runtime: {end_time - start_time:.2f} seconds")