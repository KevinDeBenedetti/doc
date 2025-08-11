from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class BaseConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="UTF-8")

class AppSettings(BaseConfig):
    app_name: str = "doc-translator"
    env: str
    frontend_url: str
    # Logs configuration
    log_level: str = "ERROR"  # Or WARNING for production
    log_format: str = "json"
    force_color_logs: bool = False

    # Middleware logging configuration
    log_request_body: bool = False
    log_response_body: bool = False
    max_log_body_size: int = 10000

class AISettings(BaseConfig):
    ai_provider: str
    # openai
    openai_api_key: Optional[str] = None
    openai_api_base: Optional[str] = None
    openai_model: Optional[str] = None
    # ollama
    ollama_model: Optional[str] = None
    ollama_host: Optional[str] = None

@lru_cache()
def get_app_settings() -> AppSettings:
    return AppSettings()

@lru_cache()
def get_ai_settings() -> AISettings:
    return AISettings()