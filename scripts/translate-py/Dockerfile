FROM python:3.13-slim

WORKDIR /app

# Installer pipx pour gérer des venv isolés si besoin (facultatif, ici on le fait manuellement)
# RUN apt-get update && apt-get install -y python3-venv && rm -rf /var/lib/apt/lists/*

# Créer l'environnement virtuel dans /app/.venv
RUN python -m venv .venv

# Activer le venv pour les installs
ENV PATH="/app/.venv/bin:$PATH"

COPY requirements.txt ./


RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["python", "main.py"]