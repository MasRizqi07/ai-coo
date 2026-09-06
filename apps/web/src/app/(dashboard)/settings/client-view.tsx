'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import {
  Store,
  Sparkles,
  Shield,
  Clock,
  Server,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { updateCompanyAction } from '../../actions/companies';
import { toast } from 'sonner';

export default function SettingsClientView({
  initialCompany,
  currentUser,
}: {
  initialCompany: any;
  currentUser: any;
}) {
  const [loading, setLoading] = React.useState(false);
  const [companyName, setCompanyName] = React.useState(initialCompany?.name || '');
  const [phone, setPhone] = React.useState(initialCompany?.phone || '');
  const [address, setAddress] = React.useState(initialCompany?.address || '');

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await updateCompanyAction({
      name: companyName,
      phone: phone || undefined,
      address: address || undefined,
    });

    if (res.success) {
      toast.success('Pengaturan profil toko berhasil diperbarui!');
    } else {
      toast.error(res.error || 'Gagal memperbarui pengaturan');
    }
    setLoading(false);
  }

  const typeLabels: Record<string, string> = {
    WARKOP: 'Warkop & Kuliner',
    TOKO_BANGUNAN: 'Toko Bangunan & Material',
    LAUNDRY: 'Jasa Laundry',
    BENGKEL: 'Bengkel & Otomotif',
    RETAIL: 'Toko Kelontong & Retail',
    DISTRIBUTOR: 'Distributor / Grosir',
    OTHER: 'UMKM Umum',
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Pengaturan Usaha & Akun
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Kelola informasi toko, kontak resmi, dan lihat spesifikasi sistem operasional Anda.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Form Settings (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 rounded-3xl border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Profil Bisnis UMKM</h3>
                <p className="text-xs text-slate-400">Informasi ini dicantumkan pada struk penjualan kasir</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 mt-6">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Nama Usaha / Toko</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nama toko Anda"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessType">Kategori Bisnis</Label>
                <Input
                  id="businessType"
                  value={typeLabels[initialCompany?.businessType] || initialCompany?.businessType || 'RETAIL'}
                  disabled
                  className="bg-slate-950/40 text-slate-400 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-500">
                  Kategori bisnis dikunci untuk menjaga konsistensi model AI operasional.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor WhatsApp Resmi Toko</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Alamat Toko / Cabang</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Raya Utama No. 12, Surabaya"
                  disabled={loading}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 shadow-lg shadow-amber-500/20"
                >
                  <Save className="h-4 w-4 text-slate-950" />
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </Card>

          {/* User Account Details */}
          <Card className="p-6 rounded-3xl border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Akun Pengguna</h3>
                <p className="text-xs text-slate-400">Hak akses dan identitas login Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Nama Pengguna</span>
                <p className="font-bold text-white text-sm mt-0.5">{currentUser?.name || '-'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Alamat Email</span>
                <p className="font-bold text-white text-sm mt-0.5">{currentUser?.email || '-'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Peran Akses</span>
                <p className="font-bold text-amber-400 text-sm mt-0.5">{currentUser?.role || 'OWNER'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Tenant ID</span>
                <p className="font-mono text-slate-400 text-[11px] mt-1 truncate">
                  {initialCompany?.id || '-'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: System Specifications & Status (1 col) */}
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-slate-800/80 bg-slate-900/50 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Arsitektur AI & Otomasi
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">Model AI</span>
                  <p className="text-slate-400 text-[11px]">OpenAI gpt-4o-mini dengan skema JSON ketat (anti-halusinasi).</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">Jadwal Brief Harian</span>
                  <p className="text-slate-400 text-[11px]">Pukul 06:00 WIB (Asia/Jakarta) diproses di latar belakang via BullMQ.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <Server className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">Keamanan Multi-Tenant</span>
                  <p className="text-slate-400 text-[11px]">Isolasi data dijamin oleh PostgreSQL Row-Level Security (RLS).</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats Summary */}
          {initialCompany?._count && (
            <Card className="p-6 rounded-3xl border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Total Arsip Data
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <p className="text-xl font-black text-white">{initialCompany._count.products}</p>
                  <span className="text-[10px] text-slate-400">Produk</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <p className="text-xl font-black text-white">{initialCompany._count.customers}</p>
                  <span className="text-[10px] text-slate-400">Pelanggan</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 col-span-2">
                  <p className="text-xl font-black text-amber-400">{initialCompany._count.sales}</p>
                  <span className="text-[10px] text-slate-400">Total Transaksi Sepanjang Masa</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
