'use server';

import { cookies } from 'next/headers';
import { LoginForm } from '@/app/schemas/login_schema';
import { RegisterForm } from '@/app/schemas/register_schema';
import api from '../api/api';

export async function loginAction(data: LoginForm) {
  try {
    const response = await api.post('/login', {
      email: data.email,
      password: data.password,
    });

    const { token } = response.data;

    (await cookies()).set('auth_token', token, {
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        'Erro ao fazer login. Tente novamente.',
    };
  }
}

export async function registerAction(data: RegisterForm) {
  try {
    await api.post('/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        'Erro ao criar conta. Tente novamente.',
    };
  }
}

export async function removeAuthCookie() {
  try {
    (await cookies()).delete('auth_token');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao remover cookie de autenticação' };
  }
}
