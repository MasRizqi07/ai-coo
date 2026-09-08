# AI COO — Asisten Chief Operating Officer Berbasis AI untuk UMKM Indonesia

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-ea2845.svg)](https://nestjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.2-2d3748.svg)](https://www.prisma.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-5.79-orange.svg)](https://bullmq.io/)
[![License](https://img.shields.io/badge/License-Proprietary-amber.svg)](#)

> **AI COO** adalah platform operasional cerdas yang menggabungkan kemudahan aplikasi Kasir (Point of Sale), manajemen inventaris real-time, pencatatan pelanggan (CRM), dan **Otak Analisis Operasional bertenaga AI**. Dirancang khusus untuk mentransformasi Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia dengan arahan bisnis harian yang taktis, terverifikasi, dan langsung dapat dieksekusi dalam Bahasa Indonesia.

---

## 📑 Daftar Dokumen Arsitektur & Spesifikasi

Untuk tinjauan mendalam mengenai setiap aspek platform, silakan merujuk ke dokumen teknis berikut:

| Dokumen | Tautan | Deskripsi |
| :--- | :--- | :--- |
| **Product Requirements Document** | [PRD.md](file:///d:/MY%20CODE/ANTIGRAVITY/01-production/ai-coo/PRD.md) | Kebutuhan produk lengkap, persona pengguna, metrik keberhasilan (OKRs), dan roadmap. |
| **System Architecture** | [Architectur.md](file:///d:/MY%20CODE/ANTIGRAVITY/01-production/ai-coo/Architectur.md) | Arsitektur Clean Architecture, isolasi multi-tenant, BullMQ worker, ERD, dan topologi produksi. |
| **UI/UX & Product Design** | [Design.md](file:///d:/MY%20CODE/ANTIGRAVITY/01-production/ai-coo/Design.md) | Spesifikasi layar lengkap, alur pengguna (*User Journeys*), POS checkout, dan struk digital. |
| **Design System & Tokens** | [Design_System.md](file:///d:/MY%20CODE/ANTIGRAVITY/01-production/ai-coo/Design_System.md) | Palet warna Tailwind v4, tipografi, komponen UI, token gerak (*Framer Motion*), dan lokalisasi IDR. |

---

## 🚀 Fitur Unggulan

### 1. Kasir Cepat & Penjualan (POS)
- **High-Velocity Checkout**: Pencarian instan, pintasan keyboard, dan kalkulasi total instan (< 5 detik per transaksi).
- **Metode Pembayaran Lengkap**: Tunai (`CASH`), `QRIS`, Transfer Bank (`TRANSFER`), dan Kasbon (`KASBON`).
- **Kalkulator Uang Kembalian**: Tombol pecahan Rupiah cepat (*Uang Pas*, *50k*, *100k*, *200k*) dengan kalkulasi kembalian otomatis.
- **Struk Digital & WhatsApp Share**: Menampilkan invoice format thermal digital dengan tombol kirim langsung ke nomor WhatsApp pelanggan.

### 2. Manajemen Stok & Inventaris Real-Time
- **Pengurangan Stok Otomatis**: Pengurangan stok atomik (*Prisma Transaction*) saat transaksi POS berhasil.
- **Indikator Stok 3-Tingkat**: **Aman**, **Menipis** ($\le$ ambang batas), dan **Kritis** ($\le 5$ unit berkedip merah).
- **Restock Cepat 1-Klik**: Tambah kuantitas barang masuk tanpa perlu membuka formulir edit produk yang panjang.
- **Soft Deletes**: Produk yang dihapus tetap mempertahankan integritas riwayat penjualan lampau.

### 3. Database Pelanggan & CRM Cerdas
- **Pemberian Tier Otomatis**: Kategori **Pelanggan VIP** (Total belanja $\ge$ Rp 500.000) dan **Pelanggan Loyal** ($\ge$ Rp 200.000).
- **Pelacakan Frekuensi Belanja**: Merekam tanggal kunjungan terakhir (*Last Purchase Date*) untuk mendeteksi risiko kehilangan pelanggan (*Customer Churn*).
- **Format Telepon Indonesia**: Normalisasi nomor telepon otomatis (`0812...` ke `62812...`) untuk integrasi chat instan.

### 4. Otak Analisis Operasional (AI Chief Operating Officer)
- **Analisis Harian (Pukul 06:00 WIB)**: Background worker BullMQ secara otomatis menyusun analisis bisnis 24 jam terakhir bagi setiap tenant.
- **Bebas Halusinasi Data**: Model AI (OpenAI GPT-4o-mini) hanya memproses metrik bisnis terverifikasi dari database lokal menggunakan format `json_schema` terstruktur.
- **Rencana Tindakan Taktis (*Action Items*)**: Rekomendasi aksi operasional langsung (e.g. *"Restock Kopi Susu Sekarang"*, *"Hubungi Pelanggan VIP"*).
- **Multi-Tier Resiliency**: Jika koneksi OpenAI atau Redis mengalami timeout, sistem otomatis menggunakan cache lokal atau fallback pintar tanpa error 500.

---

## 🛠️ Tech Stack & Teknologi

| Lapisan / Domain | Teknologi Utama | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 15 (App Router), React 19, TypeScript | Server Components, Server Actions, Client Views |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion, Lucide React | Glassmorphism, Dark-mode first, Micro-animations |
| **Backend API** | NestJS 11, TypeScript, Express | Clean Architecture, Modular DDD, Zod Validation Pipe |
| **Database & ORM** | PostgreSQL 16, Prisma ORM 6.2 | Skema relasional, ACID Transactions, Soft Deletes |
| **Caching & Queues** | Redis 7, BullMQ 5.79 | Antrean background worker harian & cache insight |
| **AI Engine** | OpenAI API (`gpt-4o-mini`) | Structured JSON Output (`json_schema`), Prompt terisolasi |
| **Monorepo Engine**| pnpm Workspaces, Turborepo 2.9 | Build caching, task orchestration, parallel execution |

---

## 📂 Struktur Monorepo

```
ai-coo/
├── apps/
│   ├── api/                     # Backend API Gateway (NestJS 11)
│   │   ├── src/
│   │   │   ├── common/          # TenantContext, Guards, Interceptors, Pipes
│   │   │   ├── modules/         # Domain Modules (Auth, Products, Sales, Customers, AI, Companies)
│   │   │   └── main.ts          # API Bootstrap & Swagger (/api/docs)
│   │   └── test/                # E2E Isolation Tests (Supertest)
│   └── web/                     # Frontend Application (Next.js 15 App Router)
│       ├── src/
│       │   ├── app/             # Rute Halaman, Server Layouts, Server Actions
│       │   ├── components/      # UI Atoms & Molecules (Button, Input, Card, Sidebar)
│       │   └── lib/             # API Client Helper & Utilities
├── packages/
│   ├── database/                # Prisma ORM Schema, Client & Migrations
│   ├── shared-types/            # Canonical TypeScript Interfaces, DTOs & Enums
│   ├── validation/              # Shared Zod Validation Schemas
│   └── eslint-config/           # Unified ESLint Flat Config
├── turbo.json                   # Turborepo Task Pipeline
├── pnpm-workspace.yaml          # Workspace Root
└── docker-compose.yml           # PostgreSQL & Redis Stack
```

---

## ⚡ Panduan Instalasi & Menjalankan Lokal

### Prasyarat Sistem
- **Node.js**: `v20.x` atau lebih baru
- **pnpm**: `v9.x` atau lebih baru (`corepack enable pnpm`)
- **PostgreSQL**: Versi 15 atau 16
- **Redis**: Versi 6 atau 7 (untuk BullMQ & caching)

### Langkah 1: Kloning & Instal Dependensi
```bash
git clone <repository-url> ai-coo
cd ai-coo

# Instal seluruh dependensi monorepo
pnpm install
```

### Langkah 2: Konfigurasi Environment Variables
Salin file template `.env.example` menjadi `.env` pada root:
```bash
cp .env.example .env
```
Isi konfigurasi database, Redis, dan kunci API OpenAI Anda:
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_coo_db?schema=public"

# Redis Configuration (BullMQ & Cache)
REDIS_HOST="localhost"
REDIS_PORT=6379

# Authentication Secret
JWT_SECRET="super-secret-jwt-key-change-this-in-production"

# OpenAI API Key (Hanya digunakan di backend server)
OPENAI_API_KEY="sk-proj-your-openai-api-key"

# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Langkah 3: Inisialisasi Database (Prisma)
```bash
# Push skema prisma ke database PostgreSQL
pnpm --filter @ai-coo/database db:push

# Generate Prisma Client
pnpm --filter @ai-coo/database generate
```

### Langkah 4: Build Package Shared
```bash
pnpm --filter @ai-coo/shared-types build
pnpm --filter @ai-coo/validation build
```

### Langkah 5: Jalankan Server Development
```bash
pnpm dev
```
Setelah berjalan:
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Dokumentasi Swagger API**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 🧪 Perintah Pengujian & Kualitas Kode

```bash
# Menjalankan linting ketat di seluruh package
pnpm lint

# Menjalankan unit tests di seluruh package (Jest & Vitest)
pnpm test

# Menjalankan build produksi untuk seluruh package
pnpm build

# Menjalankan pengujian E2E backend API
pnpm --filter @ai-coo/api test:e2e
```

---

## 📡 Matriks Endpoint REST API Utama

Seluruh endpoint privat membutuhkan header: `Authorization: Bearer <JWT_TOKEN>`.

| Modul | Method | Endpoint | Auth | Deskripsi |
| :--- | :---: | :--- | :---: | :--- |
| **Health** | `GET` | `/health` | Publik | Status kesehatan API gateway |
| **Auth** | `POST` | `/auth/register` | Publik | Pendaftaran pemilik & perusahaan baru |
| **Auth** | `POST` | `/auth/login` | Publik | Login pengguna & penerbitan token JWT |
| **Auth** | `GET` | `/auth/me` | Privat | Profil pengguna aktif saat ini |
| **Companies** | `GET` | `/companies/profile` | Privat | Profil dan informasi bisnis tenant |
| **Companies** | `PATCH` | `/companies/profile` | Privat | Pembaruan profil bisnis |
| **Products** | `GET` | `/products` | Privat | Mengambil seluruh katalog produk aktif |
| **Products** | `POST` | `/products` | Privat | Menambah produk baru ke inventaris |
| **Products** | `POST` | `/products/:id/restock` | Privat | Menambah kuantitas stok produk |
| **Products** | `DELETE`| `/products/:id` | Privat | Soft delete produk dari katalog |
| **Sales** | `GET` | `/sales` | Privat | Riwayat seluruh transaksi penjualan |
| **Sales** | `POST` | `/sales` | Privat | Eksekusi transaksi POS kasir atomik |
| **Customers** | `GET` | `/customers` | Privat | Direktori CRM seluruh pelanggan |
| **Customers** | `POST` | `/customers` | Privat | Mendaftarkan pelanggan baru |
| **Customers** | `DELETE`| `/customers/:id` | Privat | Menghapus pelanggan dari CRM |
| **Dashboard** | `GET` | `/dashboard/stats` | Privat | Kartu metrik ringkasan (Omset, Stok, CRM) |
| **Dashboard** | `GET` | `/dashboard/charts` | Privat | Data deret waktu tren pendapatan 7 hari |
| **AI Insights** | `GET` | `/ai-insights/latest` | Privat | Mengambil analisis AI COO operasional terbaru |
| **AI Insights** | `POST`| `/ai-insights/generate` | Privat | Men-trigger kompilasi analisis AI instan |

---

## 🔒 Keamanan & Isolasi Multi-Tenant

1. **AsyncLocalStorage Context**: `TenantInterceptor` menyuntikkan `companyId` dari token JWT ke context thread lokal. Setiap query repositori Prisma otomatis membaca dari context ini, menjamin **nol risiko kebocoran data antartenant**.
2. **Strict Password Hashing**: Menggunakan Bcrypt dengan salt cost 10.
3. **Pencegahan XSS & CSRF**: Cookie session frontend disetel dengan bendera `httpOnly`, `sameSite: 'lax'`, dan `secure` pada mode produksi.
4. **Validasi Skema Zod**: Mencegah serangan injection dengan memvalidasi tipe dan panjang input secara ketat sebelum mencapai use-case layer.

---

## 📄 Lisensi
Hak Cipta © 2026 AI COO. Seluruh hak cipta dilindungi undang-undang.
