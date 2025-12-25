.PHONY: help install dev build test lint format clean deploy

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm ci

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

test: ## Run tests
	npm run test

test-coverage: ## Run tests with coverage
	npm run test:coverage

lint: ## Run linter
	npm run lint

lint-fix: ## Run linter with auto-fix
	npm run lint:fix

format: ## Format code
	npm run format

format-check: ## Check formatting
	npm run format:check

type-check: ## Run TypeScript check
	npm run type-check

clean: ## Clean build artifacts
	rm -rf dist node_modules/.cache

storybook: ## Start Storybook
	npm run storybook

e2e: ## Run E2E tests
	npm run test:e2e

deploy: ## Deploy to production
	npm run build && npm run deploy
