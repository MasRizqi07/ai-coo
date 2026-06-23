import * as React from 'react';
import { Sidebar } from '../../components/ui/Sidebar';
import { Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/50 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">Toko Maju Jaya</h1>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
              Retail
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 border-2 border-slate-950"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              BS
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
