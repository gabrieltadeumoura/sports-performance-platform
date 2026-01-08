import z from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha deve ter ao menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type RegisterForm = z.infer<typeof registerSchema>;



