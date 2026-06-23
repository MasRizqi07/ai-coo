import { fetchApi } from '../../../lib/api';
import { getToken } from '../../actions/auth';
import { redirect } from 'next/navigation';
import ProductsClientView from './client-view';

export default async function ProductsPage() {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const products = await fetchApi<any[]>('/products', { token });
    return <ProductsClientView initialProducts={products} />;
  } catch (error) {
    console.error('Failed to fetch products', error);
    return <ProductsClientView initialProducts={[]} />;
  }
}
