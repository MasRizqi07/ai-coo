import { fetchApi } from '../../../../lib/api';
import { getToken } from '../../../actions/auth';
import { redirect } from 'next/navigation';
import { Sale } from '@ai-coo/shared-types';
import SalesHistoryClientView from './client-view';

export default async function SalesHistoryPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const sales = await fetchApi<Sale[]>('/sales', { token });
    return <SalesHistoryClientView initialSales={sales} />;
  } catch (error) {
    console.error('Failed to fetch sales history', error);
    return <SalesHistoryClientView initialSales={[]} />;
  }
}
