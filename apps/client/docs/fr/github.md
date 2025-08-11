---
title: GitHub documentation
translated: true
translatedDate: 27/04/2025
verified: true
---

# Documentation du Registre de Conteneurs GitHub

## GHCR

### Commandes

#### Générer un Token d'Accès Personnel (PAT)
Dans les paramètres GitHub, générer un PAT avec les packages appropriés.

Se connecter au compte GitHub, `Settings`, `Developer settings`. Dans `Developer settings`, dans `Personal access tokens` choisir Tokens (classic) et générer un nouveau token avec les droits (durée et autorisation lecture:packages).

#### Connexion à GHCR avec Docker
```sh
echo "<TOKEN>" | docker login ghcr.io -u <USERNAME> --password-stdin
```

#### Télécharger et exécuter une image
```sh
docker pull ghcr.io/<USERNAME>/<IMAGE_NAME>
docker run -d -p <PORT_HOST>:<PORT_CONTAINER> ghcr.io/<USERNAME>/<IMAGE_NAME>
```

#### Déconnexion de GHCR
```sh
docker logout ghcr.io
```

## GitHub Actions

### Pousser et déployer des images avec GHCR

Créer un workflow `.github/workflows/ghcr.yaml`.

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

    # Vérifier le référentiel
    steps:
    - name: Checkout référentiel
      uses: actions/checkout@v4

    # Connexion GHCR
    - name: Login to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Construire et pousser l'image Api Docker
      run: |
        docker build -t ghcr.io/${{ vars.REPO_OWNER }}/<TAG_NAME>:latest ./<APP_CODE>
        docker push ghcr.io/${{ vars.REPO_OWNER }}/<TAG_NAME>:latest

    # Déconnexion GHCR
    - name: Logout from GHCR
      run: docker logout ghcr.io
```

```yml
.github/workflows/ghcr.yaml
...

  deploy:
    needs: [ghcr]
    runs-on: ubuntu-latest
    steps:
        - name: Déployer en utilisant ssh
          uses: appleboy/ssh-action@v1.0.3
          with:
            host: ${{ secrets.SSH_HOST }}
            username: ${{ secrets.SSH_USERNAME }}
            password: ${{ secrets.SSH_PASSWORD }}
            port: ${{ secrets.SSH_PORT }}
            script: |
              echo ${{ secrets.GHCR_PAT }} | docker login ghcr.io -u ${{ github.REPOSITORY_OWNER }} --password-stdin
              docker pull ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest
              docker compose.prod.yaml
              docker logout ghcr.io
```

```yml
.github/workflows/ghcr.yaml
...

  deploy:
    needs: [ghcr]
    runs-on: ubuntu-latest
    steps:
        - name: Déployer en utilisant ssh
          uses: appleboy/ssh-action@v1.0.3
          with:
            host: ${{ secrets.SSH_HOST }}
            username: ${{ secrets.SSH_USERNAME }}
            key: ${{ secrets.SSH_KEY }}
            port: ${{ secrets.SSH_PORT }}
            script: |
              echo ${{ secrets.GHCR_PAT }} | docker login ghcr.io -u ${{ github.REPOSITORY_OWNER }} --password-stdin
              docker pull ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest
              docker compose.prod.yaml
              docker logout ghcr.io
```

Configurer les clés ssh pour la documentation GitHub.

Configurer sur le VPS
Créer un fichier compose.prod.yaml
```yml
./PROJECT_NAME/compose.prod.yaml
services:
  app:
    image: ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest
    ports:
    - "XXXX:XXXX"
```
