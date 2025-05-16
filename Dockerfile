# dev
FROM docker.io/node:22.15.0-slim AS dev

WORKDIR /app

RUN npm install --ignore-scripts --location=global pnpm@10.11.0
COPY package.json ./
RUN pnpm install --ignore-scripts
COPY . .
EXPOSE 5173
CMD ["pnpm", "run", "docs:dev"]