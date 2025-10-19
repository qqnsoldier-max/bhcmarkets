#!/bin/bash

echo "Creating all project directories..."

# .github
mkdir -p .github/workflows

# apps/
mkdir -p apps/web/components
mkdir -p apps/web/pages
mkdir -p apps/web/public
mkdir -p apps/web/styles

mkdir -p apps/platform/public
mkdir -p apps/platform/src/app
mkdir -p apps/platform/src/features/auth
mkdir -p apps/platform/src/features/market-data
mkdir -p apps/platform/src/features/orders
mkdir -p apps/platform/src/features/portfolio
mkdir -p apps/platform/src/features/trading
mkdir -p apps/platform/src/shared/components/charts
mkdir -p apps/platform/src/shared/components/layout
mkdir -p apps/platform/src/shared/components/ui
mkdir -p apps/platform/src/shared/constants
mkdir -p apps/platform/src/shared/hooks
mkdir -p apps/platform/src/shared/utils
mkdir -p apps/platform/src/shared/types
mkdir -p apps/platform/src/services/api
mkdir -p apps/platform/src/services/ws
mkdir -p apps/platform/src/store
mkdir -p apps/platform/src/styles

mkdir -p apps/admin/public
mkdir -p apps/admin/src/app
mkdir -p apps/admin/src/features/users
mkdir -p apps/admin/src/features/trades
mkdir -p apps/admin/src/features/risk
mkdir -p apps/admin/src/features/analytics
mkdir -p apps/admin/src/shared
mkdir -p apps/admin/src/styles

# packages/
mkdir -p packages/backend/src/api/controllers
mkdir -p packages/backend/src/api/routes
mkdir -p packages/backend/src/api/validators
mkdir -p packages/backend/src/config
mkdir -p packages/backend/src/database/prisma
mkdir -p packages/backend/src/database/migrations
mkdir -p packages/backend/src/domains/account
mkdir -p packages/backend/src/domains/order
mkdir -p packages/backend/src/domains/trade
mkdir -p packages/backend/src/domains/user
mkdir -p packages/backend/src/market-data/adapters
mkdir -p packages/backend/src/realtime
mkdir -p packages/backend/src/utils

mkdir -p packages/worker/src/jobs

mkdir -p packages/database/migrations
mkdir -p packages/database/seed

mkdir -p packages/ui/src/components
mkdir -p packages/ui/src/theme

mkdir -p packages/types
mkdir -p packages/utils/src
mkdir -p packages/eslint-config-custom
mkdir -p packages/tsconfig

# docker/
mkdir -p docker

# docs/
mkdir -p docs

echo "Creating all project files..."

# .github
touch .github/workflows/deploy.yml

# apps/web
touch apps/web/vite.config.js
touch apps/web/package.json

# apps/platform
touch apps/platform/src/services/api/client.ts
touch apps/platform/src/services/api/endpoints.ts
touch apps/platform/src/services/api/interceptors.ts
touch apps/platform/src/services/ws/manager.ts
touch apps/platform/src/services/ws/events.ts
touch apps/platform/src/styles/global.ts
touch apps/platform/src/styles/theme.ts
touch apps/platform/src/index.tsx
touch apps/platform/src/main.tsx
touch apps/platform/vite.config.ts
touch apps/platform/package.json

# apps/admin
touch apps/admin/vite.config.ts
touch apps/admin/package.json

# packages/backend
touch packages/backend/src/config/env.ts
touch packages/backend/src/config/logger.ts
touch packages/backend/src/database/index.ts
touch packages/backend/src/market-data/fetcher.ts
touch packages/backend/src/market-data/scheduler.ts
touch packages/backend/src/market-data/cache.ts
touch packages/backend/src/realtime/gateway.ts
touch packages/backend/src/realtime/priceBroadcaster.ts
touch packages/backend/src/realtime/userNotifier.ts
touch packages/backend/src/index.ts
touch packages/backend/src/server.ts
touch packages/backend/Dockerfile
touch packages/backend/package.json

# packages/worker
touch packages/worker/src/jobs/market-data-job.ts
touch packages/worker/src/jobs/pnl-calculation-job.ts
touch packages/worker/src/queue.ts
touch packages/worker/Dockerfile
touch packages/worker/package.json

# packages/database
touch packages/database/schema.ts

# packages/ui
touch packages/ui/src/components/Button.tsx
touch packages/ui/src/components/Card.tsx
touch packages/ui/src/components/Input.tsx
touch packages/ui/src/components/index.ts
touch packages/ui/package.json

# packages/types
touch packages/types/trading.ts
touch packages/types/market.ts
touch packages/types/user.ts

# packages/utils
touch packages/utils/package.json

# docker
touch docker/nginx.conf
touch docker/redis.conf

# docs
touch docs/architecture.md
touch docs/architecture-graph.md

# Root files
touch docker-compose.yml
touch pnpm-workspace.yaml
touch package.json
touch .gitignore

echo ""
echo "✅ Project structure for 'bhcmarkets' created successfully!"
echo "   You are now inside the 'bhcmarkets' directory."