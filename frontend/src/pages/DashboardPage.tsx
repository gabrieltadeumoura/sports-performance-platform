import { AlertTriangle, TrendingUp, Users, Activity, Calendar } from 'lucide-react'
import {
  useDashboardAlerts,
  useDashboardOverview,
  useDashboardTrends,
} from '../features/dashboard/hooks'
import { useAppointmentsByMonth } from '../features/appointments/hooks'

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

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-900/50 bg-red-950/20'
      case 'medium':
        return 'border-yellow-900/50 bg-yellow-950/20'
      default:
        return 'border-zinc-800 bg-zinc-900/50'
    }
  }

  const getAlertIconColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-yellow-400'
      default:
        return 'text-zinc-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-zinc-400">Total de Atletas</div>
            <Users className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-semibold">
            {overviewLoading ? '...' : overview?.total_athletes ?? 0}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-zinc-400">Atletas Ativos</div>
            <Activity className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-semibold">
            {overviewLoading ? '...' : overview?.active_athletes ?? 0}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-zinc-400">Alto Risco</div>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-semibold">
            {overviewLoading ? '...' : overview?.high_risk_athletes ?? 0}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-zinc-400">Fadiga Crítica</div>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-semibold">
            {overviewLoading ? '...' : overview?.critical_fatigue_athletes ?? 0}
          </div>
        </div>
      </div>

      {overview && overview.avg_vo2_max > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-zinc-400">VO₂ Máximo Médio</div>
              <TrendingUp className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-semibold">{overview.avg_vo2_max} ml/kg/min</div>
          </div>
        </div>
      )}

      {alertsLoading && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Carregando alertas...</div>
        </div>
      )}

      {!alertsLoading && allAlerts.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-semibold mb-4">Alertas Críticos</h2>
          <div className="space-y-2">
            {allAlerts.map((alert, index) => (
              <div
                key={`${alert.athlete_id}-${alert.alert_type}-${index}`}
                className={`flex items-start gap-3 p-3 rounded border ${getAlertSeverityColor(alert.severity)}`}
              >
                <AlertTriangle
                  className={`h-5 w-5 shrink-0 mt-0.5 ${getAlertIconColor(alert.severity)}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{alert.name}</div>
                  {alert.position && (
                    <div className="text-xs text-zinc-500 mt-0.5">{alert.position}</div>
                  )}
                  <div className="text-xs text-zinc-400 mt-1">{alert.message}</div>
                  {alert.time_ago && (
                    <div className="text-xs text-zinc-500 mt-1">{alert.time_ago}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trendsLoading && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Carregando tendências...</div>
        </div>
      )}

      {!trendsLoading && trends && trends.daily_metrics.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-semibold mb-4">Tendências (Últimos 7 dias)</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-zinc-400 mb-2">Métricas Diárias</div>
              <div className="space-y-2">
                {trends.daily_metrics.slice(-5).map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded bg-zinc-950"
                  >
                    <div className="text-xs text-zinc-300">
                      {new Date(metric.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex gap-4 text-xs text-zinc-400">
                      <span>Fadiga: {metric.avg_fatigue}%</span>
                      <span>VO₂: {metric.avg_vo2}</span>
                      <span>FC: {metric.avg_heart_rate} bpm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {trends.injury_trends.length > 0 && (
              <div>
                <div className="text-xs font-medium text-zinc-400 mb-2">Lesões Recentes</div>
                <div className="space-y-2">
                  {trends.injury_trends.slice(-5).map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-zinc-950"
                    >
                      <div className="text-xs text-zinc-300">
                        {new Date(trend.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-red-400">
                        {trend.new_injuries} nova{trend.new_injuries !== 1 ? 's' : ''} lesão
                        {trend.new_injuries !== 1 ? 'ões' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!alertsLoading && allAlerts.length === 0 && !trendsLoading && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">Nenhum alerta ou tendência no momento</p>
        </div>
      )}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Atendimentos do Mês
          </h2>
          <a
            href="/appointments"
            className="text-sm text-sky-400 hover:text-sky-300 underline"
          >
            Ver todos
          </a>
        </div>

        {appointmentsLoading && (
          <div className="text-sm text-zinc-400">Carregando atendimentos...</div>
        )}

        {!appointmentsLoading && appointments.length === 0 && (
          <div className="text-sm text-zinc-400 text-center py-4">
            Nenhum atendimento agendado para este mês
          </div>
        )}

        {!appointmentsLoading && appointments.length > 0 && (
          <div className="space-y-3">
            {appointments
              .filter((apt) => {
                const aptDate = new Date(apt.appointmentDate)
                return aptDate >= now
              })
              .slice(0, 10)
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

                const getStatusColor = (status: string) => {
                  const colors: Record<string, string> = {
                    scheduled: 'bg-blue-900/30 text-blue-400',
                    confirmed: 'bg-green-900/30 text-green-400',
                    in_progress: 'bg-yellow-900/30 text-yellow-400',
                    completed: 'bg-green-900/30 text-green-400',
                    cancelled: 'bg-red-900/30 text-red-400',
                    no_show: 'bg-orange-900/30 text-orange-400',
                    rescheduled: 'bg-purple-900/30 text-purple-400',
                  }
                  return colors[status] || 'bg-zinc-800 text-zinc-400'
                }

                const getStatusLabel = (status: string) => {
                  const labels: Record<string, string> = {
                    scheduled: 'Agendado',
                    confirmed: 'Confirmado',
                    in_progress: 'Em Andamento',
                    completed: 'Concluído',
                    cancelled: 'Cancelado',
                    no_show: 'Não Compareceu',
                    rescheduled: 'Reagendado',
                  }
                  return labels[status] || status
                }

                const getTypeLabel = (type: string) => {
                  const labels: Record<string, string> = {
                    consultation: 'Consulta',
                    treatment: 'Tratamento',
                    follow_up: 'Acompanhamento',
                    assessment: 'Avaliação',
                    review: 'Revisão',
                  }
                  return labels[type] || type
                }

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">
                          {dateStr} às {timeStr}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(appointment.status)}`}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        {appointment.athlete?.name || `Atleta #${appointment.athleteId}`} -{' '}
                        {getTypeLabel(appointment.type)} ({appointment.durationMinutes} min)
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}

