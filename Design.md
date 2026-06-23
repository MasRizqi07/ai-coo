# Design System & Architecture Document

This document outlines the UI/UX design choices, database schema, and high-level architectural patterns for the **AI COO** application. Use this document as an audit and review guide for future upgrades.

---

## 1. UI/UX Design System

The frontend of AI COO is built to feel **premium, dynamic, and native**. We avoid generic templates and focus on modern aesthetics.

### 1.1 Color Palette (Tailwind CSS v4)

Defined in `apps/web/src/app/globals.css`:

- **Backgrounds**: Slate palette. Deep dark backgrounds (`slate-950`, `slate-900`) to create a focused, low-strain environment.
- **Accents**: Amber/Orange palette (`amber-500`, `amber-600`). Used sparingly for CTAs, active states, and notifications to create a warm, energetic vibe.
- **Text**: `slate-100` for primary text, `slate-400` for secondary text.

### 1.2 Typography & Glassmorphism

- **Fonts**: System sans-serif with strong antialiasing (`antialiased`).
- **Effects**: We utilize "glassmorphism" using tailwind's `bg-slate-950/50 backdrop-blur-xl` on persistent UI elements like headers and navigation sidebars to create depth.

### 1.3 Micro-Animations

We use **Framer Motion** to breathe life into the UI:

- Page transitions are typically `initial={{ opacity: 0, y: 20 }}` animating to `y: 0`.
- Hover effects on cards and buttons scale up slightly and brighten borders (`hover:border-amber-500 transition-colors`).

---

## 2. Monorepo Architecture

The project utilizes `pnpm workspaces` and `Turborepo` to aggressively cache builds and enforce strict separation of concerns.

- **Single Source of Truth**: The `database` package holds the Prisma schema. Both the API and Web apps import from this database package.
- **Validation**: Zod schemas are defined in the `validation` package. They are imported by the NestJS API (using a custom `ZodValidationPipe`) and by Next.js Server Actions (for parsing `FormData`).

---

## 3. Backend Strategy (NestJS)

We employ **Clean Architecture** patterns to keep the business logic isolated from the framework and database.

1. **Controllers**: Handle HTTP routing and authentication. They delegate work immediately.
2. **Use Cases (Interactors)**: Contain pure business logic (e.g., `CreateProductUseCase`, `RestockProductUseCase`). They do not know about HTTP requests or direct database calls.
3. **Multi-tenancy**: Mandatory `companyId` is extracted from the JWT token via `TenantInterceptor` and passed down. All database queries must include `companyId` to ensure strict tenant isolation.

---

## 4. Frontend Strategy (Next.js 15)

The frontend leans heavily into Next.js App Router features:

1. **Server Components**: Used wherever possible to fetch data directly from the NestJS API securely without exposing tokens to the browser.
2. **Server Actions**: All form submissions (e.g., creating a product, executing a sale) are routed through Server Actions in `apps/web/src/actions/`. These actions make HTTP `POST/PATCH` calls to the NestJS API.
3. **Client Views**: Complex interactive components (like point-of-sale carts) are wrapped in `'use client'` files (e.g., `client-view.tsx`) and take initial data as props.

---

## 5. Database Schema Analysis

Managed by PostgreSQL + Prisma.

### Key Models

- **Company**: The root tenant. All operational data belongs to a Company.
- **User**: The business owners and staff, linked to a Company.
- **Customer & Product**: Core business entities.
- **Sale & SaleItem**: Transaction records. `SaleItem` maps a transaction line to a `Product`.
- **Insight**: AI-generated reports payload (`content: Json`), logged historically.

### Audit & Review Points for Upgrades

1. **Soft Deletes**: Currently, products and customers utilize `onDelete: SetNull` or `Cascade`. For accounting integrity, future upgrades should implement true soft deletes (`deletedAt: DateTime?`).
2. **Transactions**: The backend uses Prisma `$transaction` to atomically deduct `stockQuantity` from Products when a `Sale` is created.
3. **AI Pipeline**: The `Insight` table is prepared for Phase 8. A background worker (BullMQ) will aggregate `Sale` data daily and ping the OpenAI API, storing the result in the `Insight` table for the frontend to render.
