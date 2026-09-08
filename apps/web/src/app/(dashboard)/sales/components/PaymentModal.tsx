'use client';

import * as React from 'react';
import { Banknote, QrCode, CreditCard, Clock } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { formatCurrency } from '../../../../lib/utils';
import { PaymentMethod } from '@ai-coo/shared-types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirm: (data: {
    paymentMethod: PaymentMethod;
    paidAmount: number;
    changeAmount: number;
    notes: string;
  }) => Promise<void>;
  loading?: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  onConfirm,
  loading = false,
}: PaymentModalProps) {
  const [method, setMethod] = React.useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashInput, setCashInput] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');

  // Reset inputs when opened
  React.useEffect(() => {
    if (isOpen) {
      setMethod(PaymentMethod.CASH);
      setCashInput(totalAmount.toString());
      setNotes('');
    }
  }, [isOpen, totalAmount]);

  const numericPaid = parseFloat(cashInput) || 0;
  const changeAmount = Math.max(numericPaid - totalAmount, 0);
  const isCashInsufficient = method === PaymentMethod.CASH && numericPaid < totalAmount;

  const paymentMethods = [
    { id: PaymentMethod.CASH, label: 'Tunai', icon: Banknote, desc: 'Uang Fisik' },
    { id: PaymentMethod.QRIS, label: 'QRIS', icon: QrCode, desc: 'GoPay/OVO/BCA' },
    { id: PaymentMethod.TRANSFER, label: 'Transfer', icon: CreditCard, desc: 'Bank Direct' },
    { id: PaymentMethod.KASBON, label: 'Kasbon', icon: Clock, desc: 'Tempo Bayar' },
  ];

  // Quick preset calculation
  const presets = React.useMemo(() => {
    const list = [totalAmount];
    const standardPresets = [20000, 50000, 100000, 200000, 500000];
    for (const p of standardPresets) {
      if (p > totalAmount && !list.includes(p)) {
        list.push(p);
      }
    }
    return list.slice(0, 4);
  }, [totalAmount]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isCashInsufficient) return;

    await onConfirm({
      paymentMethod: method,
      paidAmount: method === PaymentMethod.CASH ? numericPaid : totalAmount,
      changeAmount: method === PaymentMethod.CASH ? changeAmount : 0,
      notes,
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Selesaikan Pembayaran"
      description={`Total tagihan yang harus dibayar: ${formatCurrency(totalAmount)}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Method Selector Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pilih Metode Bayar
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {paymentMethods.map((pm) => {
              const active = method === pm.id;
              const Icon = pm.icon;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setMethod(pm.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    active
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-bold leading-none">{pm.label}</span>
                  <span className="text-[9px] text-slate-500">{pm.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cash Calculator (Only for CASH) */}
        {method === PaymentMethod.CASH && (
          <div className="space-y-3 rounded-2xl bg-slate-950/60 border border-slate-800 p-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Uang Diterima dari Pelanggan (Rp)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={cashInput}
                onChange={(e) => setCashInput(e.target.value)}
                className="text-base font-bold text-amber-400"
                autoFocus
              />
            </div>

            {/* Quick Cash Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCashInput(preset.toString())}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    numericPaid === preset
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {preset === totalAmount ? 'Uang Pas' : formatCurrency(preset)}
                </button>
              ))}
            </div>

            {/* Change calculation */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Kembalian:</span>
              <span
                className={`text-base font-black ${
                  isCashInsufficient ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isCashInsufficient ? 'Uang Kurang' : formatCurrency(changeAmount)}
              </span>
            </div>
          </div>
        )}

        {/* QRIS / Transfer Instructions */}
        {(method === PaymentMethod.QRIS || method === PaymentMethod.TRANSFER) && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
            <p className="text-xs font-bold text-white">
              {method === PaymentMethod.QRIS
                ? 'Tunjukkan QRIS Statis Toko ke Pelanggan'
                : 'Minta Pelanggan Transfer ke Rekening Toko'}
            </p>
            <p className="text-[11px] text-slate-400">
              Pastikan dana sebesar <strong className="text-amber-400">{formatCurrency(totalAmount)}</strong> telah masuk sebelum konfirmasi.
            </p>
          </div>
        )}

        {/* Kasbon Warning */}
        {method === PaymentMethod.KASBON && (
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 space-y-1">
            <p className="font-bold">Transaksi Kasbon / Hutang Usaha</p>
            <p className="text-[11px] text-orange-200/80">
              Pastikan pelanggan sudah terdaftar di CRM agar tagihan kasbon tercatat di profilnya.
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Meja 4 / Tanpa Gula / Titip Kasir"
            className="w-full h-18 rounded-xl border border-slate-700/80 bg-slate-900/60 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={isCashInsufficient || loading}
            className="flex-2 font-bold"
          >
            Konfirmasi & Cetak Struk
          </Button>
        </div>
      </form>
    </Modal>
  );
}
