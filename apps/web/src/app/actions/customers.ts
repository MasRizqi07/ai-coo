'use server';

import { revalidatePath } from 'next/cache';
import { fetchApi } from '../../lib/api';
import { getToken } from './auth';

export async function createCustomerAction(formData: FormData) {
  try {
    const token = await getToken();
    if (!token) throw new Error('Unauthorized');

    const dto = {
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      address: (formData.get('address') as string) || undefined,
    };

    await fetchApi('/customers', {
      method: 'POST',
      body: JSON.stringify(dto),
      token,
    });

    revalidatePath('/dashboard/customers');
    revalidatePath('/dashboard'); // Update stats
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCustomerAction(id: string) {
  try {
    const token = await getToken();
    if (!token) throw new Error('Unauthorized');

    await fetchApi(`/customers/${id}`, {
      method: 'DELETE',
      token,
    });

    revalidatePath('/dashboard/customers');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
