import { fetchApi } from '../../../lib/api';
import { getToken } from '../../actions/auth';
import { redirect } from 'next/navigation';
import { DashboardChartsResponse } from '@ai-coo/shared-types';
import DashboardClientView, { DashboardStats, InsightData } from './client-view';

export default async function DashboardPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const [stats, charts, insight] = await Promise.all([
      fetchApi<DashboardStats>('/dashboard/stats', { token }),
      fetchApi<DashboardChartsResponse | null>('/dashboard/charts', { token }).catch((err) => {
        console.error('Failed to fetch charts data', err);
        return null;
      }),
      fetchApi<InsightData | null>('/ai-insights/latest', { token }).catch((err) => {
        console.error('Failed to fetch AI insights', err);
        return null;
      }),
    ]);
    return <DashboardClientView stats={stats} charts={charts} insight={insight} />;
  } catch (error) {
    console.error('Failed to fetch dashboard stats', error);
    // Show explicit error state — do not silently swallow failures
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-6 max-w-md w-full text-center">
          <svg className="mx-auto h-10 w-10 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">
            Dashboard Unavailable
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            We couldn&apos;t load your dashboard data. This may be a temporary issue with the server.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }
}
