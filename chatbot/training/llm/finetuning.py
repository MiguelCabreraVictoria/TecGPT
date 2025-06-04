import numpy as np
import torch
import tiktoken
from  training.llm.train_loop import generate,text_to_token_ids,token_ids_to_text
from utils.config_loader import LLM_CONFIG
from models.llm.model.gpt_model import GPTModel
from scripts.loadGPT2 import settings, params


tokenizer = tiktoken.get_encoding(LLM_CONFIG['dataset']["encoder"])

gpt = GPTModel(LLM_CONFIG['openai'])
# print(gpt)
print(params.keys())
print("Token embedding weight tensor dimensions:", params["wte"].shape)
gpt.eval()


def assign(left, right):
    if left.shape != right.shape:
        raise ValueError(f"Shape mismatch. Left: {left.shape}, Right: {right.shape}")
    return torch.nn.Parameter(torch.tensor(right))

print("Embedding shape:", params["wte"].shape)  # Ej: (50257, 768)
print("Tokenizer vocab size:", tokenizer.n_vocab)  # Ej: 50257

def load_weights_into_gpt(gpt, params):
    gpt.post_emb.weight = assign(gpt.post_emb.weight, params['wpe'])
    gpt.tok_emb.weight = assign(gpt.tok_emb.weight, params['wte'])
    
    for b in range(len(params["blocks"])):
        q_w, k_w, v_w = np.split(
            (params["blocks"][b]["attn"]["c_attn"])["w"], 3, axis=-1)
        gpt.transform_blocks[b].attn.W_query.weight = assign(gpt.transform_blocks[b].attn.W_query.weight, q_w.T)
        gpt.transform_blocks[b].attn.W_key.weight = assign(gpt.transform_blocks[b].attn.W_key.weight, k_w.T)
        gpt.transform_blocks[b].attn.W_value.weight = assign(gpt.transform_blocks[b].attn.W_value.weight, v_w.T)

        q_b, k_b, v_b = np.split(
            (params["blocks"][b]["attn"]["c_attn"])["b"], 3, axis=-1)
        gpt.transform_blocks[b].attn.W_query.bias = assign(gpt.transform_blocks[b].attn.W_query.bias, q_b)
        gpt.transform_blocks[b].attn.W_key.bias = assign(gpt.transform_blocks[b].attn.W_key.bias, k_b)
        gpt.transform_blocks[b].attn.W_value.bias = assign(gpt.transform_blocks[b].attn.W_value.bias, v_b)

        gpt.transform_blocks[b].attn.out_proj.weight = assign(gpt.transform_blocks[b].attn.out_proj.weight, params["blocks"][b]["attn"]["c_proj"]["w"].T)
        gpt.transform_blocks[b].attn.out_proj.bias = assign(gpt.transform_blocks[b].attn.out_proj.bias, params["blocks"][b]["attn"]["c_proj"]["b"])

        gpt.transform_blocks[b].ff.layers[0].weight = assign(gpt.transform_blocks[b].ff.layers[0].weight, params["blocks"][b]["mlp"]["c_fc"]["w"].T)
        gpt.transform_blocks[b].ff.layers[0].bias = assign(gpt.transform_blocks[b].ff.layers[0].bias, params["blocks"][b]["mlp"]["c_fc"]["b"])
        gpt.transform_blocks[b].ff.layers[2].weight = assign(gpt.transform_blocks[b].ff.layers[2].weight, params["blocks"][b]["mlp"]["c_proj"]["w"].T)
        gpt.transform_blocks[b].ff.layers[2].bias = assign(gpt.transform_blocks[b].ff.layers[2].bias, params["blocks"][b]["mlp"]["c_proj"]["b"])

        gpt.transform_blocks[b].norm1.scale = assign(gpt.transform_blocks[b].norm1.scale, params["blocks"][b]["ln_1"]["g"])
        gpt.transform_blocks[b].norm1.shift = assign(gpt.transform_blocks[b].norm1.shift, params["blocks"][b]["ln_1"]["b"])
        gpt.transform_blocks[b].norm2.scale = assign(gpt.transform_blocks[b].norm2.scale, params["blocks"][b]["ln_2"]["g"])
        gpt.transform_blocks[b].norm2.shift = assign(gpt.transform_blocks[b].norm2.shift, params["blocks"][b]["ln_2"]["b"])

    gpt.final_norm.scale = assign(gpt.final_norm.scale, params["g"])
    gpt.final_norm.shift = assign(gpt.final_norm.shift, params["b"])
    gpt.out_head.weight = assign(gpt.out_head.weight, params["wte"])
    
device = torch.device("cuda" if torch.cuda.is_available() else "cpu") 
load_weights_into_gpt(gpt, params)
gpt.to(device)

prompt = "What are you ?"
input_ids = torch.tensor([tokenizer.encode(prompt)], dtype=torch.long)
tokenizer = tiktoken.get_encoding(LLM_CONFIG['dataset']["encoder"])


gpt.eval()
with torch.no_grad():
    output_ids = generate(
    model=gpt,
    idx=input_ids,
    max_new_tokens=20,
    context_size=LLM_CONFIG["openai"]["context_length"],
    top_k=50,
    temperature=0.7)

print(tokenizer.decode(output_ids[0].tolist()))


