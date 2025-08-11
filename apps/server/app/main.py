from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.shared.config import get_app_settings
from app.shared.logger import get_logger

# routes
# from app.shared.api import base
from app.routers import ollama, translate
# middlewares
from app.shared.middlewares.logging import LoggingMiddleware

logger = get_logger(__name__)
settings = get_app_settings()
app = FastAPI()

app.add_middleware(
    LoggingMiddleware,
    skip_paths=["/docs", "/openapi.json", "/favicon.ico", "/"],
    skip_methods=[],
    log_request_body=settings.log_request_body,
    log_response_body=settings.log_response_body,
    max_body_size=settings.max_log_body_size,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_url,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ollama.router)
app.include_router(translate.router)

@app.get("/", include_in_schema=False)
def root_redirect_to_docs():
    logger.info("Redirecting root to /docs")
    return RedirectResponse(url="/docs")