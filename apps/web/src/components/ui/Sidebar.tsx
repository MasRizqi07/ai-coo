'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, Settings, LogOut, Search, Receipt } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './Input';

import { logoutAction } from '../../app/actions/auth';

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sales', href: '/dashboard/sales', icon: Receipt },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl">
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm font-semibold text-amber-500 border border-amber-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          AI COO
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 bg-slate-900 border-slate-800 rounded-lg text-xs"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100',
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-300',
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button
          onClick={() => logoutAction()}
          className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 transition-colors"
        >
          <LogOut className="h-5 w-5 text-slate-500" />
          Sign out
        </button>
      </div>
    </div>
  );
}
