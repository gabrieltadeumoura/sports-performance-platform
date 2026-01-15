import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, AlertCircle } from 'lucide-react'
import { useRegister, useLogin } from '../features/auth/hooks'
import { useAuth } from '../features/auth/useAuth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { toast } from '../components/ui/use-toast'

const registerSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Digite um e-mail valido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'A confirmacao deve ter pelo menos 6 caracteres'),
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
        toast({
          variant: 'success',
          title: 'Conta criada com sucesso!',
          description: 'Realizando login automático...',
        })
        loginMutation.mutate(
          { email: values.email, password: values.password },
          {
            onSuccess(data) {
              const token = data.token
              setAuthenticated(true, token)
              navigate('/dashboard', { replace: true })
            },
            onError: () => {
              toast({
                variant: 'danger',
                title: 'Erro ao fazer login',
                description: 'Conta criada, mas ocorreu um erro ao fazer login. Tente fazer login manualmente.',
              })
            },
          }
        )
      },
      onError: () => {
        toast({
          variant: 'danger',
          title: 'Erro ao criar conta',
          description: 'Ocorreu um erro ao criar sua conta. Verifique os dados e tente novamente.',
        })
      },
    })
  }

  const apiError =
    registerMutation.error instanceof Error
      ? registerMutation.error.message
      : loginMutation.error instanceof Error
        ? loginMutation.error.message
        : null

  const isLoading = registerMutation.isPending || loginMutation.isPending

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Criar conta</h1>
        <p className="mt-2 text-secondary-500">
          Preencha os dados abaixo para criar sua conta
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
              type="text"
              label="Nome completo"
              placeholder="Seu nome"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

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
              hint="Minimo de 6 caracteres"
              {...register('password')}
            />

            <Input
              type="password"
              label="Confirmar senha"
              placeholder="******"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-sm text-secondary-600">
                Eu concordo com os{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  Termos de Servico
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  Politica de Privacidade
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Criar conta
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-secondary-500">
        Ja tem uma conta?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Fazer login
        </Link>
      </p>
    </div>
  )
}
