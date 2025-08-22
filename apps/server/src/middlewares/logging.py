import time
import uuid
from typing import Callable, Optional
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import StreamingResponse
import json
from datetime import datetime
from src.core.logger import get_logger
from src.core.config import get_app_settings

logger = get_logger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        *,
        skip_paths: Optional[list] = None,
        skip_methods: Optional[list] = None,
        log_request_body: bool = True,
        log_response_body: bool = False,
        max_body_size: int = 10000,
    ):
        super().__init__(app)
        self.skip_paths = skip_paths or ["/docs", "/openapi.json", "/favicon.ico"]
        self.skip_methods = skip_methods or []
        self.log_request_body = log_request_body
        self.log_response_body = log_response_body
        self.max_body_size = max_body_size
        
        # Déterminer le format de log pour adapter les messages
        settings = get_app_settings()
        self.log_format = getattr(settings, 'log_format', 'json').lower()

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        request.state.request_id = request_id
        
        if self._should_skip_logging(request):
            return await call_next(request)
        
        await self._log_request(request, request_id)
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            await self._log_response(request, response, request_id, process_time)
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            await self._log_error(request, e, request_id, process_time)
            raise

    def _should_skip_logging(self, request: Request) -> bool:
        return (
            request.url.path in self.skip_paths or
            request.method in self.skip_methods
        )

    async def _log_request(self, request: Request, request_id: str):
        """Log les détails de la requête entrante"""
        body = None
        if self.log_request_body and request.method in ["POST", "PUT", "PATCH"]:
            try:
                body_bytes = await request.body()
                if len(body_bytes) <= self.max_body_size:
                    body = body_bytes.decode('utf-8')
                else:
                    body = f"<Body too large: {len(body_bytes)} bytes>"
            except Exception:
                body = "<Unable to read body>"

        # Adapter le message selon le format
        if self.log_format == 'json':
            log_data = {
                "event": "request_started",
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "path": request.url.path,
                "query_params": dict(request.query_params),
                "headers": dict(request.headers),
                "client_ip": self._get_client_ip(request),
                "user_agent": request.headers.get("user-agent"),
                "timestamp": datetime.utcnow().isoformat(),
                "body": body if self.log_request_body else None
            }
            logger.info("Request started", extra={"log_data": log_data})
        else:
            # Format texte/couleur - message simple et lisible
            client_ip = self._get_client_ip(request)
            message = f"[{request_id[:8]}] {request.method} {request.url.path} from {client_ip}"
            if body and len(body) < 200:  # Afficher le body seulement s'il est court
                message += f" | Body: {body[:100]}{'...' if len(body) > 100 else ''}"
            logger.info(message)

    async def _log_response(self, request: Request, response: Response, request_id: str, process_time: float):
        """Log les détails de la réponse"""
        
        if self.log_format == 'json':
            response_body = None
            if self.log_response_body and hasattr(response, 'body'):
                try:
                    if isinstance(response, StreamingResponse):
                        response_body = "<Streaming response>"
                    else:
                        body_bytes = getattr(response, 'body', b'')
                        if len(body_bytes) <= self.max_body_size:
                            response_body = body_bytes.decode('utf-8')
                        else:
                            response_body = f"<Body too large: {len(body_bytes)} bytes>"
                except Exception:
                    response_body = "<Unable to read response body>"

            log_data = {
                "event": "request_completed",
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "path": request.url.path,
                "status_code": response.status_code,
                "process_time": round(process_time, 4),
                "response_headers": dict(response.headers),
                "timestamp": datetime.utcnow().isoformat(),
                "response_body": response_body if self.log_response_body else None
            }
        else:
            # Format texte/couleur - message simple
            status_emoji = "✅" if response.status_code < 400 else "⚠️" if response.status_code < 500 else "❌"
            message = f"[{request_id[:8]}] {status_emoji} {response.status_code} | {process_time:.3f}s | {request.method} {request.url.path}"
            log_data = None

        # Niveau de log basé sur le status code
        if response.status_code >= 500:
            if self.log_format == 'json':
                logger.error("Request completed with server error", extra={"log_data": log_data})
            else:
                logger.error(message)
        elif response.status_code >= 400:
            if self.log_format == 'json':
                logger.warning("Request completed with client error", extra={"log_data": log_data})
            else:
                logger.warning(message)
        else:
            if self.log_format == 'json':
                logger.info("Request completed successfully", extra={"log_data": log_data})
            else:
                logger.info(message)

    async def _log_error(self, request: Request, error: Exception, request_id: str, process_time: float):
        """Log les erreurs"""
        if self.log_format == 'json':
            log_data = {
                "event": "request_error",
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "path": request.url.path,
                "error_type": type(error).__name__,
                "error_message": str(error),
                "process_time": round(process_time, 4),
                "timestamp": datetime.utcnow().isoformat()
            }
            logger.error("Request failed with error", extra={"log_data": log_data}, exc_info=True)
        else:
            message = f"[{request_id[:8]}] ❌ ERROR | {process_time:.3f}s | {request.method} {request.url.path} | {type(error).__name__}: {str(error)}"
            logger.error(message, exc_info=True)

    def _get_client_ip(self, request: Request) -> str:
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(',')[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"