'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/Card';
import {
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  Brain,
  ShieldAlert,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';

export default function DashboardClientView({ stats, insight }: { stats: any; insight: any }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  const statCards = [
    {
      name: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+12.5%',
      icon: TrendingUp,
    },
    {
      name: 'Active Customers',
      value: stats.activeCustomers.toString(),
      change: '+3.2%',
      icon: Users,
    },
    {
      name: 'Products in Stock',
      value: stats.productsInStock.toString(),
      change: '-4',
      icon: Package,
    },
    {
      name: 'Low Stock Alerts',
      value: stats.lowStockAlerts.toString(),
      change: '+2',
      icon: AlertCircle,
      alert: true,
    },
  ];

  // Fallback default insight if none generated or API failed
  const activeInsight = insight || {
    summary: 'Selamat datang di AI COO! Penjualan dan stok barang Anda sedang dianalisis.',
    risks: ['Belum ada data transaksi yang cukup untuk menyusun analisis risiko saat ini.'],
    opportunities: [
      'Terus catat penjualan produk dan data pelanggan Anda untuk mendapatkan ringkasan performa yang akurat.',
    ],
    action_items: [],
    isStale: true,
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-slate-400 mt-2">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.name}
            className="relative overflow-hidden group hover:scale-[1.02] hover:border-amber-500/40 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.alert ? 'text-red-400' : 'text-slate-500'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p
                className={`text-xs mt-1 ${stat.change.startsWith('+') && !stat.alert ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Operations Brief */}
      <div className="relative rounded-2xl border border-amber-500/20 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${activeInsight.isStale ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {activeInsight.isStale ? 'Cached Insight' : 'Real-time Brief'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
            <Brain className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-4xl">
            <h3 className="text-lg font-bold text-amber-500 flex items-center gap-2">
              AI Operations Insight
              {!activeInsight.isStale && <Sparkles className="h-4 w-4 text-amber-400" />}
            </h3>
            <p className="text-slate-200 leading-relaxed text-base font-medium">
              {activeInsight.summary}
            </p>
          </div>
        </div>

        {/* Risks & Opportunities Grid */}
        <div className="grid gap-6 mt-6 md:grid-cols-2 border-t border-slate-800/80 pt-6">
          {/* Risks */}
          <div className="bg-red-500/5 rounded-xl border border-red-500/10 p-4">
            <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4" />
              Risiko Operasional
            </h4>
            <ul className="space-y-2">
              {activeInsight.risks.map((risk: string, index: number) => (
                <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-red-400 mt-1 select-none">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/10 p-4">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4" />
              Peluang Pertumbuhan
            </h4>
            <ul className="space-y-2">
              {activeInsight.opportunities.map((opp: string, index: number) => (
                <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 mt-1 select-none">•</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Items */}
        {activeInsight.action_items && activeInsight.action_items.length > 0 && (
          <div className="mt-6 border-t border-slate-800/80 pt-6">
            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-amber-500" />
              Rencana Tindakan Rekomendasi
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeInsight.action_items.map((item: any, index: number) => {
                const badgeColor =
                  {
                    PRODUCT: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                    CUSTOMER: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
                    INVENTORY: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
                    OTHER: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
                  }[item.target_type as 'PRODUCT' | 'CUSTOMER' | 'INVENTORY' | 'OTHER'] ||
                  'bg-slate-500/10 border-slate-500/20 text-slate-400';

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase border px-2 py-0.5 rounded-full ${badgeColor}`}
                      >
                        {item.target_type}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 truncate max-w-[150px]">
                        {item.target_name}
                      </span>
                    </div>
                    <div className="font-bold text-slate-200 text-sm mb-1">{item.action}</div>
                    <div className="text-xs text-slate-400 leading-normal">{item.reason}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
