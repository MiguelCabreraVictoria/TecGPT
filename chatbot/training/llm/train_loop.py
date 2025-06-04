import torch
import tiktoken
import os
from training.llm.plotting import plot_losses
from utils.config_loader import LLM_CONFIG
from models.llm.model.gpt_model import GPTModel
from models.llm.dataloader.dataloader import create_dataloader



def text_to_token_ids(text, tokenizer):

    encoded = tokenizer.encode(text)
    encoded_tensor = torch.tensor(encoded).unsqueeze(0) # adds the batch dimension
    return encoded_tensor


def token_ids_to_text(token_ids, tokenizer):
    flat = token_ids.squeeze(0)  # removes the batch dimension
    return tokenizer.decode(flat.tolist())


def calculate_loss_batch(input_batch, target_batch, model, device):
    input_batch = input_batch.to(device)
    target_batch = target_batch.to(device)

    logits = model(input_batch)
    loss = torch.nn.functional.cross_entropy(logits.flatten(0, 1), target_batch.flatten())
    return loss

def calculate_loss_loader(data_loader, model, device, num_batches=None):
    """
    Accumulate the loss over a number of batches then computes the average loss
    over the number of batches.
    """
    total_loss = 0.
    if len(data_loader) == 0:
        return float('nan')
    elif num_batches is None:
        num_batches = len(data_loader)
    else:
        num_batches = min(num_batches, len(data_loader))
    
    for i, (input_batch, target_batch) in enumerate(data_loader):
        if i < num_batches:
            loss = calculate_loss_batch(input_batch, target_batch, model, device)
            total_loss += loss.item()
        else:
            break
    return total_loss / num_batches


def generate(model, idx, max_new_tokens, context_size, temperature = 0.0, top_k=None, eos_id=None):
    
    idx = idx.to(next(model.parameters()).device)

    for _ in range(max_new_tokens):
        
        idx_cond = idx[:, -context_size:]  # Crop context if needed
        with torch.no_grad():
            logits = model(idx_cond)
        logits = logits[:, -1, :]  # Get the last time step

        if top_k is not None:
            top_logits, _ = torch.topk(logits, top_k)
            min_val = top_logits[:, -1]
            logits = torch.where(logits < min_val, torch.tensor(float("-inf")).to(logits.device), logits)

        if temperature > 0.0:
            logits = logits / temperature
            probs = torch.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
        else:
            idx_next = torch.argmax(logits, dim=-1, keepdim=True)
        
        if idx_next == eos_id:
            break

        idx = torch.cat((idx, idx_next), dim=1)  # Append the new token
    return idx
 

def evaluate_model(model, train_loader, val_loader, device, eval_iter):
    model.eval()
    with torch.no_grad():
        train_loss = calculate_loss_loader(train_loader, model, device, num_batches=eval_iter)
        val_loss = calculate_loss_loader(val_loader, model, device, num_batches=eval_iter)
    
    model.train()
    return train_loss, val_loss

def train_model(model, train_loader, val_loader, optimizer, device, num_epochs, eval_freq, eval_iter, start_context, tokenizer):
    train_losses, val_losses, track_tokens_seen = [], [], []
    tokens_seen, global_step = 0, -1

    for epoch in range(num_epochs):
        model.train()
        for input_batch, target_batch in train_loader:
            optimizer.zero_grad()
            loss = calculate_loss_batch(input_batch, target_batch, model, device)
            loss.backward()
            optimizer.step()
            tokens_seen += input_batch.numel() # Count the number of tokens seen
            global_step += 1

            if global_step % eval_freq == 0:
                train_loss, val_loss = evaluate_model(model, train_loader, val_loader, device, eval_iter)
                train_losses.append(train_loss)
                val_losses.append(val_loss)
                track_tokens_seen.append(tokens_seen)
                print(f"Epoch {epoch + 1}, Step {global_step:06d}:  Train Loss: {train_loss:.3f}, Val Loss: {val_loss:.3f}")
        
        generate_and_print_sample(model, tokenizer, device, start_context)

        torch.cuda.empty_cache()


    return train_losses, val_losses, track_tokens_seen


def generate_and_print_sample(model, tokenizer, device, start_context):
    model.eval()
    context_size = model.post_emb.weight.shape[0]
    with torch.no_grad():
        token_ids = generate(model=model, 
                            idx=text_to_token_ids(start_context, tokenizer), 
                            max_new_tokens=15, 
                            context_size=LLM_CONFIG["model"]["context_length"],
                            top_k=25,
                            temperature=0.8)
    decoded_text = token_ids_to_text(token_ids, tokenizer)
    print(decoded_text.replace("\n", " "))
    model.train()


def main():
    torch.manual_seed(123)

    ## Extract the dataset

    with open('/home/miguel/Documents/TecGPT/data/dataset.txt', 'r') as file:
        raw_text = file.read()

    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = GPTModel(LLM_CONFIG['model'])
    model.eval()
    model.to(device)
    
    optimizer = torch.optim.AdamW(model.parameters(),  lr = LLM_CONFIG['training']['learning_rate'], weight_decay=LLM_CONFIG['training']['weight_decay'])

    tokenizer = tiktoken.get_encoding(LLM_CONFIG["dataset"]["encoder"])
    start_context = "User: "

    total_characters = len(raw_text)
    total_tokens = len(tokenizer.encode(raw_text))
    print(f"Total characters: {total_characters}")
    print(f"Total tokens: {total_tokens}")

    # Split the dataset into train and validation sets (80% train, 20% validation)
    train_ratio = 0.90
    split_index = int(train_ratio * total_characters)
    train_data = raw_text[:split_index]
    val_data = raw_text[split_index:]

    train_loader = create_dataloader(train_data, LLM_CONFIG["train_dataloader"])
    val_loader = create_dataloader(val_data, LLM_CONFIG["dataloader"])
    

    # print('train_loader')
    # for x, y in train_loader:
    #     print(x.shape, y.shape)

    # print('val_loader')
    # for x, y in val_loader:
    #     print(x.shape, y.shape)


        
    start_context = "Tec de Monterrey"

    train_losses, val_losses, tokens_seen = train_model(model, 
                                                        train_loader, 
                                                        val_loader, 
                                                        optimizer, 
                                                        device, 
                                                        num_epochs=LLM_CONFIG['training']['epochs'], 
                                                        eval_freq=LLM_CONFIG['training']['eval_freq'], 
                                                        eval_iter=LLM_CONFIG['training']['eval_iter'], 
                                                        start_context=start_context, 
                                                        tokenizer=tokenizer)
    
    
    return train_losses, val_losses, tokens_seen, model, optimizer


if __name__ == "__main__":
    train_losses, val_losses, tokens_seen, model, optimizer = main()
    epochs_tensor = torch.linspace(0, LLM_CONFIG['training']['epochs'], len(train_losses))
    plot_losses(epochs_tensor, tokens_seen, train_losses, val_losses)

    # Save the model
    path = os.getcwd()
    checkpoint_path = os.path.join(path, "checkpoints", "GPT_checkpoints.pth")
    torch.save({
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "train_losses": train_losses,
        "val_losses": val_losses,
        "tokens_seen": tokens_seen,
    }, checkpoint_path)
    


    
                    
