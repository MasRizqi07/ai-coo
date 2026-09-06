'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { LoginDto, RegisterDto, UserProfile } from '@ai-coo/shared-types';

const TOKEN_NAME = 'ai_coo_token';

export async function loginAction(dto: LoginDto) {
  try {
    const response = await fetchApi<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, response.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerAction(dto: RegisterDto) {
  try {
    const response = await fetchApi<{ access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(dto),
    });

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, response.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
  redirect('/login');
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

export async function getMeAction(): Promise<UserProfile | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    return await fetchApi<UserProfile>('/auth/me', { token });
  } catch {
    return null;
  }
}

