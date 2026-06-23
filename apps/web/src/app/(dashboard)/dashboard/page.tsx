import { fetchApi } from '../../../lib/api';
import { getToken } from '../../actions/auth';
import { redirect } from 'next/navigation';
import DashboardClientView from './client-view';

export default async function DashboardPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const [stats, insight] = await Promise.all([
      fetchApi<any>('/dashboard/stats', { token }),
      fetchApi<any>('/ai-insights/latest', { token }).catch((err) => {
        console.error('Failed to fetch AI insights', err);
        return null;
      }),
    ]);
    return <DashboardClientView stats={stats} insight={insight} />;
  } catch (error) {
    console.error('Failed to fetch dashboard stats', error);
    // Fallback if API fails
    return (
      <DashboardClientView
        stats={{ totalRevenue: 0, activeCustomers: 0, productsInStock: 0, lowStockAlerts: 0 }}
        insight={null}
      />
    );
  }
}
