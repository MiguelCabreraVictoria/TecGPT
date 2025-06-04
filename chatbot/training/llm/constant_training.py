import os
import torch
import tiktoken
from torch import nn
from utils.config_loader import LLM_CONFIG
from models.llm.model.gpt_model import GPTModel

checkpoint_path = os.path.join(os.getcwd(), "checkpoints", "model_and_optimizer.pt")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
checkpoint = torch.load(checkpoint_path, map_location=device)

model = GPTModel(LLM_CONFIG['model'])
model.load_state_dict(checkpoint['model_state_dict'])
model.to(device)
model.eval()

tokenizer = tiktoken.get_encoding(LLM_CONFIG['dataset']["encoder"])
prompt = "The best option is  "
input_ids = tokenizer.encode(prompt)
input_tensor = torch.tensor([input_ids], device=device)

optimizer = torch.optim.AdamW(model.parameters(), lr=LLM_CONFIG['training']['learning_rate'], weight_decay=LLM_CONFIG['training']['weight_decay'])
optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
model.train()

