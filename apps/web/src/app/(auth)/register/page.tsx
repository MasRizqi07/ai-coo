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
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-slate-400">Start managing your UMKM business smarter</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Toko Maju Jaya"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type</Label>
          <select
            aria-label="Business Type"
            id="businessType"
            name="businessType"
            className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors"
            required
            disabled={loading}
          >
            <option value="RETAIL">Retail</option>
            <option value="FNB">Food & Beverage</option>
            <option value="SERVICES">Services</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userName">Your Name</Label>
          <Input
            id="userName"
            name="userName"
            placeholder="Budi Santoso"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="budi@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            disabled={loading}
          />
        </div>

        <Button className="w-full gap-2 mt-4" type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
