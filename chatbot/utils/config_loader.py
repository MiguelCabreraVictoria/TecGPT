import os
import yaml


def load_config(file_name):

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    config_path = os.path.join(base_dir, 'config', file_name)
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"ERROR: El archivo de configuración '{file_name}' no existe en {config_path}")
    with open(config_path, 'r') as file:
        config = yaml.safe_load(file)
    return config


LLM_CONFIG = load_config('llm.yml')

