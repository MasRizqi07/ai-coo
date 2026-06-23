import * as React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950 text-slate-100">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
      <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden bg-slate-900 border-l border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-500 opacity-20 blur-[100px]"></div>
        <div className="z-10 text-center space-y-6 max-w-lg p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm text-amber-400 border border-white/10 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            AI COO
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Asisten Operasional Cerdas untuk UMKM
          </h1>
          <p className="text-slate-400 text-lg">
            Ketahui apa yang harus dilakukan hari ini. AI COO menganalisis data Anda untuk
            memberikan insight yang dapat ditindaklanjuti.
          </p>
        </div>
      </div>
    </div>
  );
}
