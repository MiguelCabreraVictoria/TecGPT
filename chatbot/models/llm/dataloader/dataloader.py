import torch
import tiktoken

from torch.utils.data import DataLoader
from models.llm.dataloader.dataset import LLMDataset
from utils.config_loader import LLM_CONFIG


with open('/home/miguel/Documents/TecGPT/chatbot/data/dataset.txt', 'r', encoding='utf-8') as file:
    raw_text = file.read()


tokenizer = tiktoken.get_encoding(LLM_CONFIG["dataset"]["encoder"])

dataset = LLMDataset(raw_text,tokenizer,LLM_CONFIG["dataset"])

dataloader = DataLoader(dataset,
                        batch_size=LLM_CONFIG["dataloader"]["batch_size"],
                        shuffle=LLM_CONFIG["dataloader"]["shuffle"],
                        drop_last=LLM_CONFIG["dataloader"]["drop_last"],
                        num_workers=LLM_CONFIG["dataloader"]["num_workers"],
                       )

def create_dataloader(raw_text,cfg):
    tokenizer = tiktoken.get_encoding(LLM_CONFIG['dataset']["encoder"])
    dataset = LLMDataset(raw_text, tokenizer, LLM_CONFIG["dataset"])
    dataloader = DataLoader(
        dataset,
        batch_size=cfg["batch_size"],
        shuffle=cfg["shuffle"],
        drop_last=cfg["drop_last"],
        num_workers=cfg["num_workers"],
    )
    
    return dataloader









