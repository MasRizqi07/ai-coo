'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Search,
  Plus,
  Receipt,
  CheckCircle2,
  Printer,
  MessageCircle,
  X,
  CreditCard,
  Banknote,
  QrCode,
  Trash2,
} from 'lucide-react';
import { createSaleAction } from '../../actions/sales';
import { toast } from 'sonner';
import { Customer, Product, Sale, PaymentMethod } from '@ai-coo/shared-types';

interface CompletedSaleItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface CompletedSale extends Omit<Partial<Sale>, 'paymentMethod'> {
  customerName: string;
  customerPhone?: string;
  total: number;
  paid: number;
  change: number;
  paymentMethod: PaymentMethod | 'CASH' | 'QRIS' | 'TRANSFER';
  itemsDetailed: CompletedSaleItem[];
}

interface SalesClientViewProps {
  initialSales: Sale[];
  customers: Customer[];
  products: Product[];
}

export default function SalesClientView({
  initialSales,
  customers,
  products,
}: SalesClientViewProps) {
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Cart & Checkout State
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>('');
  const [cartItems, setCartItems] = React.useState<{ productId: string; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = React.useState<'CASH' | 'QRIS' | 'TRANSFER'>('CASH');
  const [paidAmount, setPaidAmount] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');

  // Completed Receipt Modal State
  const [completedSale, setCompletedSale] = React.useState<CompletedSale | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const totalAmount = cartItems.reduce((sum, item) => {
    const prod = getProduct(item.productId);
    return sum + (prod ? Number(prod.price) * item.quantity : 0);
  }, 0);

  const numericPaidAmount = parseFloat(paidAmount) || 0;
  const changeAmount = Math.max(numericPaidAmount - totalAmount, 0);

  const addToCart = (productId: string) => {
    const product = getProduct(productId);
    if (!product || product.stockQuantity <= 0) {
      toast.error('Produk kehabisan stok');
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          toast.error(`Stok maksimal ${product.name} tercapai (${product.stockQuantity})`);
          return prev;
        }
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = getProduct(productId);
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (delta > 0 && product && newQty > product.stockQuantity) {
              toast.error(`Stok maksimal adalah ${product.stockQuantity}`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Pilih minimal satu produk untuk transaksi');
      return;
    }

    if (paymentMethod === 'CASH' && numericPaidAmount < totalAmount) {
      toast.error('Uang tunai yang dibayarkan kurang dari total belanja');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (selectedCustomer) formData.append('customerId', selectedCustomer);
    formData.append('paymentMethod', paymentMethod);
    formData.append('paidAmount', (paymentMethod === 'CASH' ? numericPaidAmount : totalAmount).toString());
    formData.append('changeAmount', (paymentMethod === 'CASH' ? changeAmount : 0).toString());
    if (notes) formData.append('notes', notes);

    const res = await createSaleAction(formData, cartItems);

    if (res.success) {
      toast.success('Transaksi berhasil diproses!');
      const customerObj = customers.find((c) => c.id === selectedCustomer);
      setCompletedSale({
        ...res.sale,
        customerName: customerObj?.name || 'Pelanggan Umum (Walk-in)',
        customerPhone: customerObj?.phone,
        total: totalAmount,
        paid: paymentMethod === 'CASH' ? numericPaidAmount : totalAmount,
        change: paymentMethod === 'CASH' ? changeAmount : 0,
        paymentMethod,
        itemsDetailed: cartItems.map((item) => {
          const p = getProduct(item.productId);
          return {
            name: p?.name || 'Produk',
            quantity: item.quantity,
            price: p ? Number(p.price) : 0,
            subtotal: p ? Number(p.price) * item.quantity : 0,
          };
        }),
      });

      setShowCheckout(false);
      setCartItems([]);
      setSelectedCustomer('');
      setPaidAmount('');
      setNotes('');
    } else {
      toast.error(res.error || 'Gagal memproses transaksi');
    }
    setLoading(false);
  }

  // Filtered sales ledger
  const filteredSales = initialSales.filter((s) => {
    const custName = s.customer?.name?.toLowerCase() || 'walk-in';
    return custName.includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Kasir & Transaksi Penjualan
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Catat pesanan pelanggan, hitung pembayaran otomatis, dan terbitkan struk digital.
          </p>
        </div>
        <Button
          className="gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 shadow-lg shadow-amber-500/20"
          onClick={() => setShowCheckout(!showCheckout)}
        >
          <Plus className="w-4 h-4 text-slate-950" />
          {showCheckout ? 'Tutup Kasir' : 'Buka Kasir Baru'}
        </Button>
      </div>

      {/* POS Checkout Drawer / Panel */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 border-amber-500/30 bg-slate-900/90 backdrop-blur-2xl shadow-2xl rounded-3xl">
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Point of Sale (POS) Kasir</h3>
                      <p className="text-xs text-slate-400">Pilih produk dan tentukan pembayaran</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                  {/* Left Column: Product Selection Grid (7 cols) */}
                  <div className="md:col-span-7 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Pilih Produk Tersedia
                    </h4>
                    {products.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                        Tidak ada produk aktif atau semua stok habis. Tambahkan produk di menu Inventaris.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-105 overflow-y-auto pr-1">
                        {products.map((p) => {
                          const inCart = cartItems.find((ci) => ci.productId === p.id);
                          return (
                            <div
                              key={p.id}
                              onClick={() => addToCart(p.id)}
                              className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 select-none flex flex-col justify-between ${
                                inCart
                                  ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/5'
                                  : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/80'
                              }`}
                            >
                              <div>
                                <p className="font-bold text-white text-sm line-clamp-1">{p.name}</p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {p.category || 'Umum'}
                                </span>
                              </div>
                              <div className="mt-3 flex items-end justify-between">
                                <p className="text-xs font-black text-amber-400">
                                  {formatCurrency(p.price)}
                                </p>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                                  Sisa: {p.stockQuantity}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Cart, Customer, Payment (5 cols) */}
                  <div className="md:col-span-5 space-y-4 flex flex-col justify-between bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                    <div className="space-y-4">
                      {/* Customer Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Pelanggan (Opsional)
                        </label>
                        <select
                          aria-label="Pilih Pelanggan"
                          value={selectedCustomer}
                          onChange={(e) => setSelectedCustomer(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Pelanggan Umum (Walk-in)</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} {c.phone ? `(${c.phone})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Cart List */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Keranjang ({cartItems.length} item)
                          </label>
                          {cartItems.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setCartItems([])}
                              className="text-[10px] text-red-400 hover:underline"
                            >
                              Kosongkan
                            </button>
                          )}
                        </div>

                        {cartItems.length === 0 ? (
                          <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                            Keranjang masih kosong. Klik produk di sebelah kiri untuk menambahkan.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {cartItems.map((item) => {
                              const p = getProduct(item.productId);
                              const sub = (p ? Number(p.price) : 0) * item.quantity;
                              return (
                                <div
                                  key={item.productId}
                                  className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-white truncate">{p?.name}</p>
                                    <p className="text-[10px] text-amber-400 font-medium">
                                      {formatCurrency(sub)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-800">
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(item.productId, -1)}
                                        className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-700"
                                      >
                                        -
                                      </button>
                                      <span className="px-2 text-xs font-bold text-white">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(item.productId, 1)}
                                        className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-700"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.productId)}
                                      className="text-slate-500 hover:text-red-400 p-1"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Payment Method Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Metode Pembayaran
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(
                            [
                              { id: 'CASH', label: 'Tunai', icon: Banknote },
                              { id: 'QRIS', label: 'QRIS', icon: QrCode },
                              { id: 'TRANSFER', label: 'Transfer', icon: CreditCard },
                            ] as const
                          ).map((pm) => (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setPaymentMethod(pm.id)}
                              className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                                paymentMethod === pm.id
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <pm.icon className="h-4 w-4" />
                              {pm.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cash Calculator if CASH is selected */}
                      {paymentMethod === 'CASH' && (
                        <div className="space-y-2 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                          <label className="text-[11px] font-bold text-slate-300">
                            Uang Diterima (Rp)
                          </label>
                          <Input
                            type="number"
                            placeholder="Contoh: 50000"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                            className="h-9 text-sm font-bold bg-slate-950 border-slate-700"
                          />
                          {/* Quick Cash Buttons */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {[totalAmount, 10000, 20000, 50000, 100000].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setPaidAmount(amt.toString())}
                                className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300"
                              >
                                {amt === totalAmount ? 'Uang Pas' : formatCurrency(amt)}
                              </button>
                            ))}
                          </div>

                          {numericPaidAmount > 0 && (
                            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                              <span className="text-slate-400">Kembalian:</span>
                              <span
                                className={`font-bold ${
                                  numericPaidAmount >= totalAmount
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                                }`}
                              >
                                {numericPaidAmount >= totalAmount
                                  ? formatCurrency(changeAmount)
                                  : 'Uang Kurang'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Total & Submit Button */}
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-slate-400">Total Tagihan</span>
                        <span className="text-xl font-black text-amber-400">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading || cartItems.length === 0}
                        className="w-full h-11 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 shadow-lg shadow-amber-500/20"
                      >
                        {loading ? 'Memproses...' : 'Selesaikan Transaksi (Cetak Struk)'}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction History Ledger */}
      <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Riwayat Transaksi Penjualan</h3>
            <p className="text-xs text-slate-400">Daftar semua transaksi yang berhasil dicatat sistem</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Cari pelanggan / invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-slate-950 border-slate-800 text-xs rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Metode Bayar</th>
                <th className="px-6 py-4">Item Terjual</th>
                <th className="px-6 py-4 text-right">Total Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-xs">
                    Belum ada riwayat transaksi. Buka kasir baru untuk memulai!
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-300 text-xs font-mono">
                      {new Date(sale.date).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {sale.customer?.name || (
                        <span className="text-slate-500 italic">Walk-in</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {sale.paymentMethod || 'CASH'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {sale.items?.length || 0} barang
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-400">
                      {formatCurrency(sale.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Digital Receipt Modal */}
      <AnimatePresence>
        {completedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setCompletedSale(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-dashed border-slate-800">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Struk Penjualan Digital</h4>
                <p className="text-xs text-slate-400">AI COO POS System</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  ID: {completedSale.id?.slice(0, 8)} • {new Date().toLocaleTimeString('id-ID')}
                </p>
              </div>

              {/* Receipt Body */}
              <div className="py-4 space-y-2 border-b border-dashed border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Pelanggan:</span>
                  <span className="text-slate-200 font-semibold">{completedSale.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Pembayaran:</span>
                  <span className="text-amber-400 font-bold">{completedSale.paymentMethod}</span>
                </div>

                <div className="pt-2 space-y-1.5">
                  {completedSale.itemsDetailed?.map((it: CompletedSaleItem, idx: number) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span>
                        {it.name} <span className="text-slate-500">x{it.quantity}</span>
                      </span>
                      <span>{formatCurrency(it.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receipt Totals */}
              <div className="py-3 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-sm text-white">
                  <span>Total Tagihan:</span>
                  <span className="text-amber-400">{formatCurrency(completedSale.total)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dibayar:</span>
                  <span>{formatCurrency(completedSale.paid)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Kembalian:</span>
                  <span className="text-emerald-400">{formatCurrency(completedSale.change)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="w-full gap-2 text-xs h-9"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Struk Fisik
                </Button>

                {completedSale.customerPhone && (
                  <a
                    href={`https://wa.me/${completedSale.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Terima kasih telah berbelanja di toko kami! Total: ${formatCurrency(
                        completedSale.total,
                      )}. Simpan struk ini sebagai bukti pembayaran yang sah.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Kirim Struk via WhatsApp
                  </a>
                )}

                <Button
                  onClick={() => setCompletedSale(null)}
                  className="w-full gap-2 text-xs h-9 bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  Transaksi Selesai
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
