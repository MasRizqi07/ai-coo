'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Package,
  Users,
  Brain,
  Settings,
  LogOut,
  X,
  Store,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { logoutAction } from '../../app/actions/auth';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  companyName?: string;
  businessType?: string;
  userName?: string;
  userRole?: string;
  criticalStockCount?: number;
}

export function Sidebar({
  isOpen = false,
  onClose,
  companyName = 'UMKM Indonesia',
  businessType = 'Retail',
  userName = 'Pemilik Toko',
  userRole = 'OWNER',
  criticalStockCount = 0,
}: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kasir POS', href: '/sales', icon: ShoppingBag, exact: true },
    { name: 'Riwayat Transaksi', href: '/sales/history', icon: History },
    {
      name: 'Produk & Stok',
      href: '/products',
      icon: Package,
      badge: criticalStockCount > 0 ? `${criticalStockCount}` : undefined,
      badgeAlert: criticalStockCount > 0,
    },
    { name: 'Pelanggan', href: '/customers', icon: Users },
    { name: 'Arsip AI', href: '/insights', icon: Brain },
    { name: 'Pengaturan', href: '/settings', icon: Settings },
  ];

  // User initials
  const initials =
    userName
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'UM';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0 shadow-2xl shadow-amber-500/10' : '-translate-x-full',
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-slate-800/80 px-5">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Brain className="h-5 w-5 text-slate-950" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black tracking-tight text-white text-lg">
                AI <span className="text-amber-400">COO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                UMKM Intelligent OS
              </p>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Tenant Indicator Chip */}
        <div className="mx-4 mt-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Store className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{companyName}</p>
            <span className="inline-block text-[10px] font-semibold text-amber-400/90 capitalize">
              {businessType}
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Menu Operasional
          </p>
          {navigation.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 font-semibold border-l-2 border-amber-500 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      'h-4.5 w-4.5 shrink-0 transition-transform duration-150 group-hover:scale-110',
                      isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300',
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'px-2 py-0.5 text-[10px] font-bold rounded-full border',
                      item.badgeAlert
                        ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700',
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex items-center gap-3">
            <div
              title={userName}
              className="h-9 w-9 shrink-0 rounded-xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xs font-black text-slate-950 shadow-md shadow-amber-500/20"
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={cn(
                    'px-1.5 py-0.2 text-[9px] font-bold rounded uppercase tracking-wider',
                    userRole === 'OWNER'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700',
                  )}
                >
                  {userRole}
                </span>
                <span className="text-[10px] text-slate-500 truncate">Sesi Aktif</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logoutAction()}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
