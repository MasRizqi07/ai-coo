'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import {
  Search,
  Plus,
  Trash2,
  MessageCircle,
  Users,
  UserCheck,
  Crown,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { createCustomerAction, deleteCustomerAction } from '../../actions/customers';
import { toast } from 'sonner';
import { Customer } from '@ai-coo/shared-types';

export default function CustomersClientView({
  initialCustomers: customers,
}: {
  initialCustomers: Customer[];
}) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const getTier = (totalSpent: number) => {
    if (totalSpent >= 500000) {
      return {
        label: 'Pelanggan VIP',
        icon: Crown,
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      };
    }
    if (totalSpent > 0) {
      return {
        label: 'Reguler',
        icon: UserCheck,
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      };
    }
    return {
      label: 'Baru',
      icon: Users,
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
    };
  };

  const formatWhatsAppLink = (phone: string, name: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Halo Kak ${name}! Terima kasih atas kunjungan Anda ke toko kami. Ada penawaran spesial untuk Anda hari ini!`,
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  async function handleAddCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createCustomerAction(formData);

    if (res.success) {
      toast.success('Pelanggan berhasil didaftarkan!');
      setShowAddForm(false);
    } else {
      toast.error(res.error || 'Gagal menambahkan pelanggan');
    }
    setLoading(false);
  }

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pelanggan & CRM UMKM
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Bangun relasi erat dengan pembeli, pantau akumulasi belanja, dan kirim pesan promosi via WhatsApp.
          </p>
        </div>
        <Button
          className="gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 shadow-lg shadow-amber-500/20"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4 text-slate-950" />
          {showAddForm ? 'Batal Tambah' : 'Tambah Pelanggan Baru'}
        </Button>
      </div>

      {/* Add Customer Drawer */}
      {showAddForm && (
        <Card className="p-6 border-amber-500/30 bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-xl">
          <form onSubmit={handleAddCustomer} className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                Daftarkan Pelanggan Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Pelanggan</Label>
              <Input
                id="name"
                name="name"
                placeholder="Contoh: Ibu Rina / Pak Joko"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Nomor WhatsApp (Aktif)</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Contoh: 081234567890"
                disabled={loading}
              />
              <p className="text-[11px] text-slate-500">
                Format nomor Indonesia untuk integrasi kirim struk & pesan re-engagement.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email (Opsional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="rina@example.com"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
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
                {loading ? 'Menyimpan...' : 'Simpan Pelanggan'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Customer Table Card */}
      <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Daftar Kontak & Pembelian</h3>
            <p className="text-xs text-slate-400">Total {customers.length} pelanggan terdata</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Cari nama, nomor WhatsApp..."
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
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4">Status / Tier</th>
                <th className="px-6 py-4">Kontak Terdaftar</th>
                <th className="px-6 py-4">Total Belanja</th>
                <th className="px-6 py-4 text-right">Aksi CRM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-xs">
                    Belum ada pelanggan yang cocok. Daftarkan pelanggan pertama Anda!
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const tier = getTier(Number(customer.totalSpent || 0));
                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-white">
                        {customer.name}
                        <div className="text-[10px] text-slate-500 font-mono">
                          Bergabung: {new Date(customer.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tier.badge}`}
                        >
                          <tier.icon className="h-3 w-3" />
                          {tier.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {customer.phone ? (
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {customer.phone}
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">Tidak ada telepon</span>
                        )}
                        {customer.email && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                            <Mail className="h-3 w-3 text-slate-500" />
                            {customer.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-black text-amber-400">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {customer.phone && (
                          <a
                            href={formatWhatsAppLink(customer.phone, customer.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            WhatsApp
                          </a>
                        )}

                        <button
                          onClick={async () => {
                            if (confirm(`Hapus pelanggan "${customer.name}"?`)) {
                              const res = await deleteCustomerAction(customer.id);
                              if (res.success) toast.success('Pelanggan berhasil dihapus');
                              else toast.error('Gagal menghapus pelanggan');
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
