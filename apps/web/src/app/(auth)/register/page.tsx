'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Card } from '../../../components/ui/Card';
import { ArrowRight, Eye, EyeOff, Store, User, Mail, Lock } from 'lucide-react';
import { registerAction } from '../../actions/auth';
import { BusinessType } from '@ai-coo/shared-types';
import { BrandLogo } from '../../../components/ui/BrandLogo';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

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
      setError(res.error || 'Pendaftaran gagal. Pastikan data terisi dengan benar.');
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-6 sm:p-8 rounded-3xl border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Amber Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl p-1">
            <BrandLogo size="lg" badgeText="UMKM AI" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Daftarkan Toko UMKM
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mulai kelola kasir kilat, inventaris, dan asisten AI gratis
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-4 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="companyName" required>
              Nama Toko / Usaha
            </Label>
            <div className="relative">
              <Store className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <Input
                id="companyName"
                name="companyName"
                placeholder="Contoh: Warkop Berkah Nusantara"
                required
                disabled={loading}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="businessType" required>
              Kategori Bisnis UMKM
            </Label>
            <select
              aria-label="Kategori Bisnis"
              id="businessType"
              name="businessType"
              className="flex h-11 min-h-[44px] w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors cursor-pointer"
              required
              disabled={loading}
              defaultValue="WARKOP"
            >
              <option value="WARKOP">Warkop / Cafe / Kuliner & Minuman</option>
              <option value="RETAIL">Toko Kelontong / Swalayan / Retail</option>
              <option value="TOKO_BANGUNAN">Toko Bangunan & Material</option>
              <option value="LAUNDRY">Jasa Laundry Kiloan & Satuan</option>
              <option value="BENGKEL">Bengkel & Sparepart Motor/Mobil</option>
              <option value="DISTRIBUTOR">Distributor / Grosir</option>
              <option value="OTHER">Lainnya / Umum</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="userName" required>
              Nama Pemilik / Penanggung Jawab
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <Input
                id="userName"
                name="userName"
                placeholder="Contoh: Budi Santoso"
                required
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" required>
              Alamat Email Login
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="budi@toko.id"
                required
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" required>
              Kata Sandi (Minimal 6 Karakter)
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white p-1 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2 font-bold shadow-lg shadow-amber-500/20"
          >
            <span>Daftar Toko & Mulai Gratis</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Sudah memiliki akun toko?{' '}
          <Link
            href="/login"
            className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Masuk ke Toko Anda
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
