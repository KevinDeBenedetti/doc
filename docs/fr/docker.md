---
title: Docker
translated: true
translatedDate: 27/04/2025
verified: true
---

```
# Docker documentation

## Basics commands

### Show

#### Show running containers
```sh
docker ps
```

#### Show stopped containers
```sh
docker ps -a
```

#### Show images
```sh
docker images
```

#### Go to the terminal of a running container
```sh
docker exec -it <container_name> sh
```

```sh
docker exec -it <container_name> bash
```

### Mount

#### Mount an image
```sh
docker build <image_name>
```

#### Mount with docker compose
```sh
docker compose up -d
```

### Save

#### Create a locale save of a container
```sh
docker save -o <save_name>.tar <image_name>
```

### Delete

#### A stopped container by id
```sh
docker rm <container_id>
```

#### All stopped containers
```sh
docker rm $(docker ps -a -q)
```

#### All containers not started
```sh
docker rm $(sudo docker ps -a -q -f 'status=exited')
```

#### Unused image by id
```sh
docker rmi <image_id>
```

#### All unused images (not associated to a container)
```sh
docker image prune
```

#### Unused volumes
```sh
docker prune
```

### Clean

#### Delete all unused objects (containers, images, volumes and networks)
```sh
docker system prune
```

#### Delete all unused objects, with running containers
```sh
docker system prune -a
```

#### Complete cleaning
```sh
docker system prune --volumes -a
```

### Mount

#### Mount an image with a `Dockerfile`
```sh
docker build -t <image_name> .
```

### Run

#### Run an image
```sh
docker run --name <container_name> <image_name>
```

#### Run an image on a port
```sh
docker run --name <container_name> -p 3000:3000 <image_name>
```

### Load

#### Load an image from a `.tar` file
```sh
docker load --input <file_name>.tar
```
```