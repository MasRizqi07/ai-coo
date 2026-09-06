import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  ShoppingBag,
  ShieldCheck,
  MessageCircle,
  PackageCheck,
  CheckCircle2,
  Users,
  Store,
  Zap,
} from 'lucide-react';
import { getToken } from './actions/auth';

export default async function HomePage() {
  const token = await getToken();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-xl text-white tracking-tight">
                AI <span className="text-amber-400">COO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Chief Operating Officer UMKM
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#fitur" className="hover:text-amber-400 transition-colors">
              Fitur Unggulan
            </a>
            <a href="#showcase" className="hover:text-amber-400 transition-colors">
              Tampilan Sistem
            </a>
            <a href="#dampak" className="hover:text-amber-400 transition-colors">
              Dampak Bisnis
            </a>
            <a href="#testimoni" className="hover:text-amber-400 transition-colors">
              Kisah Sukses
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {token ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                Buka Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  Daftar Toko <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center lg:px-8 lg:pt-24">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-400 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Asisten Operasional AI Cerdas Khusus UMKM Indonesia</span>
        </div>

        <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Kelola Toko Lebih Rapi, <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Lipatgandakan Omset dengan AI COO.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
          Ketahui apa yang harus dilakukan hari ini — produk apa yang harus di-restock, pelanggan mana yang harus disapa kembali di WhatsApp, dan strategi terbaik untuk menumbuhkan profit bisnis Anda.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 px-8 py-4 text-base font-extrabold text-slate-950 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all active:scale-95"
          >
            Mulai Usaha Anda Sekarang
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-8 py-4 text-base font-bold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Lihat Demo Langsung
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Tanpa Instalasi Rumit</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Mendukung Warkop, Bengkel, Kelontong</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Multi-Tenant RLS Secure</span>
          </div>
        </div>

        {/* Floating Mockup Showcase */}
        <div id="showcase" className="mt-16 mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-amber-500/5 text-left relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs text-slate-400 font-mono">dashboard.ai-coo.id</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Brief Ready
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Omset Bulan Ini</span>
              <p className="text-2xl font-black text-amber-400 mt-1">Rp 48.750.000</p>
              <span className="text-[11px] text-emerald-400 font-bold mt-1 inline-block">
                +14.8% vs bulan lalu
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Pelanggan Aktif</span>
              <p className="text-2xl font-black text-white mt-1">128 Orang</p>
              <span className="text-[11px] text-slate-400 mt-1 inline-block">
                3 perlu disapa di WhatsApp
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Stok Perlu Restock</span>
              <p className="text-2xl font-black text-red-400 mt-1">2 Produk</p>
              <span className="text-[11px] text-red-400 font-bold mt-1 inline-block">
                Peringatan Dini Aktif
              </span>
            </div>
          </div>

          {/* Simulated Brief Box */}
          <div className="mt-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                AI Operations Brief (06:00 WIB)
                <Sparkles className="h-3.5 w-3.5" />
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                &ldquo;Penjualan Kopi Robusta naik pesat di akhir pekan. Namun stok kemasan 250g tersisa 4 unit (kritis). Pelanggan setia Pak Joko belum mampir selama 16 hari. Disarankan kirim pesan sapaan WA hari ini.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section id="fitur" className="relative z-10 border-t border-slate-800/80 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Fitur Lengkap Kelas Industri
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              Semua yang Dibutuhkan UMKM Dalam Satu Sistem
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Tidak ada lagi pembukuan berantakan, nota hilang, atau stok habis mendadak.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-xl hover:border-amber-500/40 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Brief Harian</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Setiap pukul 06:00 WIB, AI menganalisis data dan menyusun daftar aksi konkret agar toko Anda siap menyambut pelanggan.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-xl hover:border-amber-500/40 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Kasir POS & Struk WA</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Proses transaksi cepat dengan metode Tunai, QRIS, atau Transfer, lengkap dengan hitung kembalian dan struk cetak / WhatsApp.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-xl hover:border-amber-500/40 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                <PackageCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Prediksi Stok Cerdas</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Ketahui barang terlaris dan terima peringatan otomatis saat stok mendekati batas minimal agar operasional tidak terhenti.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-xl hover:border-amber-500/40 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">WhatsApp CRM</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Deteksi pelanggan yang mulai jarang beli dan sapa kembali dengan 1-klik template WhatsApp siap kirim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Numbers Section */}
      <section id="dampak" className="relative z-10 py-20 border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 p-8 sm:p-12 backdrop-blur-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              <div className="pt-4 lg:pt-0">
                <p className="text-4xl sm:text-5xl font-black text-amber-400">+35%</p>
                <p className="text-xs text-slate-300 font-semibold mt-2">Retensi Pembeli Setia</p>
                <p className="text-[11px] text-slate-500">Berkat WhatsApp Re-engagement</p>
              </div>
              <div className="pt-4 lg:pt-0">
                <p className="text-4xl sm:text-5xl font-black text-emerald-400">10 Jam</p>
                <p className="text-xs text-slate-300 font-semibold mt-2">Hemat Waktu per Minggu</p>
                <p className="text-[11px] text-slate-500">Otomasi rekapan kasir & stok</p>
              </div>
              <div className="pt-4 lg:pt-0">
                <p className="text-4xl sm:text-5xl font-black text-blue-400">0 Kasus</p>
                <p className="text-xs text-slate-300 font-semibold mt-2">Stok Kosong Terlewat</p>
                <p className="text-[11px] text-slate-500">Peringatan dini ambang batas</p>
              </div>
              <div className="pt-4 lg:pt-0">
                <p className="text-4xl sm:text-5xl font-black text-white">Rp 0</p>
                <p className="text-xs text-slate-300 font-semibold mt-2">Biaya Konsultan Mahal</p>
                <p className="text-[11px] text-slate-500">AI COO bekerja 24/7 untuk Anda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="relative z-10 py-20 border-t border-slate-800/80 bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Kisah Nyata Pengguna
            </span>
            <h2 className="mt-2 text-3xl font-black text-white">
              Dipercaya Pemilik UMKM di Berbagai Kota
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Dulu sering kehabisan susu dan biji kopi saat warkop lagi ramai. Sejak pakai AI COO, jam 6 pagi sudah ada brief barang apa saja yang harus dibeli.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                  BS
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Budi Santoso</p>
                  <p className="text-[10px] text-slate-400">Pemilik Warkop & Cafe — Malang</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Fitur kasir dan struk WhatsApp nya luar biasa! Pelanggan senang karena tidak perlu cetak kertas yang sering hilang kalau belanja material.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
                  DW
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Hj. Dewi Rahayu</p>
                  <p className="text-[10px] text-slate-400">Toko Bangunan Sumber Rejeki — Bekasi</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Pelanggan yang sudah 2 minggu tidak laundry langsung disapa pakai template WA dari AI. Besoknya mereka langsung antar pakaian kotor lagi!&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs">
                  RZ
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Rizal Firmansyah</p>
                  <p className="text-[10px] text-slate-400">Owner Kilat Laundry Express — Surabaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 py-20 border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 p-8 sm:p-14 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Siap Membawa Usaha Anda ke Level Berikutnya?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-300">
              Daftarkan toko Anda dalam 2 menit dan rasakan kemudahan mengelola bisnis bersama AI COO.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 px-8 py-3.5 text-sm font-extrabold text-slate-950 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
              >
                Daftar Usaha Sekarang Gratis <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
              AI
            </div>
            <span className="font-bold text-slate-300">AI COO Indonesia</span>
          </div>
          <p>© {new Date().getFullYear()} AI COO. Hak Cipta Dilindungi. Dirancang untuk kemajuan UMKM Nusantara.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-amber-400 transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-amber-400 transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
