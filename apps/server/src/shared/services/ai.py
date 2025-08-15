from typing import Optional, List, Any
from openai import OpenAI
# from langchain_openai import ChatOpenAI
from openai.types import Model
from src.shared.config import get_ai_settings
from datetime import datetime, timedelta

class AIService:
    _models_cache = None    
    _cache_timestamp = None
    _cache_duration = timedelta(minutes=30)

    def __init__(self, custom_model: Optional[str] = None):
        self.settings = get_ai_settings()
        self.ai_provider = self.settings.ai_provider.lower()
        self.model = custom_model or getattr(self.settings, "openai_model", None)

        self._providers = {
            "openai": self._init_openai,
            # "ollama": self._init_ollama,  # example future extension
        }
        try:
            self._providers[self.ai_provider]()
        except KeyError:
            raise ValueError(f"Unsupported AI provider: {self.ai_provider}")

    def _init_openai(self):
        api_key = self.settings.openai_api_key
        self.base_url = self.settings.openai_api_base
        if not api_key:
            raise ValueError("Missing OpenAI API key (openai_api_key).")
        self.client = OpenAI(api_key=api_key, base_url=self.base_url) if self.base_url else OpenAI(api_key=api_key)
        if not self.model:
            self.model = "gpt-oss"

    # def _init_ollama(self):
    #     # Placeholder for future provider implementation
    #     pass

    async def chat(self, messages: List[dict], **params) -> Any:
        if not hasattr(self, "client"):
            raise ValueError("AI Client not initialized.")
        model = params.pop("model", None) or self.model
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            **{k: v for k, v in params.items() if v is not None}
        )
        return response

    async def healthcheck(self):
        try:
            if not hasattr(self, "client"):
                return {"status": "error", "message": "AI client not initialized."}
            if not self.model:
                return {"status": "error", "message": "No model configured."}

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "ping"}],
                max_tokens=1,
            )

            if response and getattr(response, "choices", None):
                details = f"provider={self.ai_provider}, model={self.model}"
                if getattr(self, "base_url", None):
                    details += f", base_url={self.base_url}"
                return {"status": "ok", "message": f"AI service operational ({details})."}
            return {"status": "error", "message": "Invalid API response."}
        except Exception as e:
            return {"status": "error", "message": str(e)}


    async def list_models(self, use_cache: bool = True) -> list[Model]:
        try:
            if not hasattr(self, "client"):
                return []
            response = self.client.models.list()

            # Verify cache
            if (use_cache and 
                AIService._models_cache is not None and 
                AIService._cache_timestamp is not None and
                datetime.now() - AIService._cache_timestamp < AIService._cache_duration):
                return AIService._models_cache

            # Fetch models from API
            response = self.client.models.list()
            AIService._models_cache = response.data
            AIService._cache_timestamp = datetime.now()

            return response.data
        except Exception as e:
            print("Error while fetching models:", e)
            return []
