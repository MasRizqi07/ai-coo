'use server';

import { revalidatePath } from 'next/cache';
import { fetchApi } from '../../lib/api';
import { getToken } from './auth';

export async function createSaleAction(
  formData: FormData,
  items: { productId: string; quantity: number }[],
) {
  try {
    const token = await getToken();
    if (!token) throw new Error('Unauthorized');

    const customerId = formData.get('customerId') as string;

    const dto = {
      customerId: customerId || undefined,
      items,
    };

    await fetchApi('/sales', {
      method: 'POST',
      body: JSON.stringify(dto),
      token,
    });

    revalidatePath('/dashboard/sales');
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/customers');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
