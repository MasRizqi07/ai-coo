'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  Receipt,
  Trash2,
  UserPlus,
  ShoppingBag,
  History,
  Wallet,
  AlertCircle,
  Package,
} from 'lucide-react';

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal, ReceiptData } from './components/ReceiptModal';
import { ShiftModal } from './components/ShiftModal';
import { QuickCustomerModal } from './components/QuickCustomerModal';
import { createSaleAction } from '../../actions/sales';
import { formatCurrency, cn } from '../../../lib/utils';
import { toast } from 'sonner';
import { Customer, Product, Sale, PaymentMethod } from '@ai-coo/shared-types';

interface SalesClientViewProps {
  initialSales: Sale[];
  customers: Customer[];
  products: Product[];
  storeName: string;
  cashierName: string;
}

export default function SalesClientView({
  initialSales,
  customers,
  products,
  storeName,
  cashierName,
}: SalesClientViewProps) {
  // Search and filter state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Semua');

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Cart State
  const [cartItems, setCartItems] = React.useState<{ productId: string; quantity: number }[]>([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>('');

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = React.useState(false);
  const [isShiftOpen, setIsShiftOpen] = React.useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [completedReceipt, setCompletedReceipt] = React.useState<ReceiptData | null>(null);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);

  // Extract unique categories
  const categories = React.useMemo(() => {
    const cats = Array.from(
      new Set(
        products
          .map((p) => p.category?.trim())
          .filter(Boolean) as string[],
      ),
    );
    return ['Semua', ...cats];
  }, [products]);

  const getProduct = React.useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );

  // Cart Calculations
  const totalAmount = React.useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const prod = getProduct(item.productId);
      return sum + (prod ? Number(prod.price) * item.quantity : 0);
    }, 0);
  }, [cartItems, getProduct]);

  // Total cash sales today for Z-Report
  const todayCashSales = React.useMemo(() => {
    return initialSales
      .filter((s) => s.paymentMethod === PaymentMethod.CASH)
      .reduce((sum, s) => sum + Number(s.amount || 0), 0);
  }, [initialSales]);

  // Add to cart handler
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

  // Adjust quantity
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

  // Remove item
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Spacebar / Enter shortcut for opening checkout
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if ((e.code === 'Space' || e.code === 'Enter') && cartItems.length > 0 && !isPaymentOpen && !isReceiptOpen) {
        e.preventDefault();
        setIsPaymentOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems.length, isPaymentOpen, isReceiptOpen]);

  // Payment Confirmation Handler
  async function handleConfirmPayment(paymentData: {
    paymentMethod: PaymentMethod;
    paidAmount: number;
    changeAmount: number;
    notes: string;
  }) {
    setCheckoutLoading(true);

    const formData = new FormData();
    if (selectedCustomer) formData.append('customerId', selectedCustomer);
    formData.append('paymentMethod', paymentData.paymentMethod);
    formData.append('paidAmount', paymentData.paidAmount.toString());
    formData.append('changeAmount', paymentData.changeAmount.toString());
    if (paymentData.notes) formData.append('notes', paymentData.notes);

    const res = await createSaleAction(formData, cartItems);

    if (res.success && res.sale) {
      toast.success('Transaksi berhasil dicatat!');

      const customerObj = customers.find((c) => c.id === selectedCustomer);
      const receiptItems = cartItems.map((item) => {
        const prod = getProduct(item.productId);
        const price = prod ? Number(prod.price) : 0;
        return {
          name: prod?.name || 'Produk',
          quantity: item.quantity,
          price,
          subtotal: price * item.quantity,
        };
      });

      setCompletedReceipt({
        id: res.sale.id,
        storeName,
        cashierName,
        date: new Date(),
        customerName: customerObj?.name || 'Pelanggan Umum (Walk-in)',
        customerPhone: customerObj?.phone,
        items: receiptItems,
        total: totalAmount,
        paymentMethod: paymentData.paymentMethod,
        paidAmount: paymentData.paidAmount,
        changeAmount: paymentData.changeAmount,
        notes: paymentData.notes,
      });

      // Close payment modal and open receipt modal
      setIsPaymentOpen(false);
      setIsReceiptOpen(true);

      // Reset cart
      setCartItems([]);
      setSelectedCustomer('');
    } else {
      toast.error(res.error || 'Gagal memproses transaksi penjualan');
    }

    setCheckoutLoading(false);
  }

  // Filtered products
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));

      const matchCategory =
        selectedCategory === 'Semua' || (p.category || 'Umum') === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [products, debouncedSearch, selectedCategory]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Header & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Kasir & Penjualan Cepat
            </h2>
            <span className="hidden sm:inline-flex rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              High-Velocity POS
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Tekan kartu produk untuk tambah ke keranjang, atau gunakan shortcut{' '}
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-amber-400 rounded border border-slate-700">
              [Spasi]
            </kbd>{' '}
            untuk checkout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Shift Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShiftOpen(true)}
            className="gap-2 text-xs"
          >
            <Wallet className="h-4 w-4 text-amber-400" />
            <span>Laci Kasir / Shift</span>
          </Button>

          {/* History Link */}
          <Link href="/sales/history">
            <Button variant="secondary" size="sm" className="gap-2 text-xs">
              <History className="h-4 w-4 text-slate-300" />
              <span>Riwayat Transaksi</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Split Screen Layout (65% Product Grid | 35% Active Checkout Basket) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Selection & Catalog (8 cols = ~66%) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Category Chips */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama produk, SKU, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-slate-900/60 border-slate-800 text-sm rounded-xl"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none cursor-pointer',
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {products.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-slate-800">
              <EmptyState
                icon={Package}
                title="Katalog Produk Kosong"
                description="Anda belum memiliki produk terdaftar. Tambahkan produk pertama di menu Inventaris untuk memulai kasir."
                actionLabel="Tambah Produk Baru"
                actionHref="/products"
              />
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-slate-800">
              <div className="py-6 space-y-2">
                <AlertCircle className="mx-auto h-8 w-8 text-slate-500" />
                <p className="text-sm font-semibold text-slate-300">
                  Tidak ditemukan produk dengan kata kunci &quot;{searchQuery}&quot;
                </p>
                <p className="text-xs text-slate-500">
                  Coba gunakan kata kunci lain atau reset filter kategori.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const inCart = cartItems.find((item) => item.productId === p.id);
                const isOutOfStock = p.stockQuantity <= 0;
                const isCritical = p.stockQuantity > 0 && p.stockQuantity <= 5;

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p.id)}
                    className={cn(
                      'relative p-4 rounded-2xl border transition-all duration-150 select-none flex flex-col justify-between group cursor-pointer',
                      isOutOfStock
                        ? 'bg-slate-900/30 border-slate-800/60 opacity-60 cursor-not-allowed'
                        : inCart
                          ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900/50 border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-800/60 active:scale-[0.98]',
                    )}
                  >
                    {/* Out of Stock Overlay Badge */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 rounded-2xl bg-slate-950/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <span className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-400">
                          Stok Habis
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono text-slate-500 truncate">
                          {p.sku || 'SKU-AUTO'}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                          {p.category || 'Umum'}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                        {p.name}
                      </h4>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400">Harga</p>
                        <p className="text-xs sm:text-sm font-black text-amber-400">
                          {formatCurrency(p.price)}
                        </p>
                      </div>

                      {/* Stock Badge */}
                      <Badge
                        variant={isOutOfStock ? 'destructive' : isCritical ? 'warning' : 'success'}
                        dot={isCritical}
                        pulsing={isCritical}
                        className="text-[10px] px-2 py-0.2"
                      >
                        {p.stockQuantity} unit
                      </Badge>
                    </div>

                    {/* Cart counter badge */}
                    {inCart && (
                      <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-slate-950">
                        {inCart.quantity}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Checkout Basket (4 cols = ~34%) */}
        <div className="lg:col-span-4">
          <Card className="rounded-3xl border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl overflow-hidden sticky top-4">
            {/* Basket Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Keranjang Belanja</h3>
                  <p className="text-[11px] text-slate-400">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item terpilih
                  </p>
                </div>
              </div>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCartItems([])}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold hover:underline cursor-pointer"
                >
                  Kosongkan
                </button>
              )}
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* Customer Selector with + Pelanggan Baru Trigger */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pelanggan
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    <UserPlus className="h-3 w-3" />
                    <span>+ Pelanggan Baru</span>
                  </button>
                </div>

                <select
                  aria-label="Pilih Pelanggan Transaksi"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors cursor-pointer"
                >
                  <option value="">Pelanggan Umum (Walk-in)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cart Item Rows */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Daftar Pesanan
                </label>

                {cartItems.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                    <ShoppingBag className="mx-auto h-8 w-8 text-slate-600" />
                    <p className="text-xs font-medium">Keranjang masih kosong.</p>
                    <p className="text-[11px] text-slate-600">
                      Klik produk di sebelah kiri untuk mulai transaksi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const prod = getProduct(item.productId);
                      const unitPrice = prod ? Number(prod.price) : 0;
                      const lineSubtotal = unitPrice * item.quantity;

                      return (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{prod?.name}</p>
                            <p className="text-[11px] font-mono text-amber-400 font-semibold mt-0.5">
                              {formatCurrency(lineSubtotal)}
                            </p>
                          </div>

                          {/* Stepper (- 1 +) */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center border border-slate-700/80 rounded-xl overflow-hidden bg-slate-900">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, -1)}
                                className="h-8 w-8 flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-black text-white font-mono">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, 1)}
                                className="h-8 w-8 flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId)}
                              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                              aria-label="Hapus Item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Total Calculation & Checkout Button */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-amber-400 tracking-tight">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={cartItems.length === 0}
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full h-13 text-sm sm:text-base font-black shadow-xl shadow-amber-500/25 flex items-center justify-between px-5"
                >
                  <span>Bayar Sekarang</span>
                  <div className="flex items-center gap-2">
                    <span>{formatCurrency(totalAmount)}</span>
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-950/40 text-amber-300 rounded">
                      Enter ↵
                    </kbd>
                  </div>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={totalAmount}
        onConfirm={handleConfirmPayment}
        loading={checkoutLoading}
      />

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false);
          setCompletedReceipt(null);
        }}
        receipt={completedReceipt}
      />

      {/* Shift / Cash Drawer Modal */}
      <ShiftModal
        isOpen={isShiftOpen}
        onClose={() => setIsShiftOpen(false)}
        systemCashSales={todayCashSales}
      />

      {/* Quick Customer Modal */}
      <QuickCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
    </div>
  );
}
