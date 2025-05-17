import typer
from api_client import app as test_connection

app = typer.Typer()

@app.command()
def translate_all(src: str = "docs/en", out: str = "docs"):
    """
    Start the translation of every files Mardown.
    """
    typer.echo("🚀 Démarrage du processus de traduction")
    test_connection()

def main():
    print(f"Hello")

if __name__ == "__main__":
    app()