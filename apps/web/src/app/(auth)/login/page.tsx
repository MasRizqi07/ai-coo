'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { ArrowRight } from 'lucide-react';
import { loginAction } from '../../actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await loginAction({ email, password });
    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Failed to login');
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
        <h1 className="text-3xl font-bold tracking-tight text-white">Selamat Datang Kembali</h1>
        <p className="text-slate-400">Masuk untuk mengelola operasional toko dan kasir Anda</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Alamat Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="owner@toko.id"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Kata Sandi</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        <Button
          className="w-full gap-2 mt-4 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sedang Masuk...' : 'Masuk ke Akun Toko'} <ArrowRight className="w-4 h-4 text-slate-950" />
        </Button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Belum memiliki akun toko?{' '}
        <Link
          href="/register"
          className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          Daftar Toko Gratis
        </Link>
      </div>
    </motion.div>
  );
}
