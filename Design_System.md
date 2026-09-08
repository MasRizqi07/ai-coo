# Design System Specification Document
## AI COO — UI Design Tokens, Component Standards & Motion Guidelines

---

## 1. Prinsip Dasar Design System

Design System **AI COO** dirancang untuk memberikan pengalaman visual kelas dunia yang konsisten, berkecepatan tinggi, dan dapat diperluas. Prinsip dasarnya mencakup:

1. **Dark-Mode First**: Latar belakang gelap pekat (`slate-950`) dirancang untuk meminimalkan beban retina kasir dan pemilik usaha yang beroperasi dari pagi hingga larut malam.
2. **Harmonious Accentuation**: Warna aksen hangat (*Amber-500* dan *Orange-500*) merepresentasikan energi dan pertumbuhan wirausaha lokal, digunakan secara terukur untuk elemen interaktif dan Call-To-Action (CTA).
3. **Glassmorphism & Depth Hierarchy**: Memanfaatkan *backdrop blur* dan garis batas semi-transparan untuk menciptakan kedalaman visual berlayer tanpa membuat antarmuka terasa berat.
4. **Instant Visual Feedback**: Setiap input, klik, dan hover memiliki transisi mikro (*micro-interaction*) yang responsif, memberikan kepastian operasional instan kepada pengguna.

---

## 2. Token Warna (*Color Tokens & Palette*)

Sistem warna dibangun di atas palet **Tailwind CSS v4** dengan modifikasi semantik:

### 2.1 Latar Belakang & Permukaan (*Surfaces*)
| Token Nama | Nilai CSS / HEX | Penggunaan Utama |
| :--- | :--- | :--- |
| `surface-base` | `#020617` (`slate-950`) | Latar belakang kanvas aplikasi paling dasar. |
| `surface-subtle` | `#0f172a` (`slate-900`) | Kontainer kartu metrik, sidebar, dan header panel. |
| `surface-card` | `rgba(15, 23, 42, 0.4)` | Kartu dengan latar semi-transparan (`bg-slate-900/40`). |
| `surface-elevated` | `rgba(15, 23, 42, 0.8)` | Modal dialog, dropdown menu, dan popover terapung. |
| `surface-glass` | `rgba(2, 6, 23, 0.6)` | Header & sidebar navigasi dengan filter `backdrop-blur-xl`. |

### 2.2 Garis Batas (*Borders*)
| Token Nama | Nilai CSS / Class | Karakteristik Visual |
| :--- | :--- | :--- |
| `border-subtle` | `border-slate-800` | Garis pemisah tabel, kartu data, dan input form. |
| `border-interactive` | `border-slate-700` | State hover pada tombol sekunder dan baris list. |
| `border-accent` | `border-amber-500/50` | State aktif, fokus input, dan kartu rekomendasi AI. |

### 2.3 Warna Fungsional & Semantik (*Semantic Accents*)
| Kategori | Token Warna Utama | Background Pill / Glow | Indikasi Penggunaan |
| :--- | :--- | :--- | :--- |
| **Primary (Brand)** | `amber-500` (`#f59e0b`) | `bg-amber-500/10` | Tombol checkout, sorotan tren, CTA utama, dan logo AI. |
| **Success / Positif** | `emerald-400` (`#34d399`) | `bg-emerald-500/10` | Transaksi berhasil, omset naik, stok aman, kembalian tunai. |
| **Danger / Kritis** | `red-400` (`#f87171`) | `bg-red-500/10` | Stok kritis (≤5), tombol hapus data, peringatan risiko bisnis. |
| **Warning / Perhatian** | `orange-400` (`#fb923c`) | `bg-orange-500/10` | Stok mulai menipis, peringatan jatuh tempo kasbon. |
| **Info / Operasional** | `blue-400` (`#60a5fa`) | `bg-blue-500/10` | Pelanggan terdaftar, badge tier Loyal, info sistem. |
| **VIP / Prestise** | `purple-400` (`#c084fc`) | `bg-purple-500/10` | Pelanggan VIP (Total spending ≥ Rp 500.000). |

---

## 3. Tipografi (*Typography Scale*)

Menggunakan font sistem sans-serif modern dengan rendering antialiased tinggi (`antialiased`).

| Style Token | Font Size | Line Height | Font Weight | Contoh Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `2.25rem` (36px) | `2.5rem` (40px) | Black (900) | Judul Hero Landing Page, Total Omset Dasbor. |
| **Heading 1** | `1.875rem` (30px) | `2.25rem` (36px) | Bold (700) | Judul Halaman Utama (Kasir, Katalog, CRM). |
| **Heading 2** | `1.5rem` (24px) | `2rem` (32px) | Bold (700) | Judul Section Card, Header Modal Dialog. |
| **Heading 3** | `1.125rem` (18px) | `1.75rem` (28px) | Semibold (600) | Sub-section AI Brief, Judul Keranjang Belanja. |
| **Body Large** | `1rem` (16px) | `1.5rem` (24px) | Regular (400) | Teks pengantar, deskripsi produk, paragraf. |
| **Body Default** | `0.875rem` (14px) | `1.25rem` (20px) | Regular / Medium | Teks form input, isi tabel, deskripsi metrik. |
| **Caption / Small** | `0.75rem` (12px) | `1rem` (16px) | Medium (500) | Badge status, timestamp struk, label filter tab. |
| **Micro Badge** | `0.625rem` (10px) | `0.875rem` (14px) | Bold (700) | Tag kategori huruf kapital (`tracking-wider uppercase`). |

---

## 4. Spacing, Border Radius & Elevation

### 4.1 Skala Spacing (Kelipatan 4px)
- `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px).
- Padding standar kartu: `p-4` (16px) untuk mobile, `p-6` (24px) untuk desktop.

### 4.2 Sudut Lengkung (*Border Radius*)
- `rounded-lg` (8px): Tombol filter, input form field.
- `rounded-xl` (12px): Tombol utama (CTA), kartu produk dalam grid POS.
- `rounded-2xl` (16px): Kontainer kartu metrik, modal dialog, panel checkout.
- `rounded-full` (9999px): Pill badge status, avatar profil pengguna.

### 4.3 Ambient Glow & Efek Pencahayaan
```css
/* Ambient glow untuk kartu unggulan */
.ambient-glow-amber {
  background: radial-gradient(
    ellipse at top,
    rgba(245, 158, 11, 0.15),
    rgba(249, 115, 22, 0.05) 50%,
    transparent 80%
  );
}
```

---

## 5. Spesifikasi Komponen Inti (*Core Component Specs*)

### 5.1 Tombol (*Button Component*)
Komponen tombol terstandarisasi di [`Button.tsx`](file:///d:/MY%20CODE/ANTIGRAVITY/01-production/ai-coo/apps/web/src/components/ui/Button.tsx):

- **Varian Primary**:
  - Tampilan: `bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 active:scale-98 shadow-md transition-all`.
  - Penggunaan: Aksi konfirmasi utama (e.g. *Bayar Sekarang*, *Tambah Produk*, *Simpan Profil*).
- **Varian Secondary**:
  - Tampilan: `bg-slate-800 text-slate-100 font-semibold hover:bg-slate-700 border border-slate-700`.
  - Penggunaan: Aksi sekunder, tombol batal, atau toggle opsi.
- **Varian Danger**:
  - Tampilan: `bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20`.
  - Penggunaan: Penghapusan produk, hapus pelanggan, reset keranjang.
- **State Loading**:
  - Menggantikan teks tombol dengan icon spinner berputar (`animate-spin`) dan mengaktifkan atribut `disabled`.

### 5.2 Input Teks & Form Field (*Input & Label*)
Komponen input terstandarisasi di [`Input.tsx`](file:///d:/MY%20CODE/ANTIGRAVITY/01-production/ai-coo/apps/web/src/components/ui/Input.tsx) dan [`Label.tsx`](file:///d:/MY%20CODE/ANTIGRAVITY/01-production/ai-coo/apps/web/src/components/ui/Label.tsx):

```tsx
// Definisi Tipe Standar
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// Base Styling
className = cn(
  'flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100',
  'placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
  'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
);
```

### 5.3 Kartu & Kontainer (*Card Component*)
Komponen kartu terstandarisasi di [`Card.tsx`](file:///d:/MY%20CODE/ANTIGRAVITY/01-production/ai-coo/apps/web/src/components/ui/Card.tsx):
- `Card`: Kontainer dasar dengan `rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm overflow-hidden`.
- `CardHeader`: Padding atas terstruktur (`p-6 pb-2 flex items-center justify-between`).
- `CardTitle`: Tipografi judul tebal berskala `text-lg font-bold text-white`.
- `CardContent`: Padding isi data dinamis (`p-6 pt-2`).

### 5.4 Badges Status Inventaris & CRM
- **Badge Status Stok**:
  - *Aman*: `px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400`.
  - *Menipis*: `px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400`.
  - *Kritis*: `px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse`.
- **Badge Pelanggan VIP**:
  - `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400`.
  - Disertai icon mahkota emas (`Crown`).

### 5.5 Struk Digital Kasir (*Thermal Receipt Simulator*)
- Memiliki latar `bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl`.
- Garis pemisah putus-putus (`border-dashed border-slate-800`).
- Tipografi monospaced / tabular numerals pada baris harga barang untuk keterbacaan tinggi.

---

## 6. Motion & Micro-Animations (Framer Motion)

### 6.1 Transisi Halaman (Page Entrance)
```typescript
export const pageMotionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### 6.2 Modal Overlay Entrance
```typescript
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalDialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};
```

---

## 7. Standar Format & Lokalisasi Indonesia

Seluruh komponen wajib menggunakan fungsi format seragam:

### 7.1 Format Mata Uang Rupiah (IDR)
```typescript
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);
};
```

### 7.2 Format Tanggal & Waktu Lokal
```typescript
export const formatDateIndonesian = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(d);
};
```
