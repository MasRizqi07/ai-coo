'use client';

import * as React from 'react';
import {
  Search,
  Plus,
  Package,
  Trash2,
  RefreshCw,
  Boxes,
  FileSpreadsheet,
} from 'lucide-react';

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import {
  createProductAction,
  restockProductAction,
  deleteProductAction,
} from '../../actions/products';
import { formatCurrency } from '../../../lib/utils';
import { toast } from 'sonner';
import { Product } from '@ai-coo/shared-types';

type StockStatusFilter = 'ALL' | 'CRITICAL' | 'LOW' | 'SAFE';

export default function ProductsClientView({
  initialProducts: products,
}: {
  initialProducts: Product[];
}) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Semua');
  const [statusFilter, setStatusFilter] = React.useState<StockStatusFilter>('ALL');

  // Quick Restock Modal State
  const [restockProduct, setRestockProduct] = React.useState<Product | null>(null);
  const [restockQty, setRestockQty] = React.useState<number>(10);
  const [restockLoading, setRestockLoading] = React.useState(false);

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Categories extraction
  const categories = React.useMemo(() => {
    return ['Semua', ...Array.from(new Set(products.map((p) => p.category || 'Umum')))];
  }, [products]);

  // Counts for tabs
  const criticalCount = products.filter((p) => p.stockQuantity <= 5).length;
  const lowCount = products.filter((p) => p.stockQuantity > 5 && p.stockQuantity <= (p.minStockLevel || 10)).length;
  const safeCount = products.filter((p) => p.stockQuantity > (p.minStockLevel || 10)).length;

  const getStockBadge = (stock: number, minLevel: number = 10) => {
    if (stock <= 5) {
      return (
        <Badge variant="destructive" dot pulsing>
          Kritis ({stock})
        </Badge>
      );
    }
    if (stock <= minLevel) {
      return (
        <Badge variant="warning" dot>
          Menipis ({stock})
        </Badge>
      );
    }
    return (
      <Badge variant="success" dot>
        Aman ({stock})
      </Badge>
    );
  };

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createProductAction(formData);

    if (res.success) {
      toast.success('Produk baru berhasil ditambahkan ke inventaris!');
      setShowAddModal(false);
    } else {
      toast.error(res.error || 'Gagal menambahkan produk');
    }
    setLoading(false);
  }

  async function handleConfirmRestock(e: React.FormEvent) {
    e.preventDefault();
    if (!restockProduct || restockQty <= 0) return;

    setRestockLoading(true);
    const res = await restockProductAction(restockProduct.id, restockQty);
    if (res.success) {
      toast.success(
        `Berhasil menambah +${restockQty} unit ke stok ${restockProduct.name}!`,
      );
      setRestockProduct(null);
      setRestockQty(10);
    } else {
      toast.error(res.error || 'Gagal menambah stok produk');
    }
    setRestockLoading(false);
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return;
    setDeleteLoading(true);
    const res = await deleteProductAction(productToDelete.id);
    if (res.success) {
      toast.success(`Produk "${productToDelete.name}" berhasil dihapus.`);
      setProductToDelete(null);
    } else {
      toast.error(res.error || 'Gagal menghapus produk');
    }
    setDeleteLoading(false);
  }

  // Quick CSV export
  function handleExportCsv() {
    if (products.length === 0) {
      toast.error('Tidak ada produk untuk diekspor');
      return;
    }

    const headers = ['SKU', 'Nama Produk', 'Kategori', 'Harga Jual (IDR)', 'Stok Saat Ini', 'Ambang Batas Min', 'Status'];
    const rows = products.map((p) => {
      const minLevel = p.minStockLevel || 10;
      const statusStr = p.stockQuantity <= 5 ? 'Kritis' : p.stockQuantity <= minLevel ? 'Menipis' : 'Aman';
      return [
        p.sku || `SKU-${p.id.slice(0, 6)}`,
        `"${p.name}"`,
        `"${p.category || 'Umum'}"`,
        p.price,
        p.stockQuantity,
        minLevel,
        statusStr,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Katalog_Inventaris_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Katalog produk berhasil diekspor ke CSV!');
  }

  // Filtered products list
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'Semua' || (p.category || 'Umum') === selectedCategory;

      const minLevel = p.minStockLevel || 10;
      let matchesStatus = true;
      if (statusFilter === 'CRITICAL') matchesStatus = p.stockQuantity <= 5;
      else if (statusFilter === 'LOW') matchesStatus = p.stockQuantity > 5 && p.stockQuantity <= minLevel;
      else if (statusFilter === 'SAFE') matchesStatus = p.stockQuantity > minLevel;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Inventaris & Manajemen Produk
            </h2>
            <span className="hidden sm:inline-flex rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700">
              {products.length} SKU Aktif
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Pantau stok fisik secara real-time, lakukan restock satu-klik, dan atur ambang batas peringatan AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-2 text-xs">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Ekspor CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-1.5 text-xs font-bold shadow-lg shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>+ Tambah Produk Baru</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs Bar (Semua, Kritis, Menipis, Aman) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-2 ${
            statusFilter === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <span>Semua Produk</span>
          <span className="px-1.5 py-0.2 rounded-md bg-slate-950/40 text-[10px]">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('CRITICAL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-2 ${
            statusFilter === 'CRITICAL'
              ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
              : 'bg-slate-900/60 border border-slate-800 text-red-400 hover:border-red-500/40'
          }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          <span>Kritis (≤5)</span>
          <span className="px-1.5 py-0.2 rounded-md bg-red-500/20 text-[10px]">
            {criticalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('LOW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-2 ${
            statusFilter === 'LOW'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/60 border border-slate-800 text-amber-400 hover:border-amber-500/40'
          }`}
        >
          <span>Menipis</span>
          <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-[10px]">
            {lowCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('SAFE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-2 ${
            statusFilter === 'SAFE'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900/60 border border-slate-800 text-emerald-400 hover:border-emerald-500/40'
          }`}
        >
          <span>Stok Aman</span>
          <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-[10px]">
            {safeCount}
          </span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama produk, SKU, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-950/70 border-slate-800 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                    : 'bg-slate-950/50 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Inventory Catalog Table */}
      <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Produk & SKU</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Harga Jual</th>
                <th className="px-5 py-3.5">Sisa Stok</th>
                <th className="px-5 py-3.5">Batas Min</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <EmptyState
                      icon={Package}
                      title="Tidak Ada Produk Ditemukan"
                      description="Tidak ada data produk yang cocok dengan kriteria filter saat ini."
                      actionLabel={products.length === 0 ? 'Tambah Produk Pertama' : 'Reset Filter'}
                      onAction={() => {
                        setSelectedCategory('Semua');
                        setStatusFilter('ALL');
                        setSearchQuery('');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const minLevel = p.minStockLevel || 10;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 shrink-0">
                            <Boxes className="h-4.5 w-4.5 text-amber-400/80" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs sm:text-sm">{p.name}</p>
                            <p className="text-[10px] font-mono text-slate-500">
                              {p.sku || `SKU-${p.id.slice(0, 6)}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-300">
                        <span className="bg-slate-800/60 px-2 py-0.5 rounded text-[11px] border border-slate-700/60">
                          {p.category || 'Umum'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-amber-400 text-xs sm:text-sm font-mono">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="px-5 py-4 font-bold text-white font-mono text-sm">
                        {p.stockQuantity}{' '}
                        <span className="text-[10px] font-normal text-slate-400">unit</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                        {minLevel} unit
                      </td>
                      <td className="px-5 py-4">{getStockBadge(p.stockQuantity, minLevel)}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setRestockProduct(p);
                              setRestockQty(10);
                            }}
                            className="h-8 px-2.5 text-xs font-bold gap-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Restock</span>
                          </Button>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Hapus Produk"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Quick Restock Modal */}
      <Modal
        isOpen={Boolean(restockProduct)}
        onClose={() => setRestockProduct(null)}
        title="Restock Produk Instan"
        description={
          restockProduct
            ? `Tambahkan jumlah unit fisik untuk "${restockProduct.name}" (Sisa saat ini: ${restockProduct.stockQuantity} unit).`
            : ''
        }
        maxWidth="sm"
      >
        {restockProduct && (
          <form onSubmit={handleConfirmRestock} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Nama Produk:</span>
                <span className="font-bold text-white">{restockProduct.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Stok Saat Ini:</span>
                <span className="font-bold text-amber-400">{restockProduct.stockQuantity} unit</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-slate-400">Total Setelah Restock:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  {restockProduct.stockQuantity + restockQty} unit
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restockQty" required>
                Jumlah Unit Tambahan
              </Label>
              <Input
                id="restockQty"
                type="number"
                min={1}
                value={restockQty}
                onChange={(e) => setRestockQty(parseInt(e.target.value, 10) || 0)}
                className="text-base font-black text-amber-400"
                required
                autoFocus
              />

              {/* Quick preset chips */}
              <div className="flex gap-1.5 pt-1">
                {[10, 25, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRestockQty(preset)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                      restockQty === preset
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRestockProduct(null)}
                disabled={restockLoading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={restockLoading}
                className="flex-2 font-bold"
              >
                Simpan Penambahan
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Produk Baru ke Inventaris"
        description="Masukkan rincian produk, harga jual Rupiah, dan kuantitas stok awal."
        maxWidth="md"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" required>
              Nama Produk / Barang
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Contoh: Kopi Susu Gula Aren"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="sku">Kode SKU (Opsional)</Label>
              <Input id="sku" name="sku" placeholder="KOPI-001" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" name="category" placeholder="Minuman / Makanan / Retail" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price" required>
                Harga Jual (Rp)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                placeholder="18000"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stockQuantity" required>
                Stok Awal (Unit)
              </Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min={0}
                placeholder="50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="minStockLevel">Batas Stok Min.</Label>
              <Input
                id="minStockLevel"
                name="minStockLevel"
                type="number"
                min={1}
                defaultValue={10}
                placeholder="10"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={loading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-2 font-bold">
              Simpan Produk
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        title="Hapus Produk dari Inventaris"
        description={`Apakah Anda yakin ingin menghapus produk "${productToDelete?.name}"? Tindakan ini akan menonaktifkan produk dari kasir POS.`}
        maxWidth="sm"
      >
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setProductToDelete(null)}
            disabled={deleteLoading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            loading={deleteLoading}
            onClick={handleConfirmDelete}
            className="flex-2 font-bold"
          >
            Ya, Hapus Produk
          </Button>
        </div>
      </Modal>
    </div>
  );
}
