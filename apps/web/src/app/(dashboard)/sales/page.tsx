import { fetchApi } from '../../../lib/api';
import { getToken } from '../../actions/auth';
import { redirect } from 'next/navigation';
import SalesClientView from './client-view';

export default async function SalesPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const [sales, customers, products] = await Promise.all([
      fetchApi<any[]>('/sales', { token }),
      fetchApi<any[]>('/customers', { token }),
      fetchApi<any[]>('/products', { token }),
    ]);

    return (
      <SalesClientView
        initialSales={sales}
        customers={customers}
        products={products.filter((p: any) => p.stockQuantity > 0)}
      />
    );
  } catch (error) {
    console.error('Failed to fetch sales data', error);
    return <SalesClientView initialSales={[]} customers={[]} products={[]} />;
  }
}
