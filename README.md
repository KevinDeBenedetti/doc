## Developer Docs and Translation API

Monorepo for two parts:
- VitePress site for developer documentation (apps/client)
- FastAPI service for translating Markdown using LLMs (apps/server)

LLM backends:
- Ollama (local, default)
- OpenAI (optional/planned; adapter can be added later)

### Quick start (Docker)
- Requirements: Docker and Docker Compose
- Start both services:
    - docs: http://localhost:3001
    - api: http://localhost:8000

```bash
docker compose up -d
```

Optional: create a .env at repo root for service config.

### VitePress docs (local dev)
```bash
cd apps/client
pnpm install
pnpm run docs:dev
```

### Translation API (FastAPI)
- Base URL: http://localhost:8000
- Health and models (Ollama):
    - GET /health/
    - GET /health/api/version
    - GET /health/models
- Translate Markdown:
    - POST /translate/upload
    - multipart/form-data fields:
        - file: .md file
        - target_lang: e.g. fr
        - model: e.g. gemma3:latest
    - Response: translated markdown (text/plain)

Run locally without Docker:
```bash
cd apps/server
# option A (uvicorn)
uvicorn app.main:app --reload --port 8000
# option B (FastAPI CLI if installed)
fastapi dev app/main.py --port 8000
```
