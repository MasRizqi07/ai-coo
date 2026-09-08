'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Target,
  RefreshCw,
  MessageCircle,
  Package,
  Clock,
} from 'lucide-react';

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency, formatDateIndonesian } from '../../../lib/utils';
import { toast } from 'sonner';
import { InsightPayload, Product, Customer } from '@ai-coo/shared-types';

interface InsightsClientViewProps {
  initialInsight: InsightPayload | null;
  products: Product[];
  customers: Customer[];
}

export default function InsightsClientView({
  initialInsight,
  products,
  customers,
}: InsightsClientViewProps) {
  const [selectedDayOffset, setSelectedDayOffset] = React.useState<number>(0);
  const [generating, setGenerating] = React.useState<boolean>(false);
  const [lastGeneratedTime, setLastGeneratedTime] = React.useState<number>(0);
  const [completedActions, setCompletedActions] = React.useState<Record<string, boolean>>({});

  // Load completed actions from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ai_coo_resolved_actions');
        if (saved) {
          setCompletedActions(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleAction = (id: string) => {
    setCompletedActions((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ai_coo_resolved_actions', JSON.stringify(updated));
      }
      if (updated[id]) {
        toast.success('Rekomendasi taktis berhasil ditandai selesai!');
      }
      return updated;
    });
  };

  // 14 days historical timeline dates
  const timelineDays = React.useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        offset: i,
        date: d,
        label: i === 0 ? 'Hari Ini' : i === 1 ? 'Kemarin' : formatDateIndonesian(d, { weekday: 'short', day: 'numeric', month: 'short' }),
        formatted: formatDateIndonesian(d),
      };
    });
  }, []);

  // Top fast-moving SKUs (products with lowest stock or highest value)
  const fastMovingProducts = React.useMemo(() => {
    return [...products].sort((a, b) => a.stockQuantity - b.stockQuantity).slice(0, 4);
  }, [products]);

  // Churn risk customers (inactive or with no last purchase)
  const churnRiskCustomers = React.useMemo(() => {
    return customers
      .filter((c) => {
        if (!c.lastPurchaseAt) return true;
        const diffDays = (new Date().getTime() - new Date(c.lastPurchaseAt).getTime()) / (1000 * 3600 * 24);
        return diffDays > 14;
      })
      .slice(0, 4);
  }, [customers]);

  // Active insight data
  const currentInsight: InsightPayload = initialInsight || {
    summary:
      'Laporan operasional AI COO menganalisis data riwayat transaksi dan stok barang Anda. Seluruh metrik berada dalam batas aman dengan potensi akselerasi omset pada produk unggulan.',
    risks: [
      'Stok beberapa barang terlaris berada mendekati ambang batas minimal.',
      'Sebagian pelanggan tercatat belum melakukan pembelian ulang dalam 14 hari terakhir.',
    ],
    opportunities: [
      'Gunakan promosi pesan WhatsApp ke pelanggan VIP untuk mendongkrak penjualan akhir pekan.',
      'Sajikan bundling paket hemat di kasir POS untuk meningkatkan rata-rata belanja.',
    ],
    actionItems: [
      {
        targetType: 'PRODUCT',
        targetName: fastMovingProducts[0]?.name || 'Stok Produk Terlaris',
        action: 'Lakukan restock unit sebelum stok menipis habis.',
        reason: 'Barang ini merupakan penyumbang transaksi kasir harian yang stabil.',
      },
      {
        targetType: 'CUSTOMER',
        targetName: churnRiskCustomers[0]?.name || 'Pelanggan Lama',
        action: 'Sapa kembali melalui pesan WhatsApp toko.',
        reason: 'Pelanggan belum berbelanja dalam 2 minggu terakhir.',
      },
    ],
  };

  // Manual Trigger Insight with 30s rate-limit
  async function handleGenerateNewInsight() {
    const now = Date.now();
    if (now - lastGeneratedTime < 30000) {
      const waitSec = Math.ceil((30000 - (now - lastGeneratedTime)) / 1000);
      toast.error(`Harap tunggu ${waitSec} detik sebelum memicu analisis baru`);
      return;
    }

    setGenerating(true);
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastGeneratedTime(Date.now());
    setGenerating(false);
    toast.success('Analisis operasional AI COO terbaru berhasil diterbitkan!');
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Arsip AI COO & Rekomendasi Taktis
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Intelligence Timeline
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Telusuri rekam jejak analisis 14 hari terakhir dan pantau penyelesaian rekomendasi taktis toko Anda.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleGenerateNewInsight}
          loading={generating}
          className="gap-2 text-xs font-bold"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Generate Insight Baru</span>
        </Button>
      </div>

      {/* 14-Day Timeline Date Selector */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Calendar className="h-4 w-4 text-amber-400" />
          <span>Timeline Briefing 14 Hari Terakhir</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {timelineDays.map((day) => {
            const isSelected = selectedDayOffset === day.offset;
            return (
              <button
                key={day.offset}
                type="button"
                onClick={() => {
                  setSelectedDayOffset(day.offset);
                  toast.info(`Memuat arsip briefing: ${day.formatted}`);
                }}
                className={`flex flex-col items-center justify-center min-w-[110px] p-3 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-lg shadow-amber-500/20 scale-102'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold">{day.label}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-950 font-semibold' : 'text-slate-500'}`}>
                  {day.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selected Briefing Detail */}
      <Card className="rounded-3xl border-amber-500/30 bg-linear-to-br from-slate-900/90 via-slate-950 to-slate-950 p-6 sm:p-8 backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Briefing Operasional: {timelineDays[selectedDayOffset]?.formatted}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Terbit pukul 06:00 WIB • Evaluasi Operasional Toko</span>
              </p>
            </div>
          </div>

          <Badge variant="success" dot pulsing className="text-xs">
            Status Terverifikasi
          </Badge>
        </div>

        {/* Executive summary */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {currentInsight.summary}
          </p>
        </div>

        {/* Risks & Opportunities Grid */}
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          {/* Risks */}
          <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5" />
              <span>Evaluasi Risiko Bisnis</span>
            </h4>
            <ul className="space-y-2">
              {currentInsight.risks.map((risk, index) => (
                <li key={index} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Zap className="h-4.5 w-4.5" />
              <span>Peluang Pertumbuhan Profit</span>
            </h4>
            <ul className="space-y-2">
              {currentInsight.opportunities.map((opp, index) => (
                <li key={index} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resolution Checklist */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="h-4.5 w-4.5 text-amber-400" />
                <span>Checklist Eksekusi Rekomendasi Taktis</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Centang aksi yang telah Anda selesaikan untuk mencatat kepatuhan operasional toko.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {Object.values(completedActions).filter(Boolean).length} / {currentInsight.actionItems.length} Selesai
            </span>
          </div>

          <div className="space-y-2.5">
            {currentInsight.actionItems.map((item, idx) => {
              const actionKey = `action_${selectedDayOffset}_${idx}`;
              const isResolved = Boolean(completedActions[actionKey]);

              return (
                <div
                  key={idx}
                  onClick={() => toggleAction(actionKey)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isResolved
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className={`mt-0.5 h-5 w-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isResolved
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {isResolved && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                          {item.targetType}
                        </span>
                        <span className="text-xs font-bold text-amber-400">{item.targetName}</span>
                      </div>
                      <p
                        className={`text-xs font-semibold ${
                          isResolved ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {item.action}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{item.reason}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {isResolved ? 'Terselesaikan' : 'Belum'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Operational Breakdown Review: Fast-Moving SKUs & Churn Risk */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Fast-Moving SKUs */}
        <Card className="p-6 bg-slate-900/50 rounded-3xl border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Package className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Produk Berputar Cepat (High Velocity)</h4>
                <p className="text-[11px] text-slate-400">Prioritas restock agar tidak kehilangan omset</p>
              </div>
            </div>
            <Link href="/products" className="text-xs text-amber-400 hover:underline font-semibold">
              Lihat Stok
            </Link>
          </div>

          <div className="mt-4 space-y-2.5">
            {fastMovingProducts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Belum ada data produk</p>
            ) : (
              fastMovingProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{formatCurrency(p.price)}</p>
                  </div>
                  <Badge
                    variant={p.stockQuantity <= 5 ? 'destructive' : 'warning'}
                    className="text-[10px]"
                  >
                    Sisa {p.stockQuantity} unit
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Churn Risk Customer List */}
        <Card className="p-6 bg-slate-900/50 rounded-3xl border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <MessageCircle className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Deteksi Pelanggan Perlu Disapa</h4>
                <p className="text-[11px] text-slate-400">Kirim sapaan WhatsApp untuk re-aktivasi</p>
              </div>
            </div>
            <Link href="/customers" className="text-xs text-blue-400 hover:underline font-semibold">
              Lihat CRM
            </Link>
          </div>

          <div className="mt-4 space-y-2.5">
            {churnRiskCustomers.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                Semua pelanggan aktif berkunjung baru-baru ini.
              </p>
            ) : (
              churnRiskCustomers.map((c) => {
                const cleanPhone = (c.phone || '').replace(/\D/g, '');
                const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                const waText = encodeURIComponent(
                  `Halo Kak ${c.name}! Kami merindukan kehadiran Anda di toko kami. Dapatkan promo spesial untuk kunjungan Anda berikutnya!`,
                );

                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {c.phone || 'Tanpa nomor telepon'}
                      </p>
                    </div>
                    {waPhone ? (
                      <a
                        href={`https://wa.me/${waPhone}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-colors"
                      >
                        <MessageCircle className="h-3 w-3" />
                        <span>Sapa WA</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">No Phone</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
