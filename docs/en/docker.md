---
title: Docker
---

# Docker documentation

## Basics commands

### Show

> Show running containers
```sh
docker ps
```

> Show stopped containers
```sh
docker ps -a
```

> Show images
```sh
docker images
```

> Go to the terminal of a running container
```sh
docker exec -it <container_name> sh # or bash
```

### Mount

> Mount an image
```sh
docker build <image_name>
```

> Mount with docker compose
```sh
docker compose up -d
```

### Save

> Create a locale save of a container
```sh
docker save -o <save_name>.tar <image_name>
```

### Delete

> A stopped container by id
```sh
docker rm <container_id>
```

> All stopped containers
```sh
docker rm $(docker ps -a -q)
```

> All containers not started
```sh
docker rm $(sudo docker ps -a -q -f 'status=exited')
```

> Unused image by id
```sh
docker rmi <image_id>
```

> All unused images (not associated to a container)
```sh
docker image prune
```

> Unused volumes
```sh
docker prune
```

> Unused networks
```sh
docker network prune
```

### Clean

> Delete all unused objects (containers, images, volumes and networks)
```sh
docker system prune
```

> Delete all unused objects, with running containers
```sh
docker system prune -a
```

> Complete cleaning
```sh
docker system prune --volumes -a
```

### Mount

> Mount an image with a `Dockerfile`
```sh
docker build -t <image_name> .
```

### Run

> Run an image
```sh
docker run --name <container_name> <image_name>
```

> Run an image on a port
```sh
docker run --name <container_name> -p 3000:3000 <image_name>
```

### Load

> Load an image from a `.tar` file
```sh
docker load --input <file_name>.tar
```

## Network

> Create a docker network
```sh
docker network create --subnet 172.20.0.0/16 <network_name>
```

> Show networks
```sh
docker network ls
```

> Show a network detail
```sh
docker network inspect <network_name>
```

> Link a network to a container
```sh
docker network connect --ip 172.20.0.5 <network_name> <container_name>
```

## Stack

> List services from a stack
```sh
docker stack services <stack_name>
```

> Show logs
```sh
docker service logs <stack_name_service>
```
Use `-f` attribute to show logs in real time.

> Delete a stack
```sh
docker stack rm <stack_name>
```

## Dockerfile examples

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

> Development
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

::: tip Run the development environment
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
