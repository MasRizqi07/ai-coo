import * as React from 'react';
import { getMeAction, getToken } from '../actions/auth';
import { DashboardShell } from './dashboard-shell';
import { fetchApi } from '../../lib/api';
import { Product } from '@ai-coo/shared-types';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userProfile, token] = await Promise.all([getMeAction(), getToken()]);

  let criticalStockCount = 0;
  if (token) {
    try {
      const products = await fetchApi<Product[]>('/products', { token });
      criticalStockCount = products.filter((p) => p.stockQuantity <= 5).length;
    } catch {
      criticalStockCount = 0;
    }
  }

  return (
    <DashboardShell userProfile={userProfile} criticalStockCount={criticalStockCount}>
      {children}
    </DashboardShell>
  );
}
