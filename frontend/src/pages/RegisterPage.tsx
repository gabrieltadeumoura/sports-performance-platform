import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useRegister, useLogin } from '../features/auth/hooks'
import { useAuth } from '../features/auth/useAuth'
import { Button } from '../components/ui/button'

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas precisam ser iguais',
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuthenticated } = useAuth()
  const registerMutation = useRegister()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
    }

    registerMutation.mutate(payload, {
      onSuccess() {
        loginMutation.mutate(
          { email: values.email, password: values.password },
          {
            onSuccess(data) {
              const token = data.token
              setAuthenticated(true, token)
              navigate('/dashboard', { replace: true })
            },
          },
        )
      },
    })
  }

  const apiError =
    registerMutation.error instanceof Error
      ? registerMutation.error.message
      : loginMutation.error instanceof Error
        ? loginMutation.error.message
        : null

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-zinc-400">Registre-se para acessar a plataforma.</p>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          {...register('name')}
          placeholder="Nome"
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.name && (
          <p className="text-xs text-red-400">{errors.name.message}</p>
        )}
        <input
          type="email"
          {...register('email')}
          placeholder="E-mail"
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
        <input
          type="password"
          {...register('password')}
          placeholder="Senha"
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
        <input
          type="password"
          {...register('confirmPassword')}
          placeholder="Confirmar senha"
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
        {apiError && (
          <p className="text-xs text-red-400">{apiError}</p>
        )}
        <Button
          type="submit"
          disabled={registerMutation.isPending || loginMutation.isPending}
          className="w-full"
        >
          Criar conta
        </Button>
      </div>
    </form>
  )
}

