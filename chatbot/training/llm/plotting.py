import os
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator



# Plot that shows the training loss and validation loss 

def plot_losses(epochs_seen, tokens_seen, train_losses, val_losses):
    fig, ax1 = plt.subplots(figsize=(10, 5))
    ax1.plot(epochs_seen, train_losses, label='Train Losses')
    ax1.plot(epochs_seen, val_losses, linestyle="-." ,label='Validation Losses')
    ax1.set_xlabel("Epochs")
    ax1.set_ylabel("Loss") 
    ax1.legend(loc="upper right")
    ax1.xaxis.set_major_locator(MaxNLocator(integer=True))
    ax2 = ax1.twiny()
    ax2.plot(tokens_seen, train_losses, alpha=0)
    ax2.set_xlabel("Tokens seen")
    fig.tight_layout()

    path  = os.getcwd()
    path = os.path.join(path, "images", "llm", "losses.png")
    fig.savefig(path)
    plt.close(fig)
    print(f"Losses plot saved to {path}")

