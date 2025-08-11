PYTHONPATH=$(PWD)

.PHONY: help setup apps start dev build clean
.DEFAULT_GOAL := help

help: ## Show helper
	@echo "Usage: make <command>"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}'

stop: ## Stop the development environment
	@echo "Stop dev environment..."
	docker compose down

clean: stop ## Clean build files and dependencies
	rm -rf apps/client/.vitepress apps/client/node_modules
	rm -rf apps/server/.ruff_cache apps/server/.venv

setup-server: clean ## Start the development server
	@echo "Setup api..."
		cd apps/server && \
		uv venv --clear && \
		source .venv/bin/activate && \
		uv sync

setup-client: ## Install dependencies for the apps
	@echo "Setup frontend..."
	cd apps/client && pnpm install

dev: setup-client ## Start the development environment (no automatic upgrade)
	@echo "Start dev environment (no upgrade)..."
	docker compose up -d

build: ## Build Docker containers
	@echo "Building containers..."
	docker compose build --no-cache

upgrade: ## Upgrade Nuxt
	@echo "Upgrade vitepress..."
	cd apps/client && pnpm upgrade

# TODO
# lint: ## Lint Nuxt code
# 	@echo "Lint nuxt..."
# 	cd apps/client && pnpm lint:fix