import torch 
from torch import nn

from models.llm.attention.MultiHeadAttention import MultiHeadAttention
from models.llm.model.feedForward import FeedForward


class GPTModel(nn.Module):
    def __init__(self, cfg):
        super().__init__()
        self.tok_emb = nn.Embedding(cfg["vocab_size"], cfg["embedding_dim"])
        self.post_emb = nn.Embedding(cfg["context_length"], cfg["embedding_dim"])
        self.drop_emb = nn.Dropout(cfg["droprate"])
        self.transform_blocks = nn.Sequential(*[TransformerBlock(cfg) for _ in range(cfg["layers"])])
        self.final_norm = LayerNorm(cfg["embedding_dim"])
        self.out_head = nn.Linear(cfg["embedding_dim"], cfg["vocab_size"], bias=False)

    def forward(self, in_idx):
        """
        Computes token and positional embeddigs for input indices
        Applies dropout
        Process data though the transformer block
        Applies normalization

        @return logits
        """
        batch_size, seq_len = in_idx.shape
        tok_embeds = self.tok_emb(in_idx)
        post_embeds = self.post_emb(torch.arange(seq_len, device=in_idx.device))
        x = tok_embeds + post_embeds
        x = self.drop_emb(x)
        x = self.transform_blocks(x)
        x = self.final_norm(x)
        logits = self.out_head(x)
        return logits


class LayerNorm(nn.Module):
    """
     Improves the stability and efficiency of neuronal network training
     Adjust the activations of a neuronal network layer to have a mean of 0 and variance of 1
     Speeds up the convergence to effective weights and ensures consistent (reliable training)
    """

    def __init__(self, embedding_dim):
        super().__init__()
        self.eps = 1e-5  # prevent division by zero
        self.scale = nn.Parameter(torch.ones(embedding_dim))
        self.shift = nn.Parameter(torch.zeros(embedding_dim))

    def forward(self, x):
        mean = x.mean(dim=-1, keepdim=True)
        var = x.var(dim=-1, keepdim=True, unbiased=False)
        norm_x = (x - mean) / torch.sqrt(var + self.eps)
        return self.scale * norm_x + self.shift


class TransformerBlock(nn.Module):
    """
    Transform the vectors in a way that preserves their dimensionality
    """

    def __init__(self, cfg):
        super().__init__()
        self.attn = MultiHeadAttention(d_in=cfg["embedding_dim"],
                                       d_out=cfg["embedding_dim"],
                                       context_length=cfg["context_length"],
                                       num_heads=cfg["heads"],
                                       dropout=cfg["droprate"],
                                       qkv_bias=cfg["qkv_bias"])
        self.ff = FeedForward(cfg)
        self.norm1 = LayerNorm(cfg["embedding_dim"])
        self.norm2 = LayerNorm(cfg["embedding_dim"])
        self.drop_shortcut = nn.Dropout(cfg["droprate"])

    def forward(self, x):
        shortcut = x
        x = self.norm1(x)
        x = self.attn(x)
        x = self.drop_shortcut(x)
        x = x + shortcut

        shortcut = x
        x = self.norm2(x)
        x = self.attn(x)
        x = self.drop_shortcut(x)
        x = x + shortcut
        return x
