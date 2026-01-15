import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  ArrowRight,
  Heart,
  Clock,
} from 'lucide-react'
import {
  useDashboardAlerts,
  useDashboardOverview,
  useDashboardTrends,
} from '../features/dashboard/hooks'
import { useAppointmentsByMonth } from '../features/appointments/hooks'
import { StatsCard } from '../components/ui/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Loading } from '../components/ui/loading'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'

export function DashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview()
  const { data: trends, isLoading: trendsLoading } = useDashboardTrends()
  const { data: alertsData, isLoading: alertsLoading } = useDashboardAlerts()

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const { data: appointmentsData, isLoading: appointmentsLoading } =
    useAppointmentsByMonth(currentYear, currentMonth)
  const appointments = appointmentsData?.appointments ?? []

  const allAlerts = alertsData
    ? [
        ...alertsData.critical_fatigue.map((a) => ({
          ...a,
          message: `Fadiga crítica: ${a.fatigue_score}%`,
        })),
        ...alertsData.high_risk_active.map((a) => ({
          ...a,
          message: `Risco alto detectado`,
        })),
        ...alertsData.recent_injuries.map((a) => ({
          ...a,
          message: `Nova lesão: ${a.injury_type}`,
        })),
      ]
    : []

  const getAlertVariant = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'danger'
      case 'medium':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'success' | 'info' | 'warning' | 'danger' | 'default'; label: string }> = {
      scheduled: { variant: 'info', label: 'Agendado' },
      confirmed: { variant: 'success', label: 'Confirmado' },
      in_progress: { variant: 'warning', label: 'Em Andamento' },
      completed: { variant: 'success', label: 'Concluido' },
      cancelled: { variant: 'danger', label: 'Cancelado' },
      no_show: { variant: 'danger', label: 'Nao Compareceu' },
      rescheduled: { variant: 'warning', label: 'Reagendado' },
    }
    return statusConfig[status] || { variant: 'default' as const, label: status }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      consultation: 'Consulta',
      treatment: 'Tratamento',
      follow_up: 'Acompanhamento',
      assessment: 'Avaliacao',
      review: 'Revisao',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Logo */}
      <Card className="bg-linear-to-br from-primary-50 to-primary-100/50 border-primary-200 overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="shrink-0 flex items-center justify-center">
              <img
                src="/icon .png"
                alt="SportsPerformance Logo"
                className="h-24 sm:h-28 w-auto object-contain"
              />
            </div>
            <div className="flex-1 text-center sm:text-left flex flex-col justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent mb-2">
                Bem-vindo(a) a SportsPerformance
              </h1>
              <p className="text-sm sm:text-base text-secondary-600 max-w-2xl mx-auto sm:mx-0">
                Visualize as métricas e indicadores dos seus pacientes em tempo real
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewLoading ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <StatsCard
                    title="Total de Pacientes"
                    value={overview?.total_athletes ?? 0}
                    icon={<Users className="h-5 w-5" />}
                    variant="primary"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Número total de pacientes cadastrados no sistema</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <StatsCard
                    title="Pacientes Ativos"
                    value={overview?.active_athletes ?? 0}
                    icon={<Activity className="h-5 w-5" />}
                    variant="success"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pacientes ativos e disponíveis para tratamento</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <StatsCard
                    title="Alto Risco"
                    value={overview?.high_risk_athletes ?? 0}
                    icon={<AlertTriangle className="h-5 w-5" />}
                    variant="warning"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pacientes com risco elevado de lesão</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <StatsCard
                    title="Fadiga Crítica"
                    value={overview?.critical_fatigue_athletes ?? 0}
                    icon={<Heart className="h-5 w-5" />}
                    variant="danger"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pacientes com nível de fadiga crítico</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>

      {/* VO2 Max Card */}
      {overview && overview.avg_vo2_max > 0 && (
        <Card className="bg-primary-50/50 border-primary-200">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-500">VO2 Maximo Medio</p>
              <p className="text-2xl font-bold text-secondary-900">{overview.avg_vo2_max} <span className="text-base font-normal text-secondary-500">ml/kg/min</span></p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts Section */}
        <Card className="bg-primary-50/50 border-primary-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-500" />
              Alertas Críticos
            </CardTitle>
            <Badge variant="warning">{allAlerts.length}</Badge>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <Loading text="Carregando alertas..." />
            ) : allAlerts.length === 0 ? (
              <EmptyState
                title="Nenhum alerta"
                description="Todos os pacientes estão dentro dos parâmetros normais"
              />
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {allAlerts.map((alert, index) => (
                  <div
                    key={`${alert.athlete_id}-${alert.alert_type}-${index}`}
                    className="flex items-start gap-3 rounded-lg border border-secondary-100 bg-secondary-50/50 p-3 transition-all duration-200 hover:bg-secondary-100/50 hover:shadow-sm hover:-translate-y-0.5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        alert.severity === 'high'
                          ? 'bg-danger-100 text-danger-600'
                          : alert.severity === 'medium'
                            ? 'bg-warning-100 text-warning-600'
                            : 'bg-secondary-100 text-secondary-600'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-secondary-900 truncate">
                          {alert.name}
                        </span>
                        <Badge variant={getAlertVariant(alert.severity)} size="sm">
                          {alert.severity === 'high' ? 'Alto' : alert.severity === 'medium' ? 'Medio' : 'Baixo'}
                        </Badge>
                      </div>
                      {alert.position && (
                        <p className="text-xs text-secondary-500 mt-0.5">{alert.position}</p>
                      )}
                      <p className="text-sm text-secondary-600 mt-1">{alert.message}</p>
                      {alert.time_ago && (
                        <p className="text-xs text-secondary-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.time_ago}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointments Section */}
        <Card className="bg-primary-50/50 border-primary-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-500" />
              Atendimentos do Mês
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/appointments" className='flex justify-center items-center'>
                Ver todos
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <Loading text="Carregando atendimentos..." />
            ) : appointments.length === 0 ? (
              <EmptyState
                icon={<Calendar className="h-6 w-6" />}
                title="Nenhum atendimento"
                description="Nenhum atendimento agendado para este mês"
                action={
                  <Button size="sm" asChild>
                    <Link to="/appointments">Agendar atendimento</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {appointments
                  .filter((apt) => {
                    const aptDate = new Date(apt.appointmentDate)
                    return aptDate >= now
                  })
                  .slice(0, 8)
                  .map((appointment) => {
                    const aptDate = new Date(appointment.appointmentDate)
                    const dateStr = aptDate.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                    })
                    const timeStr = aptDate.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    const statusConfig = getStatusBadge(appointment.status)

                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center gap-3 rounded-lg border border-primary-200 bg-white/80 p-3 transition-all duration-200 hover:shadow-md hover:border-primary-300 hover:-translate-y-0.5"
                      >
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                          <span className="text-xs font-medium">{dateStr.split('/')[1]}</span>
                          <span className="text-lg font-bold leading-tight">{dateStr.split('/')[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-secondary-900 truncate">
                              {appointment.athlete?.name || `Paciente #${appointment.athleteId}`}
                            </span>
                            <Badge variant={statusConfig.variant} size="sm">
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-secondary-500 mt-0.5">
                            {timeStr} - {getTypeLabel(appointment.type)} ({appointment.durationMinutes} min)
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trends Section */}
      {!trendsLoading && trends && trends.daily_metrics.length > 0 && (
        <Card className="bg-primary-50/50 border-primary-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" />
              Tendencias (Ultimos 7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Daily Metrics */}
              <div>
                <h4 className="text-sm font-medium text-secondary-700 mb-3">Metricas Diarias</h4>
                <div className="space-y-2">
                  {trends.daily_metrics.slice(-5).map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-secondary-100 bg-secondary-50/50 p-3"
                    >
                      <span className="text-sm font-medium text-secondary-700">
                        {new Date(metric.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-secondary-500">Fadiga:</span>
                          <span className={`font-medium ${metric.avg_fatigue > 70 ? 'text-danger-600' : metric.avg_fatigue > 50 ? 'text-warning-600' : 'text-success-600'}`}>
                            {metric.avg_fatigue}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-secondary-500">VO2:</span>
                          <span className="font-medium text-secondary-700">{metric.avg_vo2}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-secondary-500">FC:</span>
                          <span className="font-medium text-secondary-700">{metric.avg_heart_rate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Injury Trends */}
              {trends.injury_trends.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-secondary-700 mb-3">Lesões Recentes</h4>
                  <div className="space-y-2">
                    {trends.injury_trends.slice(-5).map((trend, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-secondary-100 bg-secondary-50/50 p-3"
                      >
                        <span className="text-sm font-medium text-secondary-700">
                          {new Date(trend.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                        <Badge variant={trend.new_injuries > 0 ? 'danger' : 'success'} size="sm">
                          {trend.new_injuries} nova{trend.new_injuries !== 1 ? 's' : ''} lesão{trend.new_injuries !== 1 ? 'ões' : ''}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {trendsLoading && (
        <Card className="bg-primary-50/50 border-primary-200">
          <CardContent className="py-8">
            <Loading text="Carregando tendencias..." />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
