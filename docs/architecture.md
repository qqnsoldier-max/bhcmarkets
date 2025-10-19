# BHC Markets

## Project Structure

### This is a detailed overview of the project structure. It uses the monorepo approach to manage multiple packages and applications.


``` bash
bhcmarkets/
├── .github/                                # GitHub workflows for CI/CD automation
│   └── workflows/
│       └── deploy.yml                      # Deployment pipeline (build, test, deploy)
│
├── apps/                                   # All deployable applications (SPAs / web frontends)
│   ├── web/                            # Public marketing site for new users
│   │   ├── components/                     # Reusable UI components (Hero, Footer, etc.)
│   │   ├── pages/                          # Next.js page routes (Home, About, Pricing)
│   │   ├── public/                         # Static assets (images, icons, favicons)
│   │   ├── styles/                         # CSS or SCSS for marketing visuals
│   │   ├── vite.config.js                  # Next.js configuration
│   │   └── package.json                    # Local dependencies and build scripts
│   │
│   ├── platform/                           # Main trading platform SPA (React + Vite)
│   │   ├── public/                         # Public assets like logos, manifest.json, etc.
│   │   ├── src/
│   │   │   ├── app/                        # Root layout, routing, and providers
│   │   │   ├── features/                   # Feature-sliced domain modules
│   │   │   │   ├── auth/                   # Authentication logic (login, register)
│   │   │   │   ├── market-data/            # Market feed display & subscription logic
│   │   │   │   ├── orders/                 # Order creation, management & history
│   │   │   │   ├── portfolio/              # Portfolio view & PnL display
│   │   │   │   └── trading/                # Order ticket, charts, and execution flow
│   │   │   ├── shared/                     # Cross-feature reusable modules
│   │   │   │   ├── components/             # Shared UI primitives
│   │   │   │   │   ├── charts/             # Chart visualizations (lightweight-charts, etc.)
│   │   │   │   │   ├── layout/             # Header, Sidebar, Dashboard layout
│   │   │   │   │   └── ui/                 # Buttons, Modals, Inputs, etc.
│   │   │   │   ├── constants/              # App-wide constants and config values
│   │   │   │   ├── hooks/                  # Shared React hooks (useTheme, useModal, etc.)
│   │   │   │   ├── utils/                  # Helper functions (formatting, math, etc.)
│   │   │   │   └── types/                  # Shared TypeScript types used in frontend
│   │   │   ├── services/                   # Networking and API layers
│   │   │   │   ├── api/                    # HTTP API client (REST or GraphQL)
│   │   │   │   │   ├── client.ts           # Axios or Fetch client instance
│   │   │   │   │   ├── endpoints.ts        # Centralized API route definitions
│   │   │   │   │   └── interceptors.ts     # Request/response interceptors
│   │   │   │   └── ws/                     # WebSocket management
│   │   │   │       ├── manager.ts          # Connection & subscription manager
│   │   │   │       └── events.ts           # Event types and handling
│   │   │   ├── store/                      # Zustand or Redux stores
│   │   │   ├── styles/                     # Theming and global styles
│   │   │   │   ├── global.ts               # Global app styles
│   │   │   │   └── theme.ts                # Theme tokens (colors, spacing, typography)
│   │   │   ├── index.tsx                   # Entry point for React app
│   │   │   └── main.tsx                    # Vite bootstrap script
│   │   ├── vite.config.ts                  # Vite build configuration
│   │   └── package.json                    # Local dependencies
│   │
│   └── admin/                              # Admin dashboard SPA (React + Vite)
│       ├── public/                         # Public assets for the admin app
│       ├── src/
│       │   ├── app/                        # Routing, global layout, and context providers
│       │   ├── features/                   # Core admin features
│       │   │   ├── users/                  # User management, permissions
│       │   │   ├── trades/                 # Monitor user trades and PnL
│       │   │   ├── risk/                   # System-level risk controls
│       │   │   └── analytics/              # KPIs and performance dashboards
│       │   ├── shared/                     # Shared UI and utilities (reuse from @bhview/ui)
│       │   └── styles/                     # Styling for admin layout
│       ├── vite.config.ts                  # Build config for admin SPA
│       └── package.json                    # Local dependencies
│
├── packages/                               # Shared code and backend services
│   ├── backend/                            # Main API & real-time backend service
│   │   ├── src/
│   │   │   ├── api/                        # HTTP routing and controller logic
│   │   │   │   ├── controllers/            # Express/Fastify handlers
│   │   │   │   ├── routes/                 # Route definitions
│   │   │   │   └── validators/             # Zod/Joi validation schemas
│   │   │   ├── config/                     # Environment & logging configuration
│   │   │   │   ├── env.ts                  # Env loader and schema validation
│   │   │   │   └── logger.ts               # Centralized logging (Winston/Pino)
│   │   │   ├── database/                   # Database setup and connection
│   │   │   │   ├── prisma/                 # Prisma client & schema
│   │   │   │   ├── migrations/             # SQL migrations
│   │   │   │   └── index.ts                # Connection bootstrap
│   │   │   ├── domains/                    # Business logic modules (DDD-style)
│   │   │   │   ├── account/                # Balance, deposits, withdrawals
│   │   │   │   ├── order/                  # Order creation & matching logic
│   │   │   │   ├── trade/                  # Trade settlement and PnL calc
│   │   │   │   └── user/                   # User entities and profiles
│   │   │   ├── market-data/                # Market data ingestion layer
│   │   │   │   ├── adapters/               # Provider integrations (Yahoo, Finnhub, etc.)
│   │   │   │   ├── fetcher.ts              # Fetch market data from APIs
│   │   │   │   ├── scheduler.ts            # Periodic data refresh logic
│   │   │   │   └── cache.ts                # Redis cache interface for ticks
│   │   │   ├── realtime/                   # Real-time WebSocket infrastructure
│   │   │   │   ├── gateway.ts              # WebSocket server entry
│   │   │   │   ├── priceBroadcaster.ts     # Publishes market price updates
│   │   │   │   └── userNotifier.ts         # Sends user-specific updates
│   │   │   ├── utils/                      # Backend-only utilities
│   │   │   ├── index.ts                    # Export entry for the backend package
│   │   │   └── server.ts                   # App bootstrap
│   │   ├── Dockerfile                      # Container definition for API
│   │   └── package.json                    # Backend dependencies
│   │
│   ├── worker/                             # Background job processor service
│   │   ├── src/
│   │   │   ├── jobs/                       # Job definitions (PnL, cleanup, etc.)
│   │   │   │   ├── market-data-job.ts      # Fetch & store data periodically
│   │   │   │   └── pnl-calculation-job.ts  # Recalculate user PnL asynchronously
│   │   │   └── queue.ts                    # Job queue setup (BullMQ)
│   │   ├── Dockerfile                      # Container for worker service
│   │   └── package.json                    # Dependencies for worker
│   │
│   ├── database/                           # Schema & migrations
│   │   ├── migrations/                     # Versioned DB migrations
│   │   ├── seed/                           # Sample data for local testing
│   │   └── schema.ts                       # DB schema definitions (Prisma or SQL)
│   │
│   ├── ui/                                 # Shared UI component library
│   │   ├── src/
│   │   │   ├── components/                 # Design system primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── index.ts
│   │   │   └── theme/                      # Shared theme configuration
│   │   └── package.json
│   │
│   ├── types/                              # Shared TypeScript types
│   │   ├── trading.ts                      # Trade & order interfaces
│   │   ├── market.ts                       # Market data interfaces
│   │   └── user.ts                         # User profile and auth types
│   │
│   ├── utils/                              # Generic helper functions
│   │   ├── src/                            # Utility modules (date, math, validation)
│   │   └── package.json
│   │
│   ├── eslint-config-custom/               # Central ESLint rules
│   └── tsconfig/                           # Shared TypeScript configs (base, frontend, backend)
│
├── docker/                                 # Docker-related config files
│   ├── nginx.conf                          # Nginx reverse proxy configuration
│   └── redis.conf                          # Redis tuning options
│
├── docs/                                   # Project documentation
│   ├── architecture.md                     # This annotated structure & rationale
│   └── architecture-graph.md               # Visual diagram of system data flow
│
├── docker-compose.yml                      # Orchestrates Postgres, Redis, backend, frontend
├── pnpm-workspace.yaml                     # Defines all workspaces for pnpm
├── package.json                            # Root package with shared scripts
└── .gitignore                              # Ignore rules for Git
```
