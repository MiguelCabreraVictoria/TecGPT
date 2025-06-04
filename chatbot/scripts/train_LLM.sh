#!/bin/bash

set -e 

# This script is used to train a large language model (LLM) 
cd "$(dirname "$0")/.." || exit 1

mkdir -p images/llm
mkdir -p checkpoints/pretrained

# Execute training script
python -m training.llm.train_loop
echo "Training completed."

python -m training.llm.evaluation
