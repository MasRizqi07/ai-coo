'use server';

import { revalidatePath } from 'next/cache';
import { fetchApi } from '../../lib/api';
import { getToken } from './auth';
import { Sale } from '@ai-coo/shared-types';

export async function createSaleAction(
  formData: FormData,
  items: { productId: string; quantity: number }[],
) {
  try {
    const token = await getToken();
    if (!token) throw new Error('Unauthorized');

    const customerId = formData.get('customerId') as string;
    const paymentMethod = (formData.get('paymentMethod') as string) || 'CASH';
    const paidAmount = formData.get('paidAmount') ? Number(formData.get('paidAmount')) : undefined;
    const changeAmount = formData.get('changeAmount') ? Number(formData.get('changeAmount')) : undefined;
    const notes = (formData.get('notes') as string) || undefined;

    const dto = {
      customerId: customerId || undefined,
      paymentMethod,
      paidAmount,
      changeAmount,
      notes,
      items,
    };

    const sale = await fetchApi<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(dto),
      token,
    });

    revalidatePath('/dashboard/sales');
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/customers');
    revalidatePath('/dashboard');
    return { success: true, sale };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Create sale failed',
    };
  }
}
