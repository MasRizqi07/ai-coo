'use client';

import * as React from 'react';
import { Sidebar } from '../../components/ui/Sidebar';
import { Menu, Sparkles } from 'lucide-react';
import { UserProfile } from '@ai-coo/shared-types';

interface DashboardShellProps {
  children: React.ReactNode;
  userProfile: UserProfile | null;
}

export function DashboardShell({ children, userProfile }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const companyName = userProfile?.company?.name || 'UMKM Indonesia';
  const businessType = userProfile?.company?.businessType || 'RETAIL';
  const userName = userProfile?.name || 'Pengguna';

  // Extract initials
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'UM';

  const typeLabels: Record<string, string> = {
    WARKOP: 'Warkop & Kuliner',
    TOKO_BANGUNAN: 'Toko Bangunan',
    LAUNDRY: 'Laundry',
    BENGKEL: 'Bengkel',
    RETAIL: 'Retail & Toko',
    DISTRIBUTOR: 'Distributor',
    OTHER: 'UMKM',
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden">
      {/* Sidebar with mobile toggle */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        companyName={companyName}
        businessType={typeLabels[businessType] || businessType}
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex h-18 shrink-0 items-center justify-between border-b border-slate-800/70 bg-slate-950/70 px-4 sm:px-8 backdrop-blur-2xl z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white lg:hidden transition-colors"
              aria-label="Buka Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-50 sm:max-w-md">
                {companyName}
              </h1>
              <span className="hidden sm:inline-flex rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                {typeLabels[businessType] || businessType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Status Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>AI Mode Aktif</span>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-200">{userName}</p>
                <p className="text-[10px] text-slate-400">{userProfile?.role === 'OWNER' ? 'Pemilik Toko' : 'Staff'}</p>
              </div>
              <div
                title={userName}
                className="h-9 w-9 rounded-xl bg-linear-to-tr from-amber-500 to-orange-500 border border-amber-400/40 flex items-center justify-center text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area with Mesh Gradient Background */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900/90 via-slate-950 to-slate-950 p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
