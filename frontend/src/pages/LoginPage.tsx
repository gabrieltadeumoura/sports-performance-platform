import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useLogin } from '../features/auth/hooks'
import { useAuth } from '../features/auth/useAuth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail valido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Bem-vindo de volta</h1>
        <p className="mt-2 text-secondary-500">
          Entre com suas credenciais para acessar sua conta
        </p>
      </div>

      <Card variant="elevated" padding="lg">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {apiError && (
              <div className="flex items-center gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <Input
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              type="password"
              label="Senha"
              placeholder="******"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-secondary-600">Lembrar-me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={loginMutation.isPending}
              className="w-full"
              size="lg"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-secondary-500">
        Nao tem uma conta?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Cadastre-se gratuitamente
        </Link>
      </p>
    </div>
  )
}
