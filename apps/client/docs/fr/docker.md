---
title: Docker
translated: true
translatedDate: 14/05/2025
verified: true
---

# Documentation Docker

## Commandes de base

### Montrer

> Afficher les conteneurs en cours d'exécution
```sh
docker ps
```

> Afficher les conteneurs arrêtés
```sh
docker ps -a
```

> Afficher les images
```sh
docker images
```

> Accéder au terminal d'un conteneur en cours d'exécution
```sh
docker exec -it <container_name> sh # or bash
```

### Monter

> Monter une image
```sh
docker build <image_name>
```

> Monter avec docker compose
```sh
docker compose up -d
```

### Sauvegarder

> Créer une sauvegarde d'un conteneur
```sh
docker save -o <save_name>.tar <image_name>
```

### Supprimer

> Un conteneur arrêté par ID
```sh
docker rm <container_id>
```

> Tous les conteneurs arrêtés
```sh
docker rm $(docker ps -a -q)
```

> Tous les conteneurs non démarrés
```sh
docker rm $(sudo docker ps -a -q -f 'status=exited')
```

> Image inutilisée par ID
```sh
docker rmi <image_id>
```

> Toutes les images inutilisées (non associées à un conteneur)
```sh
docker image prune
```

> Volumes inutilisés
```sh
docker prune
```

> Réseaux inutilisés
```sh
docker network prune
```

### Nettoyer

> Supprimer tous les objets inutilisés (conteneurs, images, volumes et réseaux)
```sh
docker system prune
```

> Supprimer tous les objets inutilisés, avec des conteneurs en cours d'exécution
```sh
docker system prune -a
```

> Nettoyage complet
```sh
docker system prune --volumes -a
```

### Monter

> Monter une image avec un `Dockerfile`
```sh
docker build -t <image_name> .
```

### Exécuter

> Exécuter une image
```sh
docker run --name <container_name> <image_name>
```

> Exécuter une image sur un port
```sh
docker run --name <container_name> -p 3000:3000 <image_name>
```

### Charger

> Charger une image à partir d'un fichier `.tar`
```sh
docker load --input <file_name>.tar
```

## Network

> Créer un réseau Docker
```sh
docker network create --subnet 172.20.0.0/16 <network_name>
```

> Afficher les réseaux
```sh
docker network ls
```

> Afficher les détails d'un réseau
```sh
docker network inspect <network_name>
```

> Lier un réseau à un conteneur
```sh
docker network connect --ip 172.20.0.5 <network_name> <container_name>
```

## Stack

> Lister les services d'une stack
```sh
docker stack services <stack_name>
```

> Afficher les logs
```sh
docker service logs <stack_name_service>
```
Utiliser l'attribut `-f` pour afficher les logs en temps réel.

> Supprimer une stack
```sh
docker stack rm <stack_name>
```

## Exemples Dockerfile

### Nuxt JS

> Production
::: code-group

```dockerfile [Dockerfile]
# syntax=docker/dockerfile:1
ARG NODE_VERSION=21.0.0

ARG PORT=3000

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

FROM base as build

COPY package.json /app/
COPY pnpm-lock.yaml /app/

# Install pnpm
RUN npm install -g pnpm

# Install all dependencies
RUN pnpm install

ADD . /app

RUN pnpm run build

FROM base

EXPOSE $PORT

COPY --from=build /app/.output /app/.output

CMD ["node", ".output/server/index.mjs"]
```

```yml [docker-compose.yml]
services:
  production:
    platform: linux/amd64 # Add this code for Apple Silicon
    build:
      context: .
    ports:
      - "3001:3000"
```

:::

> Développement
::: code-group

```dockerfile [Dockerfile.dev]
# syntax = docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-slim as base

ENV NODE_ENV=development

WORKDIR /src

# Build
FROM base as build

COPY --link package.json package-lock.json .
RUN npm install

# Run
FROM base

COPY --from=build /src/node_modules /src/node_modules

CMD [ "npm", "run", "dev" ]
```

```yml [docker-compose.dev.yml]
volumes:
  node_modules:
services:
  development:
    build:
      context: .
      dockerfile: ./Dockerfile.dev
    ports:
      - "3000:3000"
      - "24678:24678"
    volumes:
      - .:/src
      - node_modules:/src/node_modules
```
:::

::: tip Exécuter l'environnement de développement
```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
:::

### Fast API
```dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "80"]
```