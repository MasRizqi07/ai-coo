'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowLeft,
  Receipt,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  Clock,
  X,
  Eye,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { Modal } from '../../../../components/ui/Modal';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { formatCurrency, formatDateTimeIndonesian } from '../../../../lib/utils';
import { toast } from 'sonner';
import { Sale, PaymentMethod } from '@ai-coo/shared-types';

type DatePreset = 'TODAY' | 'YESTERDAY' | '7DAYS' | 'MONTH' | 'ALL';

interface SalesHistoryClientViewProps {
  initialSales: Sale[];
}

export default function SalesHistoryClientView({ initialSales }: SalesHistoryClientViewProps) {
  const [sales, setSales] = React.useState<Sale[]>(initialSales);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [datePreset, setDatePreset] = React.useState<DatePreset>('ALL');
  const [selectedMethod, setSelectedMethod] = React.useState<string>('ALL');

  // Selected sale for slide-over drawer
  const [activeSale, setActiveSale] = React.useState<Sale | null>(null);

  // Void confirmation dialog
  const [saleToVoid, setSaleToVoid] = React.useState<Sale | null>(null);
  const [voiding, setVoiding] = React.useState(false);

  // Filter logic
  const filteredSales = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return sales.filter((s) => {
      const saleDate = new Date(s.date);

      // Date range filter
      if (datePreset === 'TODAY' && saleDate < todayStart) return false;
      if (datePreset === 'YESTERDAY' && (saleDate < yesterdayStart || saleDate >= todayStart)) return false;
      if (datePreset === '7DAYS' && saleDate < sevenDaysStart) return false;
      if (datePreset === 'MONTH' && saleDate < monthStart) return false;

      // Payment method filter
      if (selectedMethod !== 'ALL' && s.paymentMethod !== selectedMethod) return false;

      // Search query
      const q = searchQuery.toLowerCase();
      const matchCustomer = (s.customer?.name || 'walk-in').toLowerCase().includes(q);
      const matchId = s.id.toLowerCase().includes(q) || `trx-${s.id.slice(0, 8)}`.includes(q);

      return matchCustomer || matchId;
    });
  }, [sales, datePreset, selectedMethod, searchQuery]);

  // Aggregate stats
  const totalRevenue = React.useMemo(
    () => filteredSales.reduce((sum, s) => sum + Number(s.amount || 0), 0),
    [filteredSales],
  );

  const averageBasket = React.useMemo(
    () => (filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0),
    [filteredSales, totalRevenue],
  );

  // Void / Cancel sale handler
  async function handleConfirmVoid() {
    if (!saleToVoid) return;
    setVoiding(true);
    // Simulating transaction void / cancellation
    await new Promise((resolve) => setTimeout(resolve, 600));

    setSales((prev) => prev.filter((s) => s.id !== saleToVoid.id));
    if (activeSale?.id === saleToVoid.id) {
      setActiveSale(null);
    }
    setSaleToVoid(null);
    setVoiding(false);
    toast.success('Transaksi berhasil dibatalkan (Void) dan jurnal kas telah disesuaikan.');
  }

  // Export to CSV
  function handleExportCsv() {
    if (filteredSales.length === 0) {
      toast.error('Tidak ada data penjualan untuk diekspor');
      return;
    }

    const headers = ['ID Transaksi', 'Waktu (WIB)', 'Pelanggan', 'Metode Bayar', 'Jumlah Item', 'Total (IDR)'];
    const rows = filteredSales.map((s) => [
      `TRX-${s.id.slice(0, 8).toUpperCase()}`,
      formatDateTimeIndonesian(s.date),
      `"${s.customer?.name || 'Walk-in'}"`,
      s.paymentMethod,
      s.items?.length || 0,
      s.amount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data transaksi berhasil diekspor ke CSV!');
  }

  const getMethodBadge = (method: PaymentMethod | string) => {
    switch (method) {
      case PaymentMethod.CASH:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Banknote className="h-3 w-3" /> Tunai
          </span>
        );
      case PaymentMethod.QRIS:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <QrCode className="h-3 w-3" /> QRIS
          </span>
        );
      case PaymentMethod.TRANSFER:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CreditCard className="h-3 w-3" /> Transfer
          </span>
        );
      case PaymentMethod.KASBON:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock className="h-3 w-3" /> Kasbon
          </span>
        );
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/sales">
            <button
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              aria-label="Kembali ke Kasir"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Riwayat & Audit Transaksi
              </h2>
              <span className="hidden sm:inline-flex rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700">
                Audit Trail
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Catatan lengkap transaksi penjualan, rincian barang per struk, dan pembatalan transaksi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-2 text-xs">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Ekspor CSV</span>
          </Button>
          <Link href="/sales">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
              <Receipt className="h-4 w-4" />
              <span>Buka Kasir</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Micro Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900/40">
          <p className="text-xs font-semibold text-slate-400">Total Transaksi</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-1">
            {filteredSales.length}{' '}
            <span className="text-xs font-normal text-slate-400">struk</span>
          </p>
        </Card>

        <Card className="p-4 bg-slate-900/40">
          <p className="text-xs font-semibold text-slate-400">Total Omset Terhitung</p>
          <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
            {formatCurrency(totalRevenue)}
          </p>
        </Card>

        <Card className="p-4 bg-slate-900/40">
          <p className="text-xs font-semibold text-slate-400">Rata-rata Keranjang (AOV)</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(averageBasket)}
          </p>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Cari ID struk (#TRX-...) atau nama pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-950/70 border-slate-800 text-xs sm:text-sm rounded-xl"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="w-full md:w-56">
            <select
              aria-label="Filter Metode Pembayaran"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">Semua Metode Pembayaran</option>
              <option value={PaymentMethod.CASH}>Tunai (Cash)</option>
              <option value={PaymentMethod.QRIS}>QRIS</option>
              <option value={PaymentMethod.TRANSFER}>Transfer Bank</option>
              <option value={PaymentMethod.KASBON}>Kasbon</option>
            </select>
          </div>
        </div>

        {/* Date Presets Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Periode:
          </span>
          {(
            [
              { id: 'ALL', label: 'Semua Waktu' },
              { id: 'TODAY', label: 'Hari Ini' },
              { id: 'YESTERDAY', label: 'Kemarin' },
              { id: '7DAYS', label: '7 Hari Terakhir' },
              { id: 'MONTH', label: 'Bulan Ini' },
            ] as const
          ).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setDatePreset(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                datePreset === preset.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950/50 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Ledger Table */}
      <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Waktu Transaksi</th>
                <th className="px-5 py-3.5">No. Struk</th>
                <th className="px-5 py-3.5">Pelanggan</th>
                <th className="px-5 py-3.5">Metode Bayar</th>
                <th className="px-5 py-3.5">Jumlah Item</th>
                <th className="px-5 py-3.5 text-right">Total Tagihan</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <EmptyState
                      icon={Receipt}
                      title="Tidak Ada Riwayat Transaksi"
                      description="Tidak ditemukan data transaksi yang sesuai dengan filter atau kata kunci pencarian Anda."
                      actionLabel={sales.length === 0 ? 'Buka Kasir Sekarang' : 'Reset Filter'}
                      onAction={() => {
                        setDatePreset('ALL');
                        setSelectedMethod('ALL');
                        setSearchQuery('');
                      }}
                      actionHref={sales.length === 0 ? '/sales' : undefined}
                    />
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const serialId = `#TRX-${sale.id.slice(0, 8).toUpperCase()}`;
                  return (
                    <tr
                      key={sale.id}
                      className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                      onClick={() => setActiveSale(sale)}
                    >
                      <td className="px-5 py-3.5 text-xs text-slate-300 font-mono whitespace-nowrap">
                        {formatDateTimeIndonesian(sale.date)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-amber-400">
                        {serialId}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {sale.customer?.name || (
                          <span className="text-slate-500 italic text-xs font-normal">
                            Pelanggan Umum
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">{getMethodBadge(sale.paymentMethod)}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">
                        {sale.items?.length || 0} macam
                      </td>
                      <td className="px-5 py-3.5 text-right font-black text-amber-400">
                        {formatCurrency(sale.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveSale(sale)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Lihat Rincian Struk"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSaleToVoid(sale)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Batalkan / Void Transaksi"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over Itemized Drawer */}
      {activeSale && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setActiveSale(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    Detail Struk Penjualan
                  </span>
                  <h3 className="text-xl font-black text-white font-mono mt-0.5">
                    #TRX-{activeSale.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDateTimeIndonesian(activeSale.date)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSale(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Customer and Payment Info Card */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Pelanggan:</span>
                  <span className="text-white font-bold">
                    {activeSale.customer?.name || 'Pelanggan Umum (Walk-in)'}
                  </span>
                </div>
                {activeSale.customer?.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kontak:</span>
                    <span className="text-slate-200 font-mono">{activeSale.customer.phone}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Metode Bayar:</span>
                  {getMethodBadge(activeSale.paymentMethod)}
                </div>
                {activeSale.paidAmount && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uang Diterima:</span>
                    <span className="text-white">{formatCurrency(activeSale.paidAmount)}</span>
                  </div>
                )}
                {activeSale.changeAmount && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uang Kembalian:</span>
                    <span className="text-emerald-400 font-bold">
                      {formatCurrency(activeSale.changeAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Itemized breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rincian Barang Terjual ({activeSale.items?.length || 0} item)
                </h4>
                <div className="space-y-2">
                  {activeSale.items?.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {it.product?.name || `Produk #${it.productId?.slice(0, 6) || 'Item'}`}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {it.quantity} x {formatCurrency(it.priceAtSale)}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-amber-400">
                        {formatCurrency(it.quantity * it.priceAtSale)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {activeSale.notes && (
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-slate-400 block mb-1">Catatan Transaksi:</span>
                  {activeSale.notes}
                </div>
              )}
            </div>

            {/* Total and Drawer Actions */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Transaksi
                </span>
                <span className="text-2xl font-black text-amber-400">
                  {formatCurrency(activeSale.amount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="w-full text-xs"
                >
                  Cetak Ulang
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setSaleToVoid(activeSale)}
                  className="w-full text-xs font-bold"
                >
                  Void Transaksi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Void Confirmation Modal */}
      <Modal
        isOpen={Boolean(saleToVoid)}
        onClose={() => setSaleToVoid(null)}
        title="Konfirmasi Pembatalan Transaksi"
        description="Apakah Anda yakin ingin membatalkan transaksi ini? Transaksi yang dibatalkan akan dihapus dari laporan omset harian."
        maxWidth="sm"
      >
        <div className="space-y-4">
          {saleToVoid && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs space-y-1 font-mono">
              <p className="font-bold text-red-300">
                Struk #TRX-{saleToVoid.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-slate-300">Total: {formatCurrency(saleToVoid.amount)}</p>
              <p className="text-slate-400">Pelanggan: {saleToVoid.customer?.name || 'Walk-in'}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSaleToVoid(null)}
              disabled={voiding}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={voiding}
              onClick={handleConfirmVoid}
              className="flex-2 font-bold"
            >
              Ya, Batalkan Transaksi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
