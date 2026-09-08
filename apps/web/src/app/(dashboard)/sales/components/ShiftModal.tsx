'use client';

import * as React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { formatCurrency, formatDateTimeIndonesian } from '../../../../lib/utils';
import { Wallet, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemCashSales: number;
}

export function ShiftModal({ isOpen, onClose, systemCashSales }: ShiftModalProps) {
  const [shiftActive, setShiftActive] = React.useState(false);
  const [initialFloat, setInitialFloat] = React.useState<string>('100000');
  const [physicalCashInput, setPhysicalCashInput] = React.useState<string>('');
  const [shiftStartTime, setShiftStartTime] = React.useState<string>('');

  // Load shift from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFloat = localStorage.getItem('ai_coo_shift_float');
      const savedTime = localStorage.getItem('ai_coo_shift_start');
      if (savedFloat && savedTime) {
        setShiftActive(true);
        setInitialFloat(savedFloat);
        setShiftStartTime(savedTime);
      }
    }
  }, [isOpen]);

  const floatAmount = parseFloat(initialFloat) || 0;
  const physicalCash = parseFloat(physicalCashInput) || 0;
  const expectedTotalCash = floatAmount + systemCashSales;
  const discrepancy = physicalCash - expectedTotalCash;

  function handleStartShift(e: React.FormEvent) {
    e.preventDefault();
    if (floatAmount < 0) return;
    const now = new Date().toISOString();
    localStorage.setItem('ai_coo_shift_float', floatAmount.toString());
    localStorage.setItem('ai_coo_shift_start', now);
    setShiftActive(true);
    setShiftStartTime(now);
    toast.success('Shift kasir berhasil dibuka!');
    onClose();
  }

  function handleCloseShift(e: React.FormEvent) {
    e.preventDefault();
    localStorage.removeItem('ai_coo_shift_float');
    localStorage.removeItem('ai_coo_shift_start');
    setShiftActive(false);
    toast.success('Z-Report shift kasir berhasil diselesaikan dan disimpan!');
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={shiftActive ? 'Tutup Shift Kasir (Z-Report)' : 'Buka Shift Kasir Baru'}
      description={
        shiftActive
          ? 'Hitung uang fisik di laci kasir dan bandingkan dengan catatan transaksi sistem.'
          : 'Catat modal tunai awal (uang kembalian) yang tersedia di laci kasir.'
      }
      maxWidth="md"
    >
      {!shiftActive ? (
        <form onSubmit={handleStartShift} className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Modal Awal di Laci (Cash Float)</p>
                <p className="text-[11px] text-slate-400">
                  Uang pecahan kecil untuk uang kembalian pelanggan
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Input
                type="number"
                value={initialFloat}
                onChange={(e) => setInitialFloat(e.target.value)}
                placeholder="100000"
                className="text-base font-bold text-amber-400"
                required
              />
              <div className="flex gap-2 pt-1">
                {[50000, 100000, 200000, 500000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInitialFloat(preset.toString())}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] font-mono text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    {formatCurrency(preset)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-2 font-bold">
              Buka Shift Kasir
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCloseShift} className="space-y-4">
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Shift Dimulai:</span>
              <span className="text-white">
                {shiftStartTime ? formatDateTimeIndonesian(shiftStartTime) : '-'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Modal Awal Laci:</span>
              <span className="text-white">{formatCurrency(floatAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Penjualan Tunai Sistem:</span>
              <span className="text-emerald-400 font-bold">
                +{formatCurrency(systemCashSales)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
              <span className="text-white">Total Seharusnya Ada di Laci:</span>
              <span className="text-amber-400">{formatCurrency(expectedTotalCash)}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Hitung Uang Fisik Aktual di Laci (Rp)
            </label>
            <Input
              type="number"
              value={physicalCashInput}
              onChange={(e) => setPhysicalCashInput(e.target.value)}
              placeholder="Masukkan total hitungan fisik"
              className="text-base font-bold text-white"
              required
              autoFocus
            />
          </div>

          {/* Discrepancy indicator */}
          {physicalCashInput !== '' && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                discrepancy === 0
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : discrepancy < 0
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {discrepancy === 0 ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                )}
                <span>
                  {discrepancy === 0
                    ? 'Laci Seimbang (Uang Fisik Cocok)'
                    : discrepancy < 0
                      ? 'Selisih Kurang (Uang Hilang/Kurang)'
                      : 'Selisih Lebih (Kelebihan Uang Fisik)'}
                </span>
              </div>
              <span className="font-mono font-bold text-sm">
                {discrepancy >= 0 ? '+' : ''}
                {formatCurrency(discrepancy)}
              </span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Tutup Modal
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={physicalCashInput === ''}
              className="flex-2 font-bold"
            >
              Selesaikan Z-Report & Tutup Shift
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
