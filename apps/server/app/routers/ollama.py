from fastapi import APIRouter, HTTPException
from ..services.ollama import check_ollama_health, get_ollama_version
import ollama

router = APIRouter(
    prefix="/health",
    tags=["health"],
)

OLLAMA_BASE_URL = "http://localhost:11434"

@router.get("/")
def health_check():
    if check_ollama_health():
        return {"status": "ok"}
    else:
        raise HTTPException(status_code=503, detail="Ollama API unreachable")
    
@router.get("/api/version")
def ollama_version():
    if get_ollama_version():
    version = get_ollama_version()
    if version:
        return version
    else:
        raise HTTPException(status_code=503, detail="Ollama API version unreachable")
    
@router.get("/models")
def ollama_models():
    try:
        models = ollama.list()
        return models
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Ollama error: {e}")