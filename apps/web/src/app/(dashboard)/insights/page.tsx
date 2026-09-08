import { fetchApi } from '../../../lib/api';
import { getToken } from '../../actions/auth';
import { redirect } from 'next/navigation';
import { InsightPayload, Product, Customer } from '@ai-coo/shared-types';
import InsightsClientView from './client-view';

export default async function InsightsPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const [latestInsight, products, customers] = await Promise.all([
      fetchApi<InsightPayload | null>('/ai-insights/latest', { token }).catch(() => null),
      fetchApi<Product[]>('/products', { token }).catch(() => []),
      fetchApi<Customer[]>('/customers', { token }).catch(() => []),
    ]);

    return (
      <InsightsClientView
        initialInsight={latestInsight}
        products={products}
        customers={customers}
      />
    );
  } catch (error) {
    console.error('Failed to fetch insights data', error);
    return <InsightsClientView initialInsight={null} products={[]} customers={[]} />;
  }
}
