import requests
import typer
app = typer.Typer()

OLLAMA_URL = "http://localhost:11434"
MODEL = "gemma3:1b"

@app.command()
def test_ollama_connection():
  r = requests.get(f"{OLLAMA_URL}/api/version")
  print("Connected to Ollama API:", r.json())