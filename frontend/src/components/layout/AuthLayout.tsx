import { Activity } from 'lucide-react'
import { Outlet, Link } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              SportsPerformance
            </span>
          </Link>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Gerencie a performance dos seus atletas
          </h1>
          <p className="text-lg text-primary-100/80">
            Plataforma completa para acompanhamento de saude, lesoes, tratamentos e evolucao de atletas profissionais.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-primary-200">Atletas monitorados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-primary-200">Satisfacao</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-primary-200">Suporte</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-200">
          2024 SportsPerformance. Todos os direitos reservados.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-secondary-50 p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">
                SportsPerformance
              </span>
            </Link>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
