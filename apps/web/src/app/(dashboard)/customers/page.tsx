import { fetchApi } from '../../../lib/api';
import { getToken } from '../../actions/auth';
import { redirect } from 'next/navigation';
import CustomersClientView from './client-view';

export default async function CustomersPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const customers = await fetchApi<any[]>('/customers', { token });
    return <CustomersClientView initialCustomers={customers} />;
  } catch (error) {
    console.error('Failed to fetch customers', error);
    return <CustomersClientView initialCustomers={[]} />;
  }
}
