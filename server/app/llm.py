from transformers import AutoTokenizer, AutoModelForCausalLM
from torch import compile

# Load tokenizer and model (will download if not cached)
tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2")
model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2")
model = compile(model)