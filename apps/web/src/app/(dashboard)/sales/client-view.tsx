'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Search, Plus, Receipt } from 'lucide-react';
import { createSaleAction } from '../../actions/sales';
import { toast } from 'sonner';

export default function SalesClientView({
  initialSales,
  customers,
  products,
}: {
  initialSales: any[];
  customers: any[];
  products: any[];
}) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Checkout Cart State
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>('');
  const [cartItems, setCartItems] = React.useState<{ productId: string; quantity: number }[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  const addToCart = (productId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Add at least one product to the cart');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createSaleAction(formData, cartItems);

    if (res.success) {
      toast.success('Transaction completed successfully!');
      setShowAddForm(false);
      setCartItems([]);
      setSelectedCustomer('');
    } else {
      toast.error(res.error || 'Transaction failed');
    }
    setLoading(false);
  }

  const getProduct = (id: string) => products.find((p) => p.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Sales & Transactions</h2>
          <p className="text-slate-400 mt-2">Log new sales and view your transaction history.</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" /> {showAddForm ? 'Cancel Checkout' : 'New Sale'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6 border-amber-500/30 bg-slate-900/80">
          <form onSubmit={handleCheckout} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Checkout / Point of Sale</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Selection */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Select Products
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p.id)}
                      className="p-3 border border-slate-700 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-500/10 transition-colors"
                    >
                      <p className="font-medium text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(p.price)} • Stock: {p.stockQuantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart & Customer */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Customer (Optional)
                  </label>
                  <select
                    aria-label="Select Customer"
                    name="customerId"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Walk-in Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Cart
                  </h4>
                  {cartItems.length === 0 ? (
                    <div className="p-4 text-center border border-dashed border-slate-700 rounded-lg text-slate-500">
                      Cart is empty
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cartItems.map((item) => {
                        const p = getProduct(item.productId);
                        return (
                          <div
                            key={item.productId}
                            className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg"
                          >
                            <span className="text-white">{p?.name}</span>
                            <span className="text-amber-500 font-bold">x{item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="w-full"
                >
                  {loading ? 'Processing...' : 'Complete Transaction'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search transactions..." className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/30 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {initialSales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No transactions yet. Start selling!
                  </td>
                </tr>
              ) : (
                initialSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-300">
                      {new Date(sale.date).toLocaleDateString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {sale.customer?.name || (
                        <span className="text-slate-500 italic">Walk-in</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{sale.items?.length || 0} items</td>
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
    </motion.div>
  );
}
