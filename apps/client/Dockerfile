ARG NODE_IMAGE=docker.io/node:22.17.1-slim
ARG PNPM_VERSION=10.13.1

FROM ${NODE_IMAGE} AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable pnpm && corepack install -g pnpm@${PNPM_VERSION}

COPY package.json ./
# COPY --chown=node:root . ./

FROM base AS dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts

EXPOSE 5173
CMD ["pnpm", "run", "docs:dev"]
