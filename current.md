.
├── apps
│  ├── admin
│  │  ├── package.json
│  │  ├── public
│  │  ├── src
│  │  │  ├── app
│  │  │  ├── features
│  │  │  │  ├── analytics
│  │  │  │  ├── risk
│  │  │  │  ├── trades
│  │  │  │  └── users
│  │  │  ├── shared
│  │  │  └── styles
│  │  └── vite.config.ts
│  ├── docs
│  │  ├── app
│  │  │  ├── favicon.ico
│  │  │  ├── fonts
│  │  │  │  ├── GeistMonoVF.woff
│  │  │  │  └── GeistVF.woff
│  │  │  ├── globals.css
│  │  │  ├── layout.tsx
│  │  │  ├── page.module.css
│  │  │  └── page.tsx
│  │  ├── eslint.config.js
│  │  ├── next-env.d.ts
│  │  ├── next.config.js
│  │  ├── package.json
│  │  ├── public
│  │  │  ├── file-text.svg
│  │  │  ├── globe.svg
│  │  │  ├── next.svg
│  │  │  ├── turborepo-dark.svg
│  │  │  ├── turborepo-light.svg
│  │  │  ├── vercel.svg
│  │  │  └── window.svg
│  │  ├── README.md
│  │  └── tsconfig.json
│  ├── mobile
│  │  ├── images
│  │  │  └── example.png
│  │  ├── package.json
│  │  ├── public
│  │  │  └── index.html
│  │  ├── README.md
│  │  └── src
│  │     ├── App.js
│  │     └── index.js
│  ├── platform
│  │  ├── package.json
│  │  ├── public
│  │  ├── src
│  │  │  ├── app
│  │  │  ├── features
│  │  │  │  ├── auth
│  │  │  │  ├── market-data
│  │  │  │  ├── orders
│  │  │  │  ├── portfolio
│  │  │  │  └── trading
│  │  │  ├── index.tsx
│  │  │  ├── main.tsx
│  │  │  ├── services
│  │  │  │  ├── api
│  │  │  │  │  ├── client.ts
│  │  │  │  │  ├── endpoints.ts
│  │  │  │  │  └── interceptors.ts
│  │  │  │  └── ws
│  │  │  │     ├── events.ts
│  │  │  │     └── manager.ts
│  │  │  ├── shared
│  │  │  │  ├── components
│  │  │  │  │  ├── charts
│  │  │  │  │  ├── layout
│  │  │  │  │  └── ui
│  │  │  │  ├── constants
│  │  │  │  ├── hooks
│  │  │  │  ├── types
│  │  │  │  └── utils
│  │  │  ├── store
│  │  │  └── styles
│  │  │     ├── global.ts
│  │  │     └── theme.ts
│  │  └── vite.config.ts
│  └── web
│     ├── eslint.config.js
│     ├── index.html
│     ├── package.json
│     ├── public
│     │  └── vite.svg
│     ├── README.md
│     ├── src
│     │  ├── App.tsx
│     │  ├── assets
│     │  │  └── react.svg
│     │  ├── index.css
│     │  ├── main.tsx
│     │  └── vite-env.d.ts
│     ├── tsconfig.app.json
│     ├── tsconfig.json
│     ├── tsconfig.node.json
│     └── vite.config.ts
├── bun.lock
├── current.md
├── docker
│  ├── nginx.conf
│  └── redis.conf
├── docker-compose.yml
├── docs
│  ├── architecture-graph.md
│  └── architecture.md
├── package.json
├── packages
│  ├── backend
│  │  ├── Dockerfile
│  │  ├── package.json
│  │  └── src
│  │     ├── api
│  │     │  ├── controllers
│  │     │  ├── routes
│  │     │  └── validators
│  │     ├── config
│  │     │  ├── env.ts
│  │     │  └── logger.ts
│  │     ├── database
│  │     │  ├── index.ts
│  │     │  ├── migrations
│  │     │  └── prisma
│  │     ├── domains
│  │     │  ├── account
│  │     │  ├── order
│  │     │  ├── trade
│  │     │  └── user
│  │     ├── index.ts
│  │     ├── market-data
│  │     │  ├── adapters
│  │     │  ├── cache.ts
│  │     │  ├── fetcher.ts
│  │     │  └── scheduler.ts
│  │     ├── realtime
│  │     │  ├── gateway.ts
│  │     │  ├── priceBroadcaster.ts
│  │     │  └── userNotifier.ts
│  │     ├── server.ts
│  │     └── utils
│  ├── database
│  │  ├── migrations
│  │  ├── schema.ts
│  │  └── seed
│  ├── eslint-config
│  │  ├── base.js
│  │  ├── next.js
│  │  ├── package.json
│  │  ├── react-internal.js
│  │  └── README.md
│  ├── eslint-config-custom
│  ├── tsconfig
│  ├── types
│  │  ├── market.ts
│  │  ├── trading.ts
│  │  └── user.ts
│  ├── typescript-config
│  │  ├── base.json
│  │  ├── nextjs.json
│  │  ├── package.json
│  │  └── react-library.json
│  ├── ui
│  │  ├── eslint.config.mjs
│  │  ├── package.json
│  │  ├── src
│  │  │  ├── components
│  │  │  │  ├── Button.tsx
│  │  │  │  ├── Card.tsx
│  │  │  │  ├── index.ts
│  │  │  │  └── Input.tsx
│  │  │  └── theme
│  │  └── tsconfig.json
│  ├── utils
│  │  ├── package.json
│  │  └── src
│  └── worker
│     ├── Dockerfile
│     ├── package.json
│     └── src
│        ├── jobs
│        │  ├── market-data-job.ts
│        │  └── pnl-calculation-job.ts
│        └── queue.ts
├── pnpm-workspace.yaml
├── README.md
└── turbo.json
