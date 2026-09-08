'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { ArrowRight } from 'lucide-react';
import { registerAction } from '../../actions/auth';
import { BusinessType } from '@ai-coo/shared-types';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const dto = {
      companyName: formData.get('companyName') as string,
      businessType: formData.get('businessType') as BusinessType,
      userName: formData.get('userName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const res = await registerAction(dto);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Failed to register');
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Daftarkan Toko Anda</h1>
        <p className="text-slate-400">Mulai kelola kasir, stok barang, dan arahan cerdas AI COO</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="companyName">Nama Usaha / Toko</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Contoh: Warkop Berkah Nusantara"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Kategori Bisnis UMKM</Label>
          <select
            aria-label="Kategori Bisnis"
            id="businessType"
            name="businessType"
            className="flex h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors"
            required
            disabled={loading}
          >
            <option value="WARKOP">Warkop / Cafe / Kuliner</option>
            <option value="RETAIL">Toko Kelontong / Retail / Swalayan</option>
            <option value="TOKO_BANGUNAN">Toko Bangunan & Material</option>
            <option value="LAUNDRY">Jasa Laundry</option>
            <option value="BENGKEL">Bengkel & Sparepart</option>
            <option value="DISTRIBUTOR">Distributor / Grosir</option>
            <option value="OTHER">Lainnya / Umum</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userName">Nama Pemilik / Penanggung Jawab</Label>
          <Input
            id="userName"
            name="userName"
            placeholder="Budi Santoso"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Alamat Email Login</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="budi@toko.id"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi (Minimal 8 Karakter)</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            disabled={loading}
          />
        </div>

        <Button
          className="w-full gap-2 mt-4 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Mendaftarkan Akun...' : 'Daftar Toko Sekarang'} <ArrowRight className="w-4 h-4 text-slate-950" />
        </Button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Sudah memiliki akun toko?{' '}
        <Link
          href="/login"
          className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          Masuk di sini
        </Link>
      </div>
    </motion.div>
  );
}
