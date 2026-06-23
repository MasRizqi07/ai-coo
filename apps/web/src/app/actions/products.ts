'use server';

import { revalidatePath } from 'next/cache';
import { fetchApi } from '../../lib/api';
import { getToken } from './auth';

export async function createProductAction(formData: FormData) {
  try {
    const token = await getToken();
    if (!token) throw new Error('Unauthorized');

    const dto = {
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      description: (formData.get('description') as string) || undefined,
      price: parseFloat(formData.get('price') as string),
      stockQuantity: parseInt(formData.get('stockQuantity') as string, 10),
    };

    await fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(dto),
      token,
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function restockProductAction(productId: string, quantityToAdd: number) {
  try {
    const token = await getToken();
    if (!token) throw new Error('Unauthorized');

    await fetchApi(`/products/${productId}/restock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantityToAdd }),
      token,
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const token = await getToken();
    if (!token) throw new Error('Unauthorized');

    await fetchApi(`/products/${id}`, {
      method: 'DELETE',
      token,
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
