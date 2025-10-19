# System Architecture (Repo-Aligned, Domain-Abstracted)

This diagram reflects the actual packages and apps in this monorepo, keeping business logic abstract while showing your technical design: multi-client frontends, HTTP API, realtime gateway, market data ingestion, Redis cache + BullMQ, PostgreSQL, and a background worker.

```mermaid
flowchart TD

  %% ======================
  %% Clients (apps/*)
  %% ======================
  subgraph Clients
    C1["Platform Web (apps/platform)"]
    C2["Admin (apps/admin)"]
    C3["Mobile (apps/mobile)"]
  end

  %% ======================
  %% Edge (docker/nginx)
  %% ======================
  Edge["Nginx / Edge Router"]

  %% ======================
  %% Backend (packages/backend)
  %% ======================
  subgraph Backend
    API["HTTP API Layer (packages/backend/src/api)"]
    Domains["Domain Services (packages/backend/src/domains/*)"]
    DBAccess["Database Access (Prisma)"]
    RT["Realtime Gateway - WebSocket (packages/backend/src/realtime/gateway.ts)"]
    Notifier["User Notifier (packages/backend/src/realtime/userNotifier.ts)"]
    Broadcaster["Price Broadcaster (packages/backend/src/realtime/priceBroadcaster.ts)"]

    subgraph Market_Data
      Sched["Scheduler (market-data/scheduler.ts)"]
      Fetch["Fetcher (market-data/fetcher.ts)"]
      Adapt["Adapters (market-data/adapters/*)"]
      Cache["Local Cache (market-data/cache.ts)"]
    end
  end

  %% ======================
  %% Async / Workers (packages/worker)
  %% ======================
  subgraph Async_and_Workers
    Q["Redis Queue (BullMQ)"]
    W["Worker (packages/worker)"]
    J1["Market Data Job"]
    J2["Analytics/Calculation Job"]
  end

  %% ======================
  %% Data Stores
  %% ======================
  subgraph Data_Stores
    Redis[("Redis")]
    PG[("PostgreSQL")]
  end

  %% ======================
  %% External Providers
  %% ======================
  subgraph External_Providers
    P1["Provider A"]
    P2["Provider B"]
  end

  %% ======================
  %% Client <-> Edge <-> Backend
  %% ======================
  C1 -->|REST| Edge
  C2 -->|REST| Edge
  C3 -->|REST| Edge
  Edge --> API
  C1 <-->|WebSocket| RT
  C2 <-->|WebSocket| RT

  %% ======================
  %% Backend <-> Stores
  %% ======================
  API --> Domains
  Domains --> DBAccess
  DBAccess --> PG
  API <--> Redis

  %% ======================
  %% Realtime
  %% ======================
  Broadcaster -.-> RT
  Notifier -.-> RT

  %% ======================
  %% Jobs / Queue
  %% ======================
  API -->|enqueue| Q
  Q --> W
  W -->|persist results| PG
  W -->|publish events| Redis
  W --> J1
  W --> J2
  Redis -.-> Notifier

  %% ======================
  %% Market Data Flow
  %% ======================
  Sched --> Fetch
  Fetch --> Adapt
  Adapt -->|HTTP requests| P1
  Adapt -->|HTTP requests| P2
  Fetch -->|normalized data| Cache
  Cache --> Redis
  Redis -.-> Broadcaster
```

## Runtime Flows

### A) Realtime Market Data Pipeline
```mermaid
sequenceDiagram
  autonumber
  participant S as Scheduler (backend/market-data)
  participant F as Fetcher
  participant A as Adapter
  participant P as External Provider
  participant R as Redis
  participant B as Broadcaster
  participant G as Realtime Gateway (WS)
  participant C as Client

  S->>F: tick()
  F->>A: requestData()
  A->>P: HTTP request(s)
  P-->>A: raw data
  A-->>F: normalized data
  F->>R: set/publish latest snapshot
  R-->>B: pub/sub event
  B-->>G: push update
  G-->>C: WS: realtime data
```

### B) User Operation with Async Processing and Realtime Notify
```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant E as Edge (Nginx)
  participant A as API
  participant D as DB (PostgreSQL)
  participant Q as Queue (BullMQ on Redis)
  participant W as Worker
  participant R as Redis
  participant N as Notifier
  participant G as Realtime Gateway (WS)

  C->>E: POST /api/operation
  E->>A: forward
  A->>D: persist initial record
  A->>Q: enqueue job
  A-->>C: 202 Accepted

  Q-->>W: dispatch job
  W->>D: compute & persist results
  W->>R: publish event
  R-->>N: pub/sub event
  N-->>G: notify user(s)
  G-->>C: WS: operation result/update
```

## Optional, Resume-Safe Abstracted View
Use this version publicly if you want to fully hide domain modules (orders/trades/etc.) while keeping your technical strengths clear.

```mermaid
flowchart TD
  subgraph Clients
    W["Web App"]
    A["Admin App"]
    M["Mobile Client"]
  end

  Edge["API Gateway / Edge Router"]

  subgraph Services
    API["HTTP API"]
    RT["Realtime Gateway (WebSocket)"]
    Q["Async Queue (BullMQ)"]
    WK["Worker"]
    MD["Data Pipeline (Scheduler/Fetcher/Adapters)"]
  end

  subgraph Data_Stores
    Cache[("Redis: cache, pub-sub, queue")]
    SQL[("PostgreSQL")]
  end

  subgraph External_Providers
    X1["Provider A"]
    X2["Provider B"]
  end

  W -->|REST| Edge
  Edge --> API
  A -->|REST| Edge
  M -->|REST| Edge
  W <-->|WS| RT
  A <-->|WS| RT

  API --> SQL
  API <--> Cache
  API --> Q
  Q --> WK
  WK --> SQL
  WK --> Cache

  MD --> Cache
  MD --> X1
  MD --> X2
  Cache -.-> RT
```