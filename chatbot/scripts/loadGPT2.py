from training.llm.gpt_download import download_and_load_gpt2

settings, params = download_and_load_gpt2("124M", models_dir="./checkpoints/gpt2")