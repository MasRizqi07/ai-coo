'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Search, Plus, MoreHorizontal } from 'lucide-react';

import { createCustomerAction, deleteCustomerAction } from '../../actions/customers';
import { toast } from 'sonner';

export default function CustomersClientView({
  initialCustomers: customers,
}: {
  initialCustomers: any[];
}) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  async function handleAddCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createCustomerAction(formData);

    if (res.success) {
      toast.success('Customer added successfully!');
      setShowAddForm(false);
    } else {
      toast.error(res.error || 'Failed to add customer');
    }
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Customers</h2>
          <p className="text-slate-400 mt-2">
            Manage your customer relationships and view their history.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" /> {showAddForm ? 'Cancel' : 'Add Customer'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <form onSubmit={handleAddCustomer} className="space-y-4 max-w-md">
            <h3 className="text-lg font-semibold text-white">Add New Customer</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" disabled={loading} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Customer'}
            </Button>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search customers..." className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/30 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No customers found. Add your first customer!
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">{customer.name}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <div>{customer.email || 'No email'}</div>
                      <div className="text-xs mt-1">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this customer?')) {
                            const res = await deleteCustomerAction(customer.id);
                            if (res.success) toast.success('Customer deleted successfully');
                            else toast.error('Failed to delete customer');
                          }
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
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
