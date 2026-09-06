'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import {
  Search,
  Plus,
  Package,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Tag,
  Boxes,
  X,
} from 'lucide-react';
import {
  createProductAction,
  restockProductAction,
  deleteProductAction,
} from '../../actions/products';
import { toast } from 'sonner';

export default function ProductsClientView({
  initialProducts: products,
}: {
  initialProducts: any[];
}) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Semua');
  const [selectedStatus, setSelectedStatus] = React.useState<'ALL' | 'CRITICAL' | 'LOW' | 'SAFE'>('ALL');

  // Restock Modal State
  const [restockModalProduct, setRestockModalProduct] = React.useState<any | null>(null);
  const [restockQuantity, setRestockQuantity] = React.useState<number>(10);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const getStatus = (stock: number, minLevel: number = 10) => {
    if (stock <= 5) return { label: 'Kritis', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    if (stock <= minLevel) return { label: 'Menipis', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { label: 'Aman', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  };

  // Categories extraction
  const categories = ['Semua', ...Array.from(new Set(products.map((p) => p.category || 'Umum')))];

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createProductAction(formData);

    if (res.success) {
      toast.success('Produk berhasil ditambahkan!');
      setShowAddForm(false);
    } else {
      toast.error(res.error || 'Gagal menambahkan produk');
    }
    setLoading(false);
  }

  async function handleConfirmRestock(e: React.FormEvent) {
    e.preventDefault();
    if (!restockModalProduct || restockQuantity <= 0) return;

    setLoading(true);
    const res = await restockProductAction(restockModalProduct.id, restockQuantity);
    if (res.success) {
      toast.success(`Berhasil menambah +${restockQuantity} unit ke stok ${restockModalProduct.name}!`);
      setRestockModalProduct(null);
      setRestockQuantity(10);
    } else {
      toast.error('Gagal menambah stok produk');
    }
    setLoading(false);
  }

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'Semua' || (p.category || 'Umum') === selectedCategory;

    const minLevel = p.minStockLevel || 10;
    let matchesStatus = true;
    if (selectedStatus === 'CRITICAL') matchesStatus = p.stockQuantity <= 5;
    else if (selectedStatus === 'LOW') matchesStatus = p.stockQuantity > 5 && p.stockQuantity <= minLevel;
    else if (selectedStatus === 'SAFE') matchesStatus = p.stockQuantity > minLevel;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Inventaris & Manajemen Produk
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Pantau ketersediaan stok fisik, atur batas minimal, dan lakukan restock cepat.
          </p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 shadow-lg shadow-amber-500/20"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4 text-slate-950" />
          {showAddForm ? 'Batal Tambah' : 'Tambah Produk Baru'}
        </Button>
      </div>

      {/* Add Product Drawer */}
      {showAddForm && (
        <Card className="p-6 border-amber-500/30 bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-xl">
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-400" />
                Input Data Produk Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                name="name"
                placeholder="Contoh: Kopi Robusta 250g / Semen Tiga Roda"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                name="category"
                placeholder="Contoh: Makanan / Minuman / Sembako"
                defaultValue="Umum"
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sku">Kode SKU / Barcode (Opsional)</Label>
              <Input id="sku" name="sku" placeholder="KPD-001" disabled={loading} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Harga Jual (Rp)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="25000"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stockQuantity">Jumlah Stok Awal</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                placeholder="50"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="minStockLevel">Batas Stok Minimal (Alert Threshold)</Label>
              <Input
                id="minStockLevel"
                name="minStockLevel"
                type="number"
                placeholder="10"
                defaultValue="10"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                {loading ? 'Menyimpan...' : 'Simpan Produk'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Cari produk / SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-slate-900/80 border-slate-800 rounded-xl"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'CRITICAL', label: 'Kritis (≤5)' },
            { id: 'LOW', label: 'Menipis' },
            { id: 'SAFE', label: 'Aman' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedStatus === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Tag className="h-3 w-3" />
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800/80 border-dashed">
          <Boxes className="h-10 w-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-slate-400">Tidak ada produk yang cocok dengan filter</p>
          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan pencarian atau tambahkan produk baru.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const status = getStatus(product.stockQuantity, product.minStockLevel);
            return (
              <Card
                key={product.id}
                className="flex flex-col h-full rounded-2xl group hover:scale-[1.01] hover:border-amber-500/40 transition-all duration-300 bg-slate-900/50 backdrop-blur-xl border-slate-800/80"
              >
                <CardContent className="p-5 flex flex-col h-full gap-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${status.color}`}
                      >
                        {status.label}
                      </span>
                      <button
                        onClick={async () => {
                          if (confirm(`Hapus produk "${product.name}"?`)) {
                            const res = await deleteProductAction(product.id);
                            if (res.success) toast.success('Produk berhasil dihapus');
                            else toast.error('Gagal menghapus produk');
                          }
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Hapus Produk"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                        {product.category || 'Umum'}
                      </span>
                      {product.sku && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {product.sku}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-800/70 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Harga Jual</p>
                      <p className="font-extrabold text-white text-sm">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <div className="text-right flex items-end gap-2.5">
                      <div>
                        <p className="text-[11px] text-slate-400">Sisa Stok</p>
                        <p
                          className={`font-black text-sm ${
                            product.stockQuantity <= 5
                              ? 'text-red-400'
                              : product.stockQuantity <= (product.minStockLevel || 10)
                                ? 'text-amber-400'
                                : 'text-slate-200'
                          }`}
                        >
                          {product.stockQuantity} unit
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRestockModalProduct(product);
                          setRestockQuantity(10);
                        }}
                        className="h-8 px-2.5 text-xs gap-1 border-slate-700 hover:border-amber-500 hover:text-amber-400"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Restock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Interactive Restock Modal */}
      {restockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-white">Restock Produk</h4>
                <p className="text-xs text-slate-400">{restockModalProduct.name}</p>
              </div>
              <button
                onClick={() => setRestockModalProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Stok Saat Ini:</span>
                <span className="font-bold text-white">{restockModalProduct.stockQuantity} unit</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Jumlah Tambahan Unit Restock
                </label>
                <Input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 1)}
                  className="h-10 text-center font-bold text-lg bg-slate-950"
                  required
                />
                <div className="flex gap-2 justify-center pt-1">
                  {[5, 10, 25, 50, 100].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setRestockQuantity(qty)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                        restockQuantity === qty
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      +{qty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRestockModalProduct(null)}
                  className="w-1/2"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Restock'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
