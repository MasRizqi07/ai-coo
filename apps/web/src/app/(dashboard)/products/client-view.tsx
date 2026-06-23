'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Search, Plus, Package } from 'lucide-react';

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  const getStatus = (stock: number) => {
    if (stock <= 5) return 'Critical';
    if (stock < 15) return 'Low Stock';
    return 'In Stock';
  };

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createProductAction(formData);

    if (res.success) {
      toast.success('Product added successfully!');
      setShowAddForm(false);
    } else {
      toast.error(res.error || 'Failed to add product');
    }
    setLoading(false);
  }

  async function handleRestock(id: string) {
    const res = await restockProductAction(id, 10); // arbitrary restock amount for demo
    if (res.success) {
      toast.success('Product restocked by 10 units!');
    } else {
      toast.error('Failed to restock product');
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Products</h2>
          <p className="text-slate-400 mt-2">Manage your inventory and monitor stock levels.</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" /> {showAddForm ? 'Cancel' : 'Add Product'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <form
            onSubmit={handleAddProduct}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl"
          >
            <h3 className="text-lg font-semibold text-white md:col-span-2">Add New Product</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Initial Stock</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                required
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2 mt-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input placeholder="Search products..." className="pl-9 bg-slate-900/50" />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
          No products found. Add your first product to manage inventory!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const status = getStatus(product.stockQuantity);
            return (
              <Card
                key={product.id}
                className="flex flex-col h-full group hover:scale-[1.02] hover:border-amber-500/50 transition-all duration-300"
              >
                <CardContent className="p-6 flex flex-col h-full gap-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          status === 'In Stock'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : status === 'Low Stock'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {status}
                      </span>
                      <button
                        onClick={async () => {
                          if (confirm('Delete this product?')) {
                            const res = await deleteProductAction(product.id);
                            if (res.success) toast.success('Product deleted');
                            else toast.error('Failed to delete product');
                          }
                        }}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete product"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono">{product.sku}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-800 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Price</p>
                      <p className="font-medium text-slate-200">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="text-right flex items-end gap-3">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Stock</p>
                        <p
                          className={`font-bold ${product.stockQuantity < 15 ? 'text-red-400' : 'text-slate-200'}`}
                        >
                          {product.stockQuantity}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleRestock(product.id)}>
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
    </div>
  );
}
