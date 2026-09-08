'use client';

import * as React from 'react';
import {
  Search,
  Plus,
  Trash2,
  MessageCircle,
  Users,
  Crown,
  Star,
  UserCheck,
  Clock,
} from 'lucide-react';

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import { createCustomerAction, deleteCustomerAction } from '../../actions/customers';
import {
  formatCurrency,
  formatDateIndonesian,
  formatPhoneNumberIndonesian,
} from '../../../lib/utils';
import { toast } from 'sonner';
import { Customer } from '@ai-coo/shared-types';

export default function CustomersClientView({
  initialCustomers: customers,
}: {
  initialCustomers: Customer[];
}) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [tierFilter, setTierFilter] = React.useState<'ALL' | 'VIP' | 'LOYAL' | 'REGULAR'>('ALL');

  // Customer deletion state
  const [customerToDelete, setCustomerToDelete] = React.useState<Customer | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // VIP & Retention metrics
  const vipCustomers = React.useMemo(
    () => customers.filter((c) => Number(c.totalSpent || 0) >= 500000),
    [customers],
  );

  const followUpNeeded = React.useMemo(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return customers.filter((c) => {
      if (!c.lastPurchaseAt) return true;
      return new Date(c.lastPurchaseAt) < thirtyDaysAgo;
    });
  }, [customers]);

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 500000) {
      return {
        label: 'VIP',
        variant: 'vip' as const,
        icon: Crown,
      };
    }
    if (totalSpent >= 150000) {
      return {
        label: 'Loyal',
        variant: 'loyal' as const,
        icon: Star,
      };
    }
    return {
      label: 'Reguler',
      variant: 'default' as const,
      icon: UserCheck,
    };
  };

  async function handleAddCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Normalize phone number to Indonesian format (628...)
    const rawPhone = (formData.get('phone') as string) || '';
    if (rawPhone) {
      formData.set('phone', formatPhoneNumberIndonesian(rawPhone));
    }

    const res = await createCustomerAction(formData);

    if (res.success) {
      toast.success('Pelanggan berhasil didaftarkan ke CRM!');
      setShowAddModal(false);
    } else {
      toast.error(res.error || 'Gagal menambahkan pelanggan');
    }
    setLoading(false);
  }

  async function handleConfirmDelete() {
    if (!customerToDelete) return;
    setDeleteLoading(true);
    const res = await deleteCustomerAction(customerToDelete.id);
    if (res.success) {
      toast.success(`Pelanggan "${customerToDelete.name}" berhasil dihapus.`);
      setCustomerToDelete(null);
    } else {
      toast.error(res.error || 'Gagal menghapus pelanggan');
    }
    setDeleteLoading(false);
  }

  // Filtered customers
  const filteredCustomers = React.useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q));

      const spent = Number(c.totalSpent || 0);
      let matchTier = true;
      if (tierFilter === 'VIP') matchTier = spent >= 500000;
      else if (tierFilter === 'LOYAL') matchTier = spent >= 150000 && spent < 500000;
      else if (tierFilter === 'REGULAR') matchTier = spent < 150000;

      return matchSearch && matchTier;
    });
  }, [customers, searchQuery, tierFilter]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Pelanggan & CRM Toko
            </h2>
            <span className="hidden sm:inline-flex rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700">
              {customers.length} Kontak Terdata
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Segmentasi pelanggan UMKM, lacak riwayat loyalitas belanja, dan kirim sapaan WhatsApp langsung.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="gap-1.5 text-xs font-bold shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>+ Tambah Pelanggan</span>
        </Button>
      </div>

      {/* 3 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-slate-900/40 border-slate-800/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pelanggan
            </p>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">
            {customers.length}{' '}
            <span className="text-xs font-normal text-slate-400">orang</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Database pembeli aktif</p>
        </Card>

        <Card className="p-5 bg-slate-900/40 border-slate-800/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pelanggan VIP
            </p>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-300 mt-2">
            {vipCustomers.length}{' '}
            <span className="text-xs font-normal text-slate-400">orang</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Belanja akumulatif ≥ Rp 500.000</p>
        </Card>

        <Card className="p-5 bg-slate-900/40 border-slate-800/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Perlu Follow-up
            </p>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-300 mt-2">
            {followUpNeeded.length}{' '}
            <span className="text-xs font-normal text-slate-400">orang</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">&gt;30 hari belum berkunjung</p>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama pelanggan, nomor WhatsApp, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-950/70 border-slate-800 text-xs sm:text-sm rounded-xl"
            />
          </div>

          {/* Tier Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(
              [
                { id: 'ALL', label: 'Semua Tier' },
                { id: 'VIP', label: 'VIP (≥500k)' },
                { id: 'LOYAL', label: 'Loyal (≥150k)' },
                { id: 'REGULAR', label: 'Reguler' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTierFilter(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  tierFilter === t.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950/50 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* CRM Directory Table */}
      <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Nama Pelanggan</th>
                <th className="px-5 py-3.5">Kontak & WhatsApp</th>
                <th className="px-5 py-3.5">Tier CRM</th>
                <th className="px-5 py-3.5">Total Belanja (LTV)</th>
                <th className="px-5 py-3.5">Kunjungan Terakhir</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <EmptyState
                      icon={Users}
                      title="Tidak Ditemukan Data Pelanggan"
                      description="Belum ada data pelanggan yang sesuai dengan pencarian atau filter tier."
                      actionLabel={customers.length === 0 ? 'Tambah Pelanggan Baru' : 'Reset Filter'}
                      onAction={() => {
                        setTierFilter('ALL');
                        setSearchQuery('');
                      }}
                      actionHref={customers.length === 0 ? undefined : undefined}
                    />
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const spent = Number(c.totalSpent || 0);
                  const tier = getCustomerTier(spent);
                  const cleanPhone = formatPhoneNumberIndonesian(c.phone);

                  const waGreeting = encodeURIComponent(
                    `Halo Kak ${c.name}! Terima kasih selalu menjadi bagian dari keluarga toko kami. Ada promo spesial untuk Anda hari ini!`,
                  );

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-amber-400 text-xs shrink-0">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs sm:text-sm">{c.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              ID: {c.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs">
                        {cleanPhone ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-300">{c.phone}</span>
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${waGreeting}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold transition-colors"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>Chat</span>
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">-</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant={tier.variant}>{tier.label}</Badge>
                      </td>

                      <td className="px-5 py-4 font-black text-amber-400 text-xs sm:text-sm font-mono">
                        {formatCurrency(spent)}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-300">
                        {c.lastPurchaseAt ? (
                          formatDateIndonesian(c.lastPurchaseAt)
                        ) : (
                          <span className="text-slate-500 italic">Belum Ada</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Hapus Pelanggan"
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

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Daftarkan Pelanggan Baru"
        description="Lengkapi kontak pelanggan untuk membangun basis data CRM dan mengirimkan struk via WhatsApp."
        maxWidth="md"
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" required>
              Nama Lengkap Pelanggan
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Contoh: Pak Bambang Pamungkas"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Nomor WhatsApp (Indonesia)</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="08123456789 (Otomatis +62)"
                helperText="Otomatis diubah menjadi format 628..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Alamat Email (Opsional)</Label>
              <Input id="email" name="email" type="email" placeholder="bambang@gmail.com" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Alamat / Keterangan Meja (Opsional)</Label>
            <Input id="address" name="address" placeholder="Contoh: Meja 4 / Komplek Melati Blok C-2" />
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
              Simpan Pelanggan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        title="Hapus Pelanggan"
        description={`Apakah Anda yakin ingin menghapus data pelanggan "${customerToDelete?.name}"? Transaksi lama tetap tersimpan tetapi profil CRM akan dihapus.`}
        maxWidth="sm"
      >
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCustomerToDelete(null)}
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
            Ya, Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
