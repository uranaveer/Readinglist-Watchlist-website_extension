from llama_cpp import Llama
import os

model_path = os.path.join(os.path.dirname(__file__), "gemma-2-2b-it-Q6_K.gguf")
llm = Llama(model_path, n_ctx=8192,verbose=False)