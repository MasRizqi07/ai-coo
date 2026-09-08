import { fetchApi } from '../../../lib/api';
import { getToken } from '../../actions/auth';
import { redirect } from 'next/navigation';
import { Sale, Customer, Product } from '@ai-coo/shared-types';
import SalesClientView from './client-view';

export default async function SalesPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const [sales, customers, products] = await Promise.all([
      fetchApi<Sale[]>('/sales', { token }),
      fetchApi<Customer[]>('/customers', { token }),
      fetchApi<Product[]>('/products', { token }),
    ]);

    return (
      <SalesClientView
        initialSales={sales}
        customers={customers}
        products={products.filter((p: Product) => p.stockQuantity > 0)}
      />
    );
  } catch (error) {
    console.error('Failed to fetch sales data', error);
    return <SalesClientView initialSales={[]} customers={[]} products={[]} />;
  }
}
