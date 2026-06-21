# AI COO — AI Chief Operating Officer for Indonesian UMKM

AI COO is an AI-powered business operations assistant for Indonesian micro, small, and medium enterprises (UMKM). It tells business owners, in plain Bahasa Indonesia, what to do next and why — every day.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | NestJS 11, TypeScript, Clean Architecture |
| Database | PostgreSQL 16 (Prisma ORM) |
| Cache/Queue | Redis 7, BullMQ |
| AI | OpenAI (behind provider abstraction) |
| Monorepo | pnpm workspaces + Turborepo |

## Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9
- **Docker Desktop** (for PostgreSQL + Redis)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url> ai-coo
cd ai-coo

# 2. Copy environment variables
cp .env.example .env

# 3. Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# 4. Install dependencies
pnpm install

# 5. Run database migrations (after Phase 2)
# pnpm --filter api prisma migrate dev

# 6. Start development servers
pnpm dev
```

This starts:
- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:3001
- **Health Check** → http://localhost:3001/health

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting without writing |

## Project Structure

```
ai-coo/
├── apps/
│   ├── api/              # NestJS backend (Clean Architecture)
│   └── web/              # Next.js frontend (App Router)
├── packages/
│   ├── shared-types/     # Shared TypeScript enums & types
│   ├── validation/       # Shared Zod schemas
│   └── eslint-config/    # Shared ESLint configuration
├── docker-compose.yml    # PostgreSQL + Redis
├── turbo.json            # Build pipeline
└── pnpm-workspace.yaml   # Workspace definition
```

## Architecture

- **Backend**: Clean Architecture with DDD-lite bounded contexts. See [Build Spec](./BUILD_SPEC.md) §7.2.
- **Frontend**: Feature-based structure with Server Components and Server Actions.
- **Multi-tenancy**: Row-level isolation via mandatory `companyId` on all tenant-scoped tables, with PostgreSQL RLS as defense-in-depth.

## License

Proprietary. All rights reserved.
