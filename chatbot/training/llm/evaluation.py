import os
import torch
import torch.nn.functional as F
import tiktoken
from utils.config_loader import LLM_CONFIG
from models.llm.model.gpt_model import GPTModel

# Inicialización global (se hace 1 sola vez)
checkpoint_path = os.path.join(os.getcwd(), "checkpoints", "pretrained", "GPT_checkpoints.pth")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
checkpoint = torch.load(checkpoint_path, map_location=device)

model = GPTModel(LLM_CONFIG['model'])
model.load_state_dict(checkpoint['model_state_dict'])
model.to(device)
model.eval()

tokenizer = tiktoken.get_encoding(LLM_CONFIG['dataset']["encoder"])

def generate_from_prompt(prompt: str) -> str:
    input_ids = tokenizer.encode(prompt)
    input_tensor = torch.tensor([input_ids], device=device)

    max_new_tokens = 50
    temperature = 0.8
    generated = input_tensor

    with torch.no_grad():
        for _ in range(max_new_tokens):
            context = generated[:, -LLM_CONFIG["model"]["context_length"]:]
            logits = model(context)

            next_token_logits = logits[:, -1, :] / temperature
            probs = F.softmax(next_token_logits, dim=-1)
            next_token = torch.multinomial(probs, num_samples=1)

            if next_token.item() == tokenizer.encode("\n")[0]:
                break

            generated = torch.cat((generated, next_token), dim=1)

    generated_ids = generated[0].tolist()
    new_tokens = generated_ids[len(input_ids):]
    output_text = tokenizer.decode(new_tokens)

    return output_text.strip()
