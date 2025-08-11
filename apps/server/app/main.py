from typing import Union
from fastapi import FastAPI
from app.routers import ollama, translate

app = FastAPI()

app.include_router(ollama.router)
app.include_router(translate.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
