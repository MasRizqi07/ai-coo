'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/ui/Sidebar';
import { Menu, Zap, Wifi, WifiOff, RefreshCw } from 'lucide-react';

import { UserProfile } from '@ai-coo/shared-types';
import { OnboardingWizard } from '../../components/onboarding-wizard';

interface DashboardShellProps {
  children: React.ReactNode;
  userProfile: UserProfile | null;
  criticalStockCount?: number;
}

export function DashboardShell({
  children,
  userProfile,
  criticalStockCount = 0,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);

  // Check if first-time onboarding has been shown
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('ai_coo_onboarding_completed');
      if (!completed && userProfile?.role === 'OWNER') {
        setIsOnboardingOpen(true);
      }
    }
  }, [userProfile]);


  // Monitor network online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const companyName = userProfile?.company?.name || 'UMKM Indonesia';
  const businessType = userProfile?.company?.businessType || 'RETAIL';
  const userName = userProfile?.name || 'Pengguna';
  const userRole = userProfile?.role || 'OWNER';

  const typeLabels: Record<string, string> = {
    WARKOP: 'Warkop & Kuliner',
    TOKO_BANGUNAN: 'Toko Bangunan',
    LAUNDRY: 'Jasa Laundry',
    BENGKEL: 'Bengkel',
    RETAIL: 'Retail & Toko',
    DISTRIBUTOR: 'Distributor',
    OTHER: 'UMKM',
  };

  const initials =
    userName
      .split(' ')
      .filter(Boolean)
      .map((w: string) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'UM';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden">
      {/* Sidebar with mobile toggle */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        companyName={companyName}
        businessType={typeLabels[businessType] || businessType}
        userName={userName}
        userRole={userRole}
        criticalStockCount={criticalStockCount}
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Sticky Offline Warning Banner */}
        {isOffline && (
          <div className="bg-red-500 text-white px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-between z-50 animate-pulse">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              <span>
                Koneksi Internet Terputus. Transaksi kasir offline tetap dicatat secara lokal.
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Coba Hubungkan Ulang</span>
            </button>
          </div>
        )}

        {/* Top Header */}
        <header className="flex h-18 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-xl z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white lg:hidden transition-colors cursor-pointer"
              aria-label="Buka Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-44 sm:max-w-md">
                {companyName}
              </h1>
              <span className="hidden sm:inline-flex rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                {typeLabels[businessType] || businessType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Kasir Shortcut CTA */}
            <Link
              href="/sales"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 px-3.5 py-2 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span className="hidden sm:inline">Buka Kasir Cepat</span>
              <span className="sm:hidden">Kasir</span>
            </Link>

            {/* Connectivity Status Badge */}
            <div
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                isOffline
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOffline ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOffline ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              {isOffline ? (
                <>
                  <WifiOff className="h-3 w-3 text-red-400" />
                  <span>Mode Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="h-3 w-3 text-emerald-400" />
                  <span>Tersambung (WIB)</span>
                </>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="hidden text-right lg:block">
                <p className="text-xs font-bold text-slate-200 leading-tight">{userName}</p>
                <p className="text-[10px] font-semibold text-slate-400">
                  {userRole === 'OWNER' ? 'Pemilik Toko' : 'Staff Toko'}
                </p>
              </div>
              <div
                title={userName}
                className="h-9 w-9 rounded-xl bg-linear-to-tr from-amber-500 to-orange-500 border border-amber-400/40 flex items-center justify-center text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 cursor-default select-none"
              >
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900/90 via-slate-950 to-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* First-Time Onboarding Wizard */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        companyName={companyName}
        businessType={typeLabels[businessType] || businessType}
      />
    </div>
  );
}

