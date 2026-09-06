'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  Receipt,
  X,
  Sparkles,
  Store,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { logoutAction } from '../../app/actions/auth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  companyName?: string;
  businessType?: string;
}

export function Sidebar({ isOpen = false, onClose, companyName, businessType }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kasir & Penjualan', href: '/dashboard/sales', icon: Receipt },
    { name: 'Pelanggan (CRM)', href: '/dashboard/customers', icon: Users },
    { name: 'Inventaris Produk', href: '/dashboard/products', icon: Package },
    { name: 'Pengaturan Usaha', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0 shadow-2xl shadow-amber-500/10' : '-translate-x-full',
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-slate-800/60 px-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-lg">
                AI <span className="text-amber-400">COO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                UMKM Intelligent OS
              </p>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Business Store Pill */}
        {companyName && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Store className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{companyName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{businessType?.toLowerCase() || 'UMKM'}</p>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Menu Utama
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center gap-x-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-400 font-semibold border-l-2 border-amber-500 shadow-sm shadow-amber-500/5'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300',
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom AI Status & Sign Out */}
        <div className="p-4 border-t border-slate-800/60 space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-400">AI Engine Siap</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">06:00 WIB</span>
          </div>

          <button
            onClick={() => logoutAction()}
            className="flex w-full items-center gap-x-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Keluar Sesi
          </button>
        </div>
      </aside>
    </>
  );
}
