'use server';

import { revalidatePath } from 'next/cache';
import { fetchApi } from '../../lib/api';
import { getToken } from './auth';
import { UpdateCompanyDto } from '@ai-coo/shared-types';

export async function updateCompanyAction(dto: UpdateCompanyDto) {
  try {
    const token = await getToken();
    if (!token) throw new Error('Unauthorized');

    await fetchApi('/companies/profile', {
      method: 'PATCH',
      body: JSON.stringify(dto),
      token,
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update failed',
    };
  }
}
