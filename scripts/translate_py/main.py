import typer
import frontmatter  # python-frontmatter
from rich import print

app = typer.Typer()

@app.command()
def translate_all(src: str = "docs/en", out: str = "docs"):
    """
    Start the translation of every files Mardown.
    """
    # print("[bold red]Alert![/bold red] [green]Portal gun[/green] shooting! :boom:")
    typer.echo("🚀 Démarrage du processus de traduction")
    test_ollama_connection()


# formatter_utils.py
def load_frontmatter(text: str):
    """
    Retourne un tuple (metadata: dict, content: str).
    """
    post = frontmatter.loads(text)
    return post.metadata, post.content

def dump_frontmatter(metadata: dict, content: str) -> str:
    """
    Reconstruit le texte complet avec frontmatter.
    """
    post = frontmatter.Post(content, **metadata)
    return frontmatter.dumps(post)

# file_processor.py
import os
from pathlib import Path

def process_directory(src_dir: str, out_root: str):
    """
    Parcourt tous les .md dans src_dir et lance la traduction pour chaque langue.
    """
    src_path = Path(src_dir)
    for root, _, files in os.walk(src_path):  # os.walk pour l’arborescence :contentReference[oaicite:6]{index=6}
        for file in filter(lambda f: f.endswith(".md"), files):
            input_path = Path(root) / file
            # Exemple de langues à traduire
            for lang in ["fr", "es", "de"]:
                translate_markdown_file(input_path, out_root, lang)

# mask_utils.py
import re

def mask_code_blocks(text: str):
    blocks = []
    def repl(match):
        idx = len(blocks)
        blocks.append(match.group(0))
        return f"<!--CODE_{idx}-->"
    masked = re.sub(r"```[\\s\\S]*?```", repl, text)
    return masked, blocks

def mask_code_groups(text: str):
    groups = []
    def repl(match):
        idx = len(groups)
        groups.append(match.group(0))
        return f"<!--CG_{idx}-->"
    masked = re.sub(r"^::: *code-group[\\s\\S]*?^:::", repl, text, flags=re.M)
    return masked, groups

def mask_headers(text: str):
    headers = []
    def repl(match):
        idx = len(headers)
        headers.append(match.group(0))
        return f"<!--HEADER_{idx}-->"
    masked = re.sub(r"^#{1,6}\\s.*$", repl, text, flags=re.M)
    return masked, headers

def unmask(text: str, placeholders: list, tag: str):
    pattern = rf"<!--{tag}_(\\d+)-->"
    def repl(m):
        return placeholders[int(m.group(1))]
    return re.sub(pattern, repl, text)

# api_client.py
import requests

OLLAMA_URL = "http://localhost:11434"
MODEL = "gemma3"

def test_ollama_connection():
    r = requests.get(f"{OLLAMA_URL}/api/version")
    print("Connected to Ollama API:", r.json())

def translate_text(text: str, lang: str) -> str:
    payload = {
        "model": MODEL,
        "prompt": text,
        "stream": False,
        "options": {"temperature": 0.2, "top_p": 0.9},
        "raw": False,
        "keep_alive": "5m"
    }
    r = requests.post(f"{OLLAMA_URL}/api/generate", json=payload)
    r.raise_for_status()
    return r.json()["response"]

# structure_check.py
from markdown_it import MarkdownIt

md = MarkdownIt("commonmark")

def count_headings(text: str) -> int:
    tokens = md.parse(text)
    return sum(1 for t in tokens if t.type == "heading_open")

def check_structure(original: str, translated: str):
    o = count_headings(original)
    t = count_headings(translated)
    if o != t:
        print(f"⚠️ Mismatch headers: original={o}, translated={t}")

# translator.py
from pathlib import Path
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
handler = logging.FileHandler("translation.log")
fmt = logging.Formatter("%(asctime)s [%(levelname)s]: %(message)s", datefmt="%d/%m/%Y %H:%M:%S")
handler.setFormatter(fmt)
logger.addHandler(handler)
logger.setLevel(logging.INFO)  # Configuration du logger :contentReference[oaicite:12]{index=12}

def translate_markdown_file(input_path: Path, out_root: str, lang: str):
    text = input_path.read_text(encoding="utf-8")
    metadata, body = load_frontmatter(text)

    metadata.update({
        "translated": True,
        "translatedDate": datetime.now().strftime("%d/%m/%Y"),
        "verified": False
    })

    # Masquage
    m1, cb = mask_code_blocks(body)
    m2, cg = mask_code_groups(m1)
    m3, hd = mask_headers(m2)

    # Traduction
    translated_masked = translate_text(m3, lang)

    # Démasquage
    t1 = unmask(translated_masked, hd, "HEADER")
    t2 = unmask(t1, cg, "CG")
    final_body = unmask(t2, cb, "CODE")

    # Vérif structure
    check_structure(body, final_body)

    # Écriture
    out_dir = Path(out_root) / lang
    out_dir.mkdir(parents=True, exist_ok=True)  # pathlib mkdir :contentReference[oaicite:13]{index=13}
    output = dump_frontmatter(metadata, final_body)
    (out_dir / input_path.name).write_text(output, encoding="utf-8")
    logger.info(f"✅ Traduit et sauvegardé : {input_path.name}")


if __name__ == "__main__":
    app()