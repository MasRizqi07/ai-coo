'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  MessageCircle,
  X,
  CheckCircle2,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { formatCurrency, formatDateTimeIndonesian, modalBackdropVariants, modalDialogVariants } from '../../../../lib/utils';
import { PaymentMethod } from '@ai-coo/shared-types';

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ReceiptData {
  id: string;
  storeName?: string;
  cashierName?: string;
  date: Date | string;
  customerName?: string;
  customerPhone?: string;
  items: ReceiptItem[];
  total: number;
  paymentMethod: PaymentMethod | string;
  paidAmount?: number;
  changeAmount?: number;
  notes?: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export function ReceiptModal({ isOpen, onClose, receipt }: ReceiptModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!receipt) return null;

  const serialId = receipt.id ? `#TRX-${receipt.id.slice(0, 8).toUpperCase()}` : '#TRX-000000';
  const cleanPhone = (receipt.customerPhone || '').replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

  // Build WhatsApp invoice text template
  const itemsText = receipt.items
    .map((it) => `• ${it.name} x${it.quantity} = ${formatCurrency(it.subtotal)}`)
    .join('\n');
  const waMessage = encodeURIComponent(
    `*STRUK DIGITAL ${receipt.storeName || 'TOKO'}*\n` +
      `No. Transaksi: ${serialId}\n` +
      `Waktu: ${formatDateTimeIndonesian(receipt.date)}\n` +
      `Pelanggan: ${receipt.customerName || 'Pelanggan Umum'}\n` +
      `--------------------------------\n` +
      `${itemsText}\n` +
      `--------------------------------\n` +
      `*TOTAL: ${formatCurrency(receipt.total)}*\n` +
      `Metode Bayar: ${receipt.paymentMethod}\n` +
      (receipt.paidAmount ? `Dibayar: ${formatCurrency(receipt.paidAmount)}\n` : '') +
      (receipt.changeAmount ? `Kembalian: ${formatCurrency(receipt.changeAmount)}\n` : '') +
      `\nTerima kasih telah berbelanja bersama kami!`,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:m-0">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md print:hidden"
          />

          {/* Receipt Dialog Body */}
          <motion.div
            variants={modalDialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl z-10 my-auto text-slate-100 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg print:hidden cursor-pointer"
              aria-label="Tutup Struk"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Thermal Receipt Paper Container */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-inner font-mono text-xs print:border-none print:p-0 print:bg-white print:text-black relative overflow-hidden">
              {/* Jagged Edge Top Simulation */}
              <div className="flex justify-between gap-1 mb-3 opacity-40 select-none print:hidden">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-slate-800 shrink-0" />
                ))}
              </div>

              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-dashed border-slate-800 print:border-slate-400">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-2 print:hidden">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-white tracking-wider uppercase print:text-black">
                  {receipt.storeName || 'AI COO POS'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 print:text-gray-600">
                  Struk Resmi Transaksi
                </p>
                <div className="mt-2 text-[10px] text-slate-400 space-y-0.5 print:text-gray-600">
                  <p>{serialId}</p>
                  <p>{formatDateTimeIndonesian(receipt.date)}</p>
                  {receipt.cashierName && <p>Kasir: {receipt.cashierName}</p>}
                </div>
              </div>

              {/* Customer & Payment Info */}
              <div className="py-2.5 space-y-1 border-b border-dashed border-slate-800 text-[11px] print:border-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600">Pelanggan:</span>
                  <span className="text-white font-semibold print:text-black">
                    {receipt.customerName || 'Walk-in'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600">Metode:</span>
                  <span className="text-amber-400 font-bold print:text-black">
                    {receipt.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Itemized List */}
              <div className="py-3 space-y-2 border-b border-dashed border-slate-800 print:border-slate-400">
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-semibold text-slate-200 print:text-black">
                      <span className="truncate max-w-[180px]">{item.name}</span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 print:text-gray-500">
                      {item.quantity} x {formatCurrency(item.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Section */}
              <div className="pt-3 pb-2 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-sm text-white print:text-black">
                  <span>TOTAL:</span>
                  <span className="text-amber-400 print:text-black">
                    {formatCurrency(receipt.total)}
                  </span>
                </div>

                {receipt.paidAmount !== undefined && receipt.paidAmount > 0 && (
                  <div className="flex justify-between text-slate-400 print:text-gray-600 text-[11px]">
                    <span>Tunai Diterima:</span>
                    <span>{formatCurrency(receipt.paidAmount)}</span>
                  </div>
                )}

                {receipt.changeAmount !== undefined && (
                  <div className="flex justify-between font-semibold text-slate-200 print:text-black text-[11px]">
                    <span>Kembalian:</span>
                    <span className="text-emerald-400 print:text-black">
                      {formatCurrency(receipt.changeAmount)}
                    </span>
                  </div>
                )}

                {receipt.notes && (
                  <div className="pt-2 text-[10px] text-slate-500 italic border-t border-slate-900">
                    Catatan: {receipt.notes}
                  </div>
                )}
              </div>

              {/* Footer Thank-you Note */}
              <div className="text-center pt-3 border-t border-dashed border-slate-800 text-[10px] text-slate-500 print:border-slate-400 print:text-gray-600">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p className="mt-0.5">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
              </div>

              {/* Jagged Edge Bottom Simulation */}
              <div className="flex justify-between gap-1 mt-4 opacity-40 select-none print:hidden">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-slate-800 shrink-0" />
                ))}
              </div>
            </div>

            {/* Action Buttons (Hidden on Print) */}
            <div className="mt-4 space-y-2 print:hidden">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 text-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Cetak Struk</span>
                </Button>

                {waPhone ? (
                  <a
                    href={`https://wa.me/${waPhone}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-3 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-3 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Share WA</span>
                  </a>
                )}
              </div>

              <Button
                onClick={onClose}
                variant="primary"
                size="default"
                className="w-full font-bold text-xs"
              >
                <ReceiptIcon className="h-4 w-4" />
                <span>Transaksi Baru (ESC)</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
