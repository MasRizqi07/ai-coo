import { fetchApi } from '../../../lib/api';
import { getToken } from '../../actions/auth';
import { redirect } from 'next/navigation';
import SettingsClientView from './client-view';

export default async function SettingsPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const [company, me] = await Promise.all([
      fetchApi<any>('/companies/profile', { token }),
      fetchApi<any>('/auth/me', { token }),
    ]);

    return <SettingsClientView initialCompany={company} currentUser={me} />;
  } catch (error) {
    console.error('Failed to fetch settings data', error);
    return <SettingsClientView initialCompany={null} currentUser={null} />;
  }
}
