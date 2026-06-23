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
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-slate-400">Enter your credentials to access your dashboard</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="owner@umkm.id"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required disabled={loading} />
        </div>
        <Button className="w-full gap-2 mt-4" type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
        >
          Register here
        </Link>
      </div>
    </motion.div>
  );
}
