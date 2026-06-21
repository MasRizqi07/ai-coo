/**
 * Landing page — Server Component (no 'use client').
 * In Phase 3+, this will redirect authenticated users to /dashboard
 * and show a login page for unauthenticated users.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white px-6">
      <div className="text-center max-w-2xl">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            v1.0 MVP
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          AI{' '}
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            COO
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-2">
          Asisten Operasional Cerdas untuk UMKM Indonesia
        </p>

        <p className="text-sm text-slate-500 mb-8">
          Ketahui apa yang harus dilakukan hari ini — pelanggan mana yang harus dihubungi, produk
          mana yang harus di-restock, dan apakah bisnis Anda lebih sehat dari minggu lalu.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 text-sm transition-colors">
            Mulai Sekarang
          </button>
          <button className="rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-6 py-3 text-sm transition-colors">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-slate-600">
        © {new Date().getFullYear()} AI COO. Dibuat untuk UMKM Indonesia.
      </footer>
    </main>
  );
}
