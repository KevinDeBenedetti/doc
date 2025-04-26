<!-- Translated on 26/04/2025 -->

```markdown
---
title: GitHub Documentation
---

# GitHub Documentation

## GHCR

### Commands

#### Generate a Personal Access Token (PAT)
In GitHub settings, generate a PAT with the right packages.

Connect to GitHub account, `Settings`, `Developer settings`. In `Developer settings`, in `Personal access tokens` choose Tokens (classic) and generate a new token with rights (duration and authorization read:packages)

#### Login to GHCR with Docker
```sh
echo "<TOKEN>" | docker login ghcr.io -u <USERNAME> --password-stdin
```

#### Download and execute an image
```sh
docker pull ghcr.io/<USERNAME>/<IMAGE_NAME>
docker run -d -p <PORT_HOST>:<PORT_CONTAINER> ghcr.io/<USERNAME>/<IMAGE_NAME>
```

#### Logout from GHCR
```sh
docker logout ghcr.io
```

## GitHub Actions

### Push and deploy images with GHCR

Create a workflow `.github/workflows/ghcr.yaml`.

```yml
name: GitHub Container Registry

on:
  push:
    branches:
      - main

jobs:
  ghcr:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      attestations: write
      id-token: write

    # Verify the repository
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    # Login GHCR
    - name: Login to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Build and push Api Docker image
      run: |
        docker build -t ghcr.io/${{ vars.REPO_OWNER }}/<TAG_NAME>:latest ./<APP_CODE>
        docker push ghcr.io/${{ vars.REPO_OWNER }}/<TAG_NAME>:latest

    - name: Logout from GHCR
      run: docker logout ghcr.io

Déploy sur un VPS

Pour le déploiment avec SSH nous utiliserons l’utilitaire GitHub Actions, appleboy.

Connexion avec identifiant et mot de passe
.github/workflows/ghcr.yaml
name: GitHub Container Registry

on:
  push:
    branches:
      - main

jobs:
  ghcr:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      attestations: write
      id-token: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Set lowercase repository owner
      run: echo "REPO_OWNER=$(echo ${{ github.repository.name }}')"
      # This is a placeholder, the actual value will depend on the repository name
      # You'll need to adapt this to your specific repository.
      # Example: echo "my-project"

    - name: Build and push Api Docker image
      run: |
        docker build -t ghcr.io/${{ vars.REPO_OWNER }}/<TAG_NAME>:latest ./<APP_CODE>
        docker push ghcr.io/${{ vars.REPO_OWNER }}/<TAG_NAME>:latest

    - name: Logout from GHCR
      run: docker logout ghcr.io

Configurer les clés ssh pour GitHub documentation.

Configurer sur le VPS
Créer un fichier compose.prod.yaml
./PROJECT_NAME/compose.prod.yaml
services:
  app:
    image: ghcr.io/${{ vars.REPO_OWNER }}/<TAG_NAME>:latest
    ports:
    - "XXXX:XXXX"
```
