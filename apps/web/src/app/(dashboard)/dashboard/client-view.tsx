'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  ArrowUpRight,
  MessageCircle,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import { DashboardChartsResponse, DailyRevenuePoint } from '@ai-coo/shared-types';

export interface DashboardStats {
  totalRevenue: number;
  activeCustomersCount?: number;
  activeCustomers?: number;
  lowStockAlertsCount?: number;
  lowStockAlerts?: number;
  todaySalesCount?: number;
}

export interface ActionItem {
  target_type: 'CUSTOMER' | 'PRODUCT' | 'INVENTORY' | string;
  target_name?: string;
  action: string;
  reason: string;
}

export interface InsightData {
  summary: string;
  risks: string[];
  opportunities: string[];
  action_items?: ActionItem[];
  isStale?: boolean;
}

export type ChartPointWithCoords = DailyRevenuePoint & {
  x: number;
  y: number;
};

interface ClientViewProps {
  stats: DashboardStats;
  charts?: DashboardChartsResponse | null;
  insight?: InsightData | null;
}

export default function DashboardClientView({ stats, charts, insight }: ClientViewProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<ChartPointWithCoords | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const statCards = [
    {
      name: 'Total Omset Bisnis',
      value: formatCurrency(stats.totalRevenue),
      change: charts?.revenueChangePct
        ? `${charts.revenueChangePct >= 0 ? '+' : ''}${charts.revenueChangePct}%`
        : '+0%',
      subtext: 'vs 7 hari lalu',
      icon: TrendingUp,
      color: 'text-amber-400',
      bgGlow: 'from-amber-500/10',
    },
    {
      name: 'Transaksi Hari Ini',
      value: (stats.todaySalesCount ?? 0).toString(),
      change: 'Hari Ini',
      subtext: 'struk tercatat',
      icon: ShoppingBag,
      color: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10',
    },
    {
      name: 'Pelanggan Terdaftar',
      value: (stats.activeCustomersCount ?? stats.activeCustomers ?? 0).toString(),
      change: 'Aktif',
      subtext: 'di sistem CRM',
      icon: Users,
      color: 'text-blue-400',
      bgGlow: 'from-blue-500/10',
    },
    {
      name: 'Peringatan Stok',
      value: (stats.lowStockAlertsCount ?? stats.lowStockAlerts ?? 0).toString(),
      change: (stats.lowStockAlertsCount ?? stats.lowStockAlerts ?? 0) > 0 ? 'Perlu Restock' : 'Aman',
      subtext: 'produk menipis',
      icon: AlertCircle,
      alert: (stats.lowStockAlertsCount ?? stats.lowStockAlerts ?? 0) > 0,
      color: (stats.lowStockAlertsCount ?? stats.lowStockAlerts ?? 0) > 0 ? 'text-red-400' : 'text-slate-400',
      bgGlow: (stats.lowStockAlertsCount ?? stats.lowStockAlerts ?? 0) > 0 ? 'from-red-500/10' : 'from-slate-500/10',
    },
  ];

  const activeInsight = insight || {
    summary: 'Selamat datang di AI COO! Penjualan dan stok barang Anda sedang dianalisis.',
    risks: ['Belum ada transaksi yang cukup untuk menyusun analisis risiko mendalam.'],
    opportunities: [
      'Catat transaksi penjualan dan stok produk Anda untuk mendapatkan analisis rekomendasi presisi.',
    ],
    action_items: [],
    isStale: true,
  };

  // Chart Calculations for 7-day SVG graph
  const trendData = charts?.revenueTrend || [];
  const maxRevenue = Math.max(...trendData.map((d: DailyRevenuePoint) => d.revenue), 100000);
  const chartHeight = 140;
  const chartWidth = 500;

  // Generate SVG points
  const points: ChartPointWithCoords[] = trendData.map((point: DailyRevenuePoint, index: number) => {
    const x = (index / Math.max(trendData.length - 1, 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (point.revenue / maxRevenue) * (chartHeight - 40) - 20;
    return { x, y, ...point };
  });

  const svgPath = points.reduce((acc: string, curr: ChartPointWithCoords, i: number) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${svgPath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : '';

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ringkasan Operasional
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Monitoring
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Data operasional terkini dan rekomendasi taktis untuk pertumbuhan usaha Anda.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/sales"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <ShoppingBag className="h-4 w-4 text-slate-950" />
            Buka Kasir POS
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Package className="h-4 w-4 text-slate-400" />
            Kelola Stok
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Card className="relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 bg-slate-900/50 backdrop-blur-xl border-slate-800/80">
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.bgGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.name}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-slate-800/80 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                      stat.alert
                        ? 'bg-red-500/10 text-red-400'
                        : stat.change.startsWith('+')
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-[11px] text-slate-400">{stat.subtext}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend Chart & Quick Metrics */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* 7-Day Revenue Interactive SVG Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Tren Pendapatan 7 Hari Terakhir</h3>
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Omset Harian
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Arahkan kursor ke titik grafik untuk melihat rincian omset per hari
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Minggu Ini</span>
              <p className="text-lg font-black text-emerald-400">
                {formatCurrency(charts?.totalWeekRevenue || 0)}
              </p>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 overflow-visible"
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1={chartHeight - 20} x2={chartWidth - 20} y2={chartHeight - 20} stroke="#1e293b" strokeWidth="1" />
              <line x1="20" y1={chartHeight / 2} x2={chartWidth - 20} y2={chartHeight / 2} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area Fill */}
              {areaPath && <path d={areaPath} fill="url(#revenueGradient)" />}

              {/* Line Stroke */}
              {svgPath && (
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Circles */}
              {points.map((p: ChartPointWithCoords, i: number) => (
                <g key={i} className="cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.date === p.date ? 6 : 4}
                    fill={hoveredPoint?.date === p.date ? '#fbbf24' : '#d97706'}
                    stroke="#030712"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredPoint(p)}
                    className="transition-all"
                  />
                  {/* Day label */}
                  <text
                    x={p.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {p.displayDate.split(',')[0]}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Floating Banner */}
            {hoveredPoint && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/40 px-3 py-1.5 rounded-lg shadow-xl text-center pointer-events-none z-10 animate-fade-in-up">
                <p className="text-[10px] text-slate-400 font-semibold">{hoveredPoint.displayDate}</p>
                <p className="text-sm font-bold text-amber-400">
                  {formatCurrency(hoveredPoint.revenue)}
                </p>
                <p className="text-[10px] text-slate-400">{hoveredPoint.salesCount} transaksi</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Operational Status */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              Ritme Operasional
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Jadwal otomatisasi laporan cerdas untuk UMKM Anda.
            </p>

            <div className="mt-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">Daily Brief Pagi</span>
                  <span className="text-emerald-400 font-bold">06:00 WIB</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Sistem menganalisis data malam hari dan menyajikan agenda aksi saat toko buka.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">Batas Stok Kritis</span>
                  <span className="text-amber-400 font-bold">Auto-Detect</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Peringatan otomatis muncul di dashboard saat unit produk berada di bawah batas minimal.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/settings"
            className="mt-6 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-slate-800/60"
          >
            <span>Sesuaikan Jam & Ambang Batas</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* AI Operations Brief — Premium Glassmorphic Card */}
      <div className="relative rounded-3xl border border-amber-500/30 bg-linear-to-br from-slate-900/80 via-slate-950/90 to-slate-950 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 p-6">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                activeInsight.isStale ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              {activeInsight.isStale ? 'Cached Insight' : 'Real-time Brief'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-linear-to-br from-amber-500/20 to-orange-500/10 rounded-2xl border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10">
            <Brain className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">
                Brief Operasional AI COO
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                Bahasa Indonesia
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed text-base font-medium">
              {activeInsight.summary}
            </p>
          </div>
        </div>

        {/* Risks & Opportunities Grid */}
        <div className="grid gap-6 mt-8 md:grid-cols-2 border-t border-slate-800/80 pt-6">
          {/* Operational Risks */}
          <div className="bg-red-500/5 rounded-2xl border border-red-500/15 p-5">
            <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4" />
              Risiko Operasional Terdeteksi
            </h4>
            <ul className="space-y-2.5">
              {activeInsight.risks.map((risk: string, index: number) => (
                <li key={index} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                  <span className="text-red-400 font-bold select-none">•</span>
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Growth Opportunities */}
          <div className="bg-emerald-500/5 rounded-2xl border border-emerald-500/15 p-5">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4" />
              Peluang Pertumbuhan Omset
            </h4>
            <ul className="space-y-2.5">
              {activeInsight.opportunities.map((opp: string, index: number) => (
                <li key={index} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold select-none">•</span>
                  <span className="leading-relaxed">{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Items with Direct Action Triggers */}
        {activeInsight.action_items && activeInsight.action_items.length > 0 && (
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-amber-400" />
              Rencana Tindakan Taktis Hari Ini
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeInsight.action_items.map((item: ActionItem, index: number) => {
                const isCustomer = item.target_type === 'CUSTOMER';
                const isProduct = item.target_type === 'PRODUCT' || item.target_type === 'INVENTORY';

                return (
                  <div
                    key={index}
                    className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-4.5 hover:border-amber-500/30 transition-all group/item"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span
                          className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${
                            isCustomer
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                              : isProduct
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                          }`}
                        >
                          {item.target_type}
                        </span>
                        <span className="text-xs font-semibold text-slate-300 truncate max-w-35">
                          {item.target_name}
                        </span>
                      </div>
                      <p className="font-bold text-slate-100 text-sm mb-1 leading-snug">
                        {item.action}
                      </p>
                      <p className="text-xs text-slate-400 leading-normal">{item.reason}</p>
                    </div>

                    {/* Action Execution Button */}
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      {isCustomer && (
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `Halo Kak ${item.target_name}, ada kabar baik dari toko kami! Kami rindu kedatangan Anda kembali.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Chat WhatsApp
                        </a>
                      )}
                      {isProduct && (
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <Package className="h-3.5 w-3.5" />
                          Restock Barang
                        </Link>
                      )}
                      {!isCustomer && !isProduct && (
                        <span className="text-[11px] text-slate-400 italic">Lakukan hari ini</span>
                      )}
                    </div>
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
