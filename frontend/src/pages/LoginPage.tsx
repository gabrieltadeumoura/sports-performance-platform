import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLogin } from '../features/auth/hooks'
import { useAuth } from '../features/auth/useAuth'
import { Button } from '../components/ui/button'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuthenticated } = useAuth()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const from = (location.state as { from?: Location } | undefined)?.from?.pathname ?? '/dashboard'

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess(data) {
        const token = data.token
        setAuthenticated(true, token)
        navigate(from, { replace: true })
      },
    })
  }

  const apiError = loginMutation.error instanceof Error ? loginMutation.error.message : null

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
        <p className="text-sm text-zinc-400">Acesse o painel da plataforma esportiva.</p>
      </div>
      <div className="space-y-4">
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
        {apiError && <p className="text-xs text-red-400">{apiError}</p>}
        <Button type="submit" disabled={loginMutation.isPending} className="w-full">
          Entrar
        </Button>
        <p className="text-xs text-zinc-400 text-center">
          Não tem conta?{' '}
          <Link to="/register" className="text-sky-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </form>
  )
}

