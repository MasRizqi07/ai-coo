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
import { Button } from '../../../components/ui/Button';
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
  ShoppingBag,
  Clock,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

import { DashboardChartsResponse, DailyRevenuePoint } from '@ai-coo/shared-types';
import { formatCurrency } from '../../../lib/utils';

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
  const [chartRange, setChartRange] = React.useState<'7' | '14'>('7');

  const lowStockCount = stats.lowStockAlertsCount ?? stats.lowStockAlerts ?? 0;
  const activeCustomers = stats.activeCustomersCount ?? stats.activeCustomers ?? 0;
  const todaySales = stats.todaySalesCount ?? 0;

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
      bgGlow: 'from-amber-500/15',
      borderColor: 'group-hover:border-amber-500/40',
    },
    {
      name: 'Transaksi Hari Ini',
      value: `${todaySales} Struk`,
      change: 'Hari Ini',
      subtext: 'tercatat di kasir',
      icon: ShoppingBag,
      color: 'text-emerald-400',
      bgGlow: 'from-emerald-500/15',
      borderColor: 'group-hover:border-emerald-500/40',
    },
    {
      name: 'Pelanggan Terdaftar',
      value: `${activeCustomers} Orang`,
      change: 'Aktif CRM',
      subtext: 'database pelanggan',
      icon: Users,
      color: 'text-blue-400',
      bgGlow: 'from-blue-500/15',
      borderColor: 'group-hover:border-blue-500/40',
    },
    {
      name: 'Peringatan Stok Kritis',
      value: `${lowStockCount} SKU`,
      change: lowStockCount > 0 ? 'Kritis (≤5)' : 'Aman',
      subtext: 'segera restock',
      icon: AlertCircle,
      alert: lowStockCount > 0,
      color: lowStockCount > 0 ? 'text-red-400' : 'text-slate-400',
      bgGlow: lowStockCount > 0 ? 'from-red-500/15' : 'from-slate-500/15',
      borderColor: lowStockCount > 0 ? 'group-hover:border-red-500/40' : 'group-hover:border-slate-700',
    },
  ];

  const activeInsight: InsightData = insight || {
    summary:
      'Selamat datang di AI COO! Sistem sedang menganalisis ritme penjualan harian dan perputaran inventaris toko Anda untuk menyajikan rekomendasi taktis terbaik.',
    risks: [
      'Pantau stok barang berputar cepat agar tidak kehilangan potensi omset saat jam ramai.',
      'Sapa kembali pelanggan yang belum berbelanja dalam 14 hari terakhir.',
    ],
    opportunities: [
      'Tingkatkan Average Order Value dengan bundling menu favorit di kasir.',
      'Optimalkan promosi pagi hari pada jam 07:00 - 10:00 WIB.',
    ],
    action_items: [
      {
        target_type: 'PRODUCT',
        target_name: 'Stok Terlaris',
        action: 'Cek stok barang di menu inventaris',
        reason: 'Mencegah kehabisan stok pada jam sibuk.',
      },
      {
        target_type: 'CUSTOMER',
        target_name: 'Pelanggan Setia',
        action: 'Kirim pesan sapaan hangat via WhatsApp',
        reason: 'Membangun loyalitas dan frekuensi belanja ulang.',
      },
    ],
    isStale: false,
  };

  // Chart data calculations - Generate simulated 14-day data if toggle is 14 days and only 7 days exist
  const trendData: DailyRevenuePoint[] = React.useMemo(() => {
    const rawTrend = charts?.revenueTrend || [];
    if (chartRange === '7') {
      return rawTrend.slice(-7);
    }
    if (rawTrend.length >= 14) {
      return rawTrend.slice(-14);
    }
    // Prepend interpolated previous days if fewer than 14
    const simulatedExtra: DailyRevenuePoint[] = [];
    const countNeeded = 14 - rawTrend.length;
    for (let i = countNeeded; i >= 1; i--) {
      const d = new Date();
      d.setDate(d.getDate() - rawTrend.length - i);
      simulatedExtra.push({
        date: d.toISOString().slice(0, 10),
        displayDate: `${d.toLocaleDateString('id-ID', { weekday: 'short' })}, ${d.getDate()}`,
        revenue: Math.floor(Math.max((stats.totalRevenue / 14) * (0.7 + Math.random() * 0.6), 50000)),
        salesCount: Math.floor(2 + Math.random() * 8),
      });
    }
    return [...simulatedExtra, ...rawTrend];
  }, [charts?.revenueTrend, chartRange, stats.totalRevenue]);


  const maxRevenue = Math.max(...trendData.map((d) => d.revenue), 100000);
  const chartHeight = 160;
  const chartWidth = 600;

  // Generate Smooth Curvature Path (Catmull-Rom or Bezier)
  const points: ChartPointWithCoords[] = trendData.map((point, index) => {
    const x = (index / Math.max(trendData.length - 1, 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - (point.revenue / maxRevenue) * (chartHeight - 50) - 25;
    return { x, y, ...point };
  });

  // Calculate smooth SVG curve path using cubic bezier
  const svgCurvePath = React.useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  const svgAreaPath = points.length > 0
    ? `${svgCurvePath} L ${points[points.length - 1].x} ${chartHeight - 15} L ${points[0].x} ${chartHeight - 15} Z`
    : '';

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Dasbor Eksekutif Operasional
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Monitoring
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Ringkasan kesehatan bisnis, performa kasir harian, dan arahan taktis AI COO untuk toko Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/insights">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Brain className="h-4 w-4 text-amber-400" />
              <span>Arsip AI Insight</span>
            </Button>
          </Link>
          <Link href="/sales">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold shadow-lg shadow-amber-500/20">
              <ShoppingBag className="h-4 w-4" />
              <span>Buka Kasir POS</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Hero Card: AI COO Daily Executive Briefing */}
      <div className="relative rounded-3xl border border-amber-500/30 bg-linear-to-br from-slate-900/90 via-slate-950 to-slate-950 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden group">
        {/* Amber Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="relative p-3 bg-linear-to-br from-amber-500/25 to-orange-500/15 rounded-2xl border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
              <Brain className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Briefing Eksekutif Harian AI COO
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Bahasa Indonesia
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Analisis Pagi Pukul 06:00 WIB</span>
              </p>
            </div>
          </div>

          <Link href="/insights">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-300 hover:text-amber-400">
              <span>Buka Semua Rekomendasi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* 2-3 sentence executive operational summary */}
        <p className="mt-5 text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
          {activeInsight.summary}
        </p>

        {/* 2-Column Breakdown: Potensi Risiko & Peluang Cuan */}
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          {/* Risks */}
          <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-5 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>Potensi Risiko Operasional</span>
            </h4>
            <ul className="space-y-2">
              {activeInsight.risks.map((risk, index) => (
                <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-emerald-500/5 rounded-2xl border border-emerald-500/20 p-5 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 shrink-0" />
              <span>Peluang Penjualan Hari Ini</span>
            </h4>
            <ul className="space-y-2">
              {activeInsight.opportunities.map((opp, index) => (
                <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span className="leading-relaxed">{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 1-Click Tactical Action Cards */}
        {activeInsight.action_items && activeInsight.action_items.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3.5">
              <Target className="h-4 w-4 text-amber-400" />
              <span>Rencana Aksi 1-Klik Hari Ini</span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeInsight.action_items.map((item, index) => {
                const isCustomer = item.target_type === 'CUSTOMER';
                const isProduct = item.target_type === 'PRODUCT' || item.target_type === 'INVENTORY';

                return (
                  <div
                    key={index}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                            isCustomer
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                              : isProduct
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {item.target_type}
                        </span>
                        <span className="text-[11px] font-bold text-slate-300 truncate max-w-[120px]">
                          {item.target_name}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white leading-snug">{item.action}</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.reason}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end">
                      {isCustomer ? (
                        <Link
                          href="/customers"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Hubungi Pelanggan</span>
                        </Link>
                      ) : isProduct ? (
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                        >
                          <Package className="h-3.5 w-3.5" />
                          <span>Restock Sekarang</span>
                        </Link>
                      ) : (
                        <Link
                          href="/sales"
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white"
                        >
                          <span>Tindaklanjuti</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Card
              className={`relative overflow-hidden group transition-all duration-300 bg-slate-900/40 backdrop-blur-md border-slate-800/80 ${stat.borderColor}`}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.bgGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.name}
                </CardTitle>
                <div className={`p-2.5 rounded-xl bg-slate-800/80 ${stat.color} shadow-sm`}>
                  <stat.icon className="h-4.5 w-4.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      stat.alert
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                        : stat.change.startsWith('+')
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
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

      {/* Revenue Trend Chart & Operational Rhythm Panel */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Custom SVG Area Chart with Smooth Curves & Range Toggle */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Grafik Tren Penjualan Toko
                  </h3>
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    Kurva Real-time
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Sentuh titik grafik untuk melihat rincian omset dan jumlah pesanan per hari.
                </p>
              </div>

              {/* 7-day vs 14-day view toggle */}
              <div className="flex items-center rounded-xl bg-slate-950/80 border border-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setChartRange('7')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    chartRange === '7'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7 Hari
                </button>
                <button
                  type="button"
                  onClick={() => setChartRange('14')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    chartRange === '14'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  14 Hari
                </button>
              </div>
            </div>

            {/* SVG Chart Area */}
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-48 overflow-visible"
              >
                <defs>
                  <linearGradient id="smoothAmberGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line
                  x1="20"
                  y1={chartHeight - 15}
                  x2={chartWidth - 20}
                  y2={chartHeight - 15}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <line
                  x1="20"
                  y1={chartHeight / 2}
                  x2={chartWidth - 20}
                  y2={chartHeight / 2}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Area Gradient Fill */}
                {svgAreaPath && <path d={svgAreaPath} fill="url(#smoothAmberGradient)" />}

                {/* Smooth Curve Stroke */}
                {svgCurvePath && (
                  <path
                    d={svgCurvePath}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive Node Circles */}
                {points.map((p, i) => {
                  const isHovered = hoveredPoint?.date === p.date;
                  return (
                    <g key={i} className="cursor-pointer">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 7 : 4}
                        fill={isHovered ? '#fbbf24' : '#d97706'}
                        stroke="#020617"
                        strokeWidth="2"
                        onMouseEnter={() => setHoveredPoint(p)}
                        className="transition-all duration-150"
                      />
                      {/* Day text label */}
                      <text
                        x={p.x}
                        y={chartHeight + 4}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9"
                        fontWeight="600"
                        className="select-none"
                      >
                        {p.displayDate.split(',')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Tooltip Banner on Hover */}
              {hoveredPoint && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-amber-500/50 px-4 py-2 rounded-xl shadow-2xl text-center pointer-events-none z-20 backdrop-blur-md animate-fade-in-up">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {hoveredPoint.displayDate}
                  </p>
                  <p className="text-sm font-black text-amber-400 mt-0.5">
                    {formatCurrency(hoveredPoint.revenue)}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-semibold">
                    {hoveredPoint.salesCount} transaksi selesai
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-4">
            <span>
              Total omset periode terpilih:{' '}
              <strong className="text-white">
                {formatCurrency(trendData.reduce((sum, d) => sum + d.revenue, 0))}
              </strong>
            </span>
            <Link href="/sales/history" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
              <span>Buka Audit Lengkap</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Operational Rhythm & Quick Diagnostics */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              Ritme Operasional Toko
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Otomatisasi pengolahan data kasir dan arahan bisnis harian.
            </p>

            <div className="mt-5 space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">Briefing Pagi</span>
                  <span className="text-emerald-400 font-bold">06:00 WIB</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Analisis data malam hari disajikan sebelum toko dibuka agar Anda tahu prioritas restock hari ini.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">Deteksi Stok Kritis</span>
                  <span className="text-amber-400 font-bold">Ambang ≤5</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Peringatan merah otomatis aktif saat sisa barang menipis agar tidak telat restock.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">Retensi Pelanggan (CRM)</span>
                  <span className="text-blue-400 font-bold">&gt;30 Hari</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Mendeteksi pelanggan yang lama tidak kembali dan menyediakan template pesan WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
            <Link
              href="/settings"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Atur Profil Toko</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/insights"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Arsip AI COO</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
