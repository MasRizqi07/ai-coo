import { fetchApi } from '../../../lib/api';
import { getToken, getMeAction } from '../../actions/auth';
import { redirect } from 'next/navigation';
import { Sale, Customer, Product } from '@ai-coo/shared-types';
import SalesClientView from './client-view';

export default async function SalesPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const [sales, customers, products, userProfile] = await Promise.all([
      fetchApi<Sale[]>('/sales', { token }).catch(() => []),
      fetchApi<Customer[]>('/customers', { token }).catch(() => []),
      fetchApi<Product[]>('/products', { token }).catch(() => []),
      getMeAction().catch(() => null),
    ]);

    return (
      <SalesClientView
        initialSales={sales}
        customers={customers}
        products={products}
        storeName={userProfile?.company?.name || 'AI COO POS'}
        cashierName={userProfile?.name || 'Kasir'}
      />
    );
  } catch (error) {
    console.error('Failed to fetch sales data', error);
    return (
      <SalesClientView
        initialSales={[]}
        customers={[]}
        products={[]}
        storeName="AI COO POS"
        cashierName="Kasir"
      />
    );
  }
}
