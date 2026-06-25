# AI COO — AI Chief Operating Officer for Indonesian UMKM

AI COO is a localized, AI-powered business operations assistant built specifically for Indonesian micro, small, and medium enterprises (UMKM). It analyzes daily business metrics and provides actionable, clear advice in Bahasa Indonesia — answering the age-old question: _"What should I do next to grow?"_

## Tech Stack

| Domain          | Technology                                                                    |
| --------------- | ----------------------------------------------------------------------------- |
| **Frontend**    | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| **Backend API** | NestJS 11, TypeScript, Clean Architecture (Use Cases, Repository Pattern)     |
| **Database**    | PostgreSQL 16 managed with Prisma ORM                                         |
| **Monorepo**    | pnpm workspaces + Turborepo                                                   |
| **Shared**      | Zod (Validation), TypeScript definitions (`@ai-coo/shared-types`)             |

## Quick Start Guide

### Prerequisites

- **Node.js**: v20 or higher
- **pnpm**: v9 or higher
- **PostgreSQL**: A running instance of PostgreSQL 16
- **Redis**: A running instance of Redis for BullMQ jobs

### Setup and Running Locally

```bash
# 1. Clone the repository
git clone <repo-url> ai-coo
cd ai-coo

# 2. Setup Environment Variables
cp .env.example .env
# Edit .env to add your configuration parameters:
# - OPENAI_API_KEY: Paste your real OpenAI API key (server-side only, do NOT prefix with NEXT_PUBLIC_).
# - REDIS_HOST & REDIS_PORT: Configure your Redis server connection details (defaults to localhost:6379).

# 3. Start Database & Redis Infrastructure
# Ensure your local or remote PostgreSQL server is running.
# Ensure your local Redis server is running (e.g. `redis-server` or via WSL/Windows service).

# 4. Install Dependencies
pnpm install

# 5. Initialize the Database
pnpm --filter @ai-coo/database db:push

# 6. Start the Development Server
pnpm dev
```

### URLs

- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

## Workspace Architecture

This project is structured as a powerful Monorepo to maintain strict boundaries while sharing core logic.

```
ai-coo/
├── apps/
│   ├── api/                 # NestJS 11 backend: The core business logic
│   └── web/                 # Next.js 15 frontend: The presentation layer
├── packages/
│   ├── database/            # Prisma schema, migrations, and generated client
│   ├── shared-types/        # Shared DTOs and Interfaces
│   ├── validation/          # Shared Zod validation schemas
│   └── eslint-config/       # Shared linting rules
└── turbo.json               # Monorepo build orchestrator
```

## Useful Commands

| Command                                   | Action                                            |
| ----------------------------------------- | ------------------------------------------------- |
| `pnpm dev`                                | Starts both the web and api servers in watch mode |
| `pnpm turbo build`                        | Type-checks and builds all workspace packages     |
| `pnpm turbo lint`                         | Lints the entire codebase                         |
| `pnpm test`                               | Runs unit tests across all workspace packages     |
| `pnpm test:e2e`                           | Runs E2E integration tests in `apps/api`          |
| `pnpm --filter @ai-coo/database generate` | Regenerates the Prisma Client                     |

## Redis & AI Operations

AI COO utilizes Redis for two primary tasks:

1. **BullMQ Background Scheduler**: Schedules the daily operations brief generation pipeline at `06:00 WIB` (Asia/Jakarta time) across all registered companies.
2. **Operations Insights Caching**: Caches the generated operation insights to guarantee fast, real-time responses. If Redis or OpenAI fails, the system automatically falls back to the last cached value or the latest historical database entry.

Ensure Redis is running natively on your system (e.g., using `redis-server` on Linux/macOS or WSL on Windows) before starting the application, as BullMQ will fail to connect otherwise.

## License

Proprietary software. All rights reserved.
