# -----------------------------------------------------------------------------
# Logger Usage (Structured Overview)
# -----------------------------------------------------------------------------
# Purpose:
#   Provides get_logger(name) returning a configured logging.Logger supporting:
#     - JSON logs (structured, machine-friendly)
#     - Colored human-readable console logs
#     - Plain text fallback
#
# Configuration (via app settings object from get_app_settings()):
#   log_format        : "json" | "color"/"colored" | (any other -> plain text)
#   log_level         : e.g. "DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"
#   force_color_logs  : bool (force ANSI colors even if no TTY)
#
# Core API:
#   from src.shared.logger import get_logger, app_logger
#   logger = get_logger("my.component")
#   logger.info("Started")
#
# Structured / contextual data:
#   logger.info("User login", extra={"log_data": {"user_id": uid, "ip": ip}})
#   (Keys inside log_data are merged into the JSON log root.)
#
# Exceptions:
#   try:
#       ...
#   except Exception:
#       logger.exception("Failure processing job")  # Adds 'exception' field in JSON
#
# Global logger:
#   app_logger can be imported for general application-level logging.
#
# Notes:
#   - JSONFormatter outputs ISO 8601 timestamps.
#   - ColoredFormatter aligns level names and applies ANSI colors.
#   - Handlers are added only once per logger name (no duplicate outputs).
# 
# Example :
#   logger.debug("Message debug")
#   logger.info("Message info")
#   logger.warning("Message warning")
#   logger.error("Message error")
#   logger.critical("Message critical")
# -----------------------------------------------------------------------------
import logging
import sys
import os
from typing import Optional
import json
from datetime import datetime
from src.shared.config import get_app_settings

class JSONFormatter(logging.Formatter):
    """Formatter personnalisé pour les logs JSON"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Ajouter les données supplémentaires si elles existent
        if hasattr(record, 'log_data'):
            log_entry.update(record.log_data)
        
        # Ajouter l'exception si elle existe
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_entry, ensure_ascii=False, default=str)

class ColoredFormatter(logging.Formatter):
    """Formatter avec couleurs - force l'affichage des couleurs"""
    
    LEVEL_COLORS = {
        logging.DEBUG: "\033[36m",    # Cyan
        logging.INFO: "\033[32m",     # Vert
        logging.WARNING: "\033[33m",  # Jaune
        logging.ERROR: "\033[31m",    # Rouge
        logging.CRITICAL: "\033[35m", # Magenta
    }
    RESET = "\033[0m"
    BOLD = "\033[1m"

    def __init__(self, fmt: str = None, datefmt: str = None, style: str = "%", force_color: bool = True):
        fmt = fmt or "%(asctime)s %(levelname_color)s%(name)s%(reset)s - %(message)s"
        super().__init__(fmt=fmt, datefmt=datefmt, style=style)
        self.force_color = force_color
        
        # Support Windows
        if os.name == 'nt':  # Windows
            try:
                import colorama
                colorama.just_fix_windows_console()
            except ImportError:
                pass

    def format(self, record: logging.LogRecord) -> str:
        # Forcer les couleurs si demandé ou si TTY détecté
        use_color = self.force_color or self._supports_color()
        
        if use_color:
            color = self.LEVEL_COLORS.get(record.levelno, "")
            record.levelname_color = f"{color}{self.BOLD}{record.levelname:<8}{self.RESET}"
            record.reset = self.RESET
        else:
            record.levelname_color = f"{record.levelname:<8}"
            record.reset = ""
        
        return super().format(record)
    
    def _supports_color(self) -> bool:
        """Détecte si le terminal supporte les couleurs"""
        try:
            # Variables d'environnement qui indiquent le support des couleurs
            if os.getenv('FORCE_COLOR') or os.getenv('COLORTERM'):
                return True
            
            term = os.getenv('TERM', '').lower()
            if 'color' in term or term in ('xterm', 'xterm-256color', 'screen'):
                return True
                
            return hasattr(sys.stdout, "isatty") and sys.stdout.isatty()
        except Exception:
            return False

def get_logger(name: str, level: Optional[str] = None) -> logging.Logger:
    """
    Crée et configure un logger avec formatage JSON ou couleur
    """
    settings = get_app_settings()
    
    logger = logging.getLogger(name)
    
    if not logger.handlers:  # Éviter la duplication des handlers
        # Configure log level
        log_level = level or getattr(settings, 'log_level', 'INFO')
        logger.setLevel(getattr(logging, log_level.upper()))
        
        # Create handler
        handler = logging.StreamHandler(sys.stdout)
        
        # Configure formatter
        log_format = getattr(settings, 'log_format', 'json').lower()
        force_color = getattr(settings, 'force_color_logs', True)
        
        if log_format == 'json':
            formatter = JSONFormatter()
        elif log_format in ('color', 'colored'):
            formatter = ColoredFormatter(
                fmt='%(asctime)s %(levelname_color)s%(name)s%(reset)s - %(message)s',
                force_color=force_color
            )
        else:
            formatter = logging.Formatter('%(asctime)s %(levelname)-8s %(name)s - %(message)s')
        
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        # Avoid propagation to parent logger
        logger.propagate = False
    
    return logger

def configure_uvicorn_loggers():
    """
    Aligne les loggers Uvicorn (serveur / accès) sur le même formatage que l'app.
    À appeler après get_app_settings() disponible.
    """
    settings = get_app_settings()
    log_format = getattr(settings, 'log_format', 'json').lower()
    force_color = getattr(settings, 'force_color_logs', True)
    level_name = getattr(settings, 'log_level', 'INFO').upper()
    try:
        level = getattr(logging, level_name)
    except AttributeError:
        level = logging.INFO

    # Liste des loggers Uvicorn concernés
    targets = ["uvicorn", "uvicorn.error", "uvicorn.access"]

    if log_format == 'json':
        formatter = JSONFormatter()
    elif log_format in ('color', 'colored'):
        formatter = ColoredFormatter(
            fmt='%(asctime)s %(levelname_color)s%(name)s%(reset)s - %(message)s',
            force_color=force_color
        )
    else:
        formatter = logging.Formatter('%(asctime)s %(levelname)-8s %(name)s - %(message)s')

    for name in targets:
        lg = logging.getLogger(name)
        # Nettoyer les handlers existants
        for h in list(lg.handlers):
            lg.removeHandler(h)
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(formatter)
        lg.addHandler(handler)
        lg.setLevel(level)
        lg.propagate = False

# Global logger for the application
app_logger = get_logger("app")
# Harmoniser les logs Uvicorn avec ceux de l'application
configure_uvicorn_loggers()
