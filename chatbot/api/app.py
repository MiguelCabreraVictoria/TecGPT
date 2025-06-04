from fastapi import FastAPI
from pydantic import BaseModel
from training.llm.evaluation import generate_from_prompt

app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
async def root():
    return {
        "message": "Welcome to the GPT API. Use POST /generate with a JSON body like {'prompt': 'your prompt here'}."
    }

@app.post("/generate")
async def generate_text(request: PromptRequest):
    response_text = generate_from_prompt(request.prompt)
    return {"response": response_text}
