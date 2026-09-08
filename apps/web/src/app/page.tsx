import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Brain,
  ShoppingBag,
  MessageCircle,
  PackageCheck,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Store,
  Layers,
  Star,
  Users,
  AlertTriangle,
  Receipt,
} from 'lucide-react';
import { getToken } from './actions/auth';
import { LandingNavbar } from '../components/landing-navbar';

export default async function HomePage() {
  const token = await getToken();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-175 h-125 bg-linear-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      {/* Sticky Header with Outline Secondary Action */}
      <LandingNavbar token={token} />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-16 text-center">
        {/* Badge Pill */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-300 shadow-inner backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse motion-reduce:animate-none" />
          <span>Asisten Operasional AI Cerdas Khusus UMKM Indonesia</span>
        </div>

        {/* Headline with text-wrap balance */}
        <h1
          className="mt-8 text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.15]"
          style={{ textWrap: 'balance' }}
        >
          Kelola Toko Lebih Rapi, <br className="hidden sm:inline" />
          <span className="bg-linear-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Lipatgandakan Omset dengan AI COO.
          </span>
        </h1>

        {/* Subtitle with High Contrast */}
        <p
          className="mx-auto mt-6 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal"
          style={{ textWrap: 'balance' }}
        >
          Ketahui apa yang harus dilakukan hari ini — produk apa yang harus di-restock, pelanggan mana yang harus disapa kembali di WhatsApp, dan strategi terbaik untuk menumbuhkan profit bisnis Anda.
        </p>

        {/* Single Primary High-Emphasis CTA + One Secondary CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 px-8 py-4 text-sm sm:text-base font-extrabold text-slate-950 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all active:scale-95 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Mulai Usaha Anda Sekarang
            <ArrowRight className="h-5 w-5 text-slate-950" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-sm sm:text-base font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Lihat Demo Kasir
          </Link>
        </div>

        {/* Trust Badges Row (All SVG Icons, Zero Emoji) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Isolasi Data Multi-Tenant RLS</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Kasir POS Cepat &lt; 5 Detik</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            <span>AI Bebas Halusinasi Data</span>
          </div>
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-blue-400" />
            <span>Siap untuk 64+ Juta UMKM</span>
          </div>
        </div>
      </section>

      {/* Product Preview Section (Reserved Aspect-Ratio to prevent CLS) */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/60 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl shadow-amber-500/5">
          {/* Window Chrome Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="rounded-md bg-slate-950/80 px-4 py-1 text-[11px] font-mono text-slate-400 border border-slate-800">
              app.aicoo.id/dashboard
            </div>
            <div className="w-12 text-right">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
            </div>
          </div>

          {/* Reserved Aspect-Ratio Mockup Canvas */}
          <div className="relative w-full aspect-16/10 rounded-2xl bg-slate-950 p-4 sm:p-6 overflow-hidden border border-slate-800/50 flex flex-col justify-between">
            {/* Top Mockup Row: Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Omset Hari Ini</span>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-white mt-1">Rp 4.850.000</p>
                <p className="text-[11px] text-emerald-400 font-medium mt-0.5">+18% dari kemarin</p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Transaksi Kasir</span>
                  <Receipt className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-white mt-1">142 Struk</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Rata-rata Rp 34.150</p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Status Stok</span>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-white mt-1">3 Produk Kritis</p>
                <p className="text-[11px] text-red-400 font-medium mt-0.5">Perlu restock hari ini</p>
              </div>
            </div>

            {/* Middle Mockup Row: Simulated AI Daily Brief & POS Checkout Card */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4 mt-3 sm:mt-4">
              {/* AI Daily Brief Preview (3 cols) */}
              <div className="sm:col-span-3 p-3.5 sm:p-5 rounded-2xl bg-linear-to-br from-amber-500/10 via-slate-900/90 to-slate-900/80 border border-amber-500/30 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Daily Executive Briefing (06:00 WIB)</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mt-1.5">
                  &ldquo;Stok Kopi Susu Aren menipis, potensi kehilangan 25 gelas saat jam pulang kantor.&rdquo;
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-xs font-bold">
                    <PackageCheck className="h-3.5 w-3.5" /> Tindakan: Restock Susu UHT (12 Liter)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 text-xs font-bold">
                    <MessageCircle className="h-3.5 w-3.5" /> Sapa 4 Pelanggan VIP
                  </span>
                </div>
              </div>

              {/* POS Quick Checkout Preview (2 cols) */}
              <div className="sm:col-span-2 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Kasir POS Cepat</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">QRIS / Tunai</span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>2x Kopi Susu Aren</span>
                      <span className="font-mono">Rp 36.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1x Roti Bakar Coklat</span>
                      <span className="font-mono">Rp 18.000</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Total Bayar:</span>
                  <span className="text-sm sm:text-base font-black text-amber-400 font-mono">Rp 54.000</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Ribbon */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Prisma Transaction Engine Active</span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span>Database: PostgreSQL 16</span>
                <span>Latency: 18ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section (#fitur) */}
      <section id="fitur" className="relative z-10 py-20 border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
              <Layers className="h-3.5 w-3.5" />
              <span>4 Pilar Utama Operasional UMKM</span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-white tracking-tight">
              Satu Sistem untuk Seluruh Kebutuhan Toko Anda
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Tidak perlu lagi pusing mencocokkan aplikasi kasir terpisah, buku catatan manual, dan kalkulator belanja.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: POS */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/40 transition-all group">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit group-hover:scale-110 transition-transform motion-reduce:transition-none">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Kasir POS Cepat & Akurat</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Pencarian produk instan, tombol pecahan Rupiah cepat, struk digital WhatsApp, dan kalkulasi uang kembalian dalam &lt; 5 detik.
              </p>
            </div>

            {/* Feature 2: Real-time Stock */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 transition-all group">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit group-hover:scale-110 transition-transform motion-reduce:transition-none">
                <PackageCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Manajemen Stok Real-Time</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Stok berkurang otomatis saat kasir bertransaksi. Dilengkapi badge indikator stok kritis dan modal restock cepat 1-klik.
              </p>
            </div>

            {/* Feature 3: CRM Pelanggan */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/40 transition-all group">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit group-hover:scale-110 transition-transform motion-reduce:transition-none">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">CRM & Tier Pelanggan VIP</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Otomatis mengelompokkan pelanggan VIP dan Loyal berdasarkan riwayat belanja. Dilengkapi pelacak tanggal belanja terakhir untuk cegah churn.
              </p>
            </div>

            {/* Feature 4: AI COO */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-purple-500/40 transition-all group">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-fit group-hover:scale-110 transition-transform motion-reduce:transition-none">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Otak Analisis AI COO</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Briefing harian pukul 06:00 WIB via model AI terstruktur. Mendeteksi risiko stok, peluang bundling, dan rekomendasi aksi praktis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Showcase Section (#showcase) */}
      <section id="showcase" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-300">
              <Store className="h-3.5 w-3.5" />
              <span>Simulasi Alur Toko</span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tampilan Antarmuka yang Ringan & Modern
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Dibuat dengan kontras tinggi (WCAG AAA) dan tampilan gelap agar nyaman digunakan sepanjang hari di toko fisik.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Showcase 1: POS Experience */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">1. Alur Kasir Cepat</span>
                <Receipt className="h-4 w-4 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-white">Pecahan Tunai & QRIS Instan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kasir cukup menekan tombol nominal uang tunai cepat (Uang Pas, 50k, 100k) untuk menghitung uang kembalian secara otomatis tanpa salah hitung.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Total Belanja:</span>
                  <span className="font-bold text-white">Rp 75.000</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Uang Diterima:</span>
                  <span className="font-bold text-amber-400">Rp 100.000</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800">
                  <span>Kembalian:</span>
                  <span>Rp 25.000</span>
                </div>
              </div>
            </div>

            {/* Showcase 2: Inventory & Restock */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">2. Kontrol Stok Otomatis</span>
                <PackageCheck className="h-4 w-4 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-white">Peringatan Stok Berkedip</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Saat stok barang berada di bawah threshold minimum (&le; 5 unit), sistem menandai barang dengan warna merah agar pemilik segera belanja stok.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Biji Kopi Robusta 1kg</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold text-[10px]">Sisa 2 unit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Susu UHT Plain 1L</span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-bold text-[10px]">Sisa 8 unit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Sirup Vanila 750ml</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">Aman (24 unit)</span>
                </div>
              </div>
            </div>

            {/* Showcase 3: AI Intelligence */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">3. Rekomendasi Taktis AI</span>
                <Brain className="h-4 w-4 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-white">Rencana Aksi Pagi Hari</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI COO meringkas performa 24 jam dan langsung menyajikan tombol tindakan seperti kirim pesan WhatsApp ke pelanggan yang lama tidak berkunjung.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <p className="text-slate-300 italic">
                  &ldquo;Pak Joko (Pelanggan VIP) belum berkunjung 14 hari. Kirim sapaan promo spesial akhir pekan.&rdquo;
                </p>
                <div className="pt-2 flex justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-[11px]">
                    <MessageCircle className="h-3.5 w-3.5" /> Hubungi via WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Impact Section (#dampak) */}
      <section id="dampak" className="relative z-10 py-20 border-t border-slate-900 bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Hasil Terbukti</span>
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-black text-white tracking-tight">
                Dirancang Nyata untuk Menaikkan Profit Bisnis Anda
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                AI COO bukan sekadar pencatat angka, melainkan asisten operasional harian yang melindungi arus kas, meminimalkan deadstock, dan mempertahankan pelanggan setia.
              </p>

              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Data Leakage:</strong> Isolasi multi-tenant level database menjamin kerahasiaan omset dan pelanggan Anda 100%.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Anti Halusinasi:</strong> Analisis AI hanya mengolah angka real database toko tanpa menebak data secara fiktif.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Multi-Device Ready:</strong> Akses kasir dari tablet kasir toko dan pantau laporan harian dari ponsel pemilik usaha.</span>
                </div>
              </div>
            </div>

            {/* Impact Metric Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl text-center">
                <p className="text-3xl sm:text-4xl font-black text-amber-400">&lt; 5s</p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-2">Waktu Checkout Kasir</p>
                <p className="text-[11px] text-slate-400 mt-1">Antrean toko bergerak lebih cepat</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl text-center">
                <p className="text-3xl sm:text-4xl font-black text-emerald-400">-40%</p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-2">Insiden Kehabisan Stok</p>
                <p className="text-[11px] text-slate-400 mt-1">Stok terisi sebelum jam sibuk</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl text-center">
                <p className="text-3xl sm:text-4xl font-black text-blue-400">99.9%</p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-2">Akurasi Multi-Tenant</p>
                <p className="text-[11px] text-slate-400 mt-1">Isolasi data RLS terjamin</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl text-center">
                <p className="text-3xl sm:text-4xl font-black text-purple-400">06:00</p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-2">WIB Briefing Harian</p>
                <p className="text-[11px] text-slate-400 mt-1">Rencana tindakan siap tiap pagi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (#testimoni) */}
      <section id="testimoni" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>Kisah Nyata UMKM</span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-white tracking-tight">
              Dipercaya Pelaku Usaha di Seluruh Indonesia
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Dari kedai kopi modern hingga toko sembako grosir, AI COO membantu operasional harian berjalan mulus.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story 1: Bang Budi (Warkop) */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  &ldquo;Dulu saat kafe ramai jam 8 malam, susu UHT sering mendadak habis. Sekarang dengan AI COO, tiap pagi ada peringatan stok mana yang harus dibeli sebelum toko buka.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-sm">
                  BB
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Bang Budi</h4>
                  <p className="text-[11px] text-slate-400">Owner Kafe & Warkop Modern, Jakarta</p>
                </div>
              </div>
            </div>

            {/* Story 2: Bu Siti (Toko Kelontong) */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  &ldquo;Struk kasir digital yang bisa langsung dikirim ke nomor WhatsApp pelanggan sangat disukai pembeli sembako langganan kami. Pencatatan kasbon juga jadi sangat rapi.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 text-sm">
                  BS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Bu Siti</h4>
                  <p className="text-[11px] text-slate-400">Owner Toko Kelontong Berkah, Surabaya</p>
                </div>
              </div>
            </div>

            {/* Story 3: Mas Deni (Laundry) */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  &ldquo;Fitur segmentasi Pelanggan VIP sangat membantu. Kami bisa memberikan diskon khusus untuk pelanggan yang total transaksinya sudah jutaan rupiah tanpa harus cari manual.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-300 text-sm">
                  MD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Mas Deni</h4>
                  <p className="text-[11px] text-slate-400">Owner Deni Laundry Express, Bandung</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action Banner */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-500/30 bg-linear-to-br from-amber-500/15 via-orange-500/10 to-slate-900/90 p-8 sm:p-12 text-center backdrop-blur-2xl shadow-2xl shadow-amber-500/10">
            <h2
              className="text-2xl sm:text-4xl font-black text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Mulai Transformasi Operasional Bisnis Anda Hari Ini
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Daftarkan toko Anda dalam 2 menit. Dapatkan kasir cepat, pencatatan stok real-time, dan arahan cerdas dari AI Chief Operating Officer Anda.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm sm:text-base font-extrabold text-slate-950 hover:brightness-110 shadow-xl shadow-amber-500/20 transition-all active:scale-95 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Daftar Toko Sekarang <ArrowRight className="h-5 w-5 text-slate-950" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-8 py-4 text-sm sm:text-base font-bold text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-black">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">AI COO</p>
              <p className="text-[11px] text-slate-400">Chief Operating Officer Khusus UMKM Indonesia</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#fitur" className="hover:text-amber-400 transition-colors">Fitur</a>
            <a href="#showcase" className="hover:text-amber-400 transition-colors">Sistem</a>
            <a href="#dampak" className="hover:text-amber-400 transition-colors">Dampak</a>
            <a href="#testimoni" className="hover:text-amber-400 transition-colors">Testimoni</a>
            <Link href="/login" className="hover:text-amber-400 transition-colors">Masuk</Link>
          </div>
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} AI COO Platform. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </footer>
    </div>
  );
}
