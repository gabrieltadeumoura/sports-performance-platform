import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Ruler,
  Scale,
  Calendar,
  Activity,
  AlertTriangle,
  Dumbbell,
} from 'lucide-react'
import {
  useAthlete,
  useAthleteBiomechanics,
  useAthleteProfile,
} from '../features/athletes/hooks'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Avatar } from '../components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Loading, LoadingPage } from '../components/ui/loading'
import { EmptyState } from '../components/ui/empty-state'

export function AthleteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const athleteId = id ? parseInt(id, 10) : 0

  const { data: athleteData, isLoading: athleteLoading } = useAthlete(athleteId)
  const { data: profileData, isLoading: profileLoading } = useAthleteProfile(athleteId)
  const { data: biomechanicsData, isLoading: biomechanicsLoading } =
    useAthleteBiomechanics(athleteId)

  const athlete = athleteData?.athlete
  const profile = profileData?.data
  const biomechanics = biomechanicsData?.data

  if (athleteLoading) {
    return <LoadingPage text="Carregando dados do paciente..." />
  }

  if (!athlete) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" asChild>
          <Link to="/athletes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Pacientes
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<User className="h-8 w-8" />}
              title="Paciente não encontrado"
              description="O paciente solicitado não existe ou foi removido"
              action={
                <Button asChild>
                  <Link to="/athletes">Ver todos os pacientes</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
      active: { variant: 'success', label: 'Ativo' },
      treatment: { variant: 'warning', label: 'Em Tratamento' },
      removed: { variant: 'danger', label: 'Removido' },
      released: { variant: 'default', label: 'Liberado' },
    }
    return statusConfig[status] || { variant: 'default' as const, label: status }
  }

  const getRiskBadge = (level: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
      low: { variant: 'success', label: 'Baixo' },
      medium: { variant: 'warning', label: 'Medio' },
      high: { variant: 'danger', label: 'Alto' },
    }
    return config[level.toLowerCase()] || { variant: 'warning' as const, label: level }
  }

  const statusConfig = getStatusBadge(athlete.status)
  const age = athlete.birthDate ? new Date().getFullYear() - athlete.birthDate : null

  return (
    <div className="space-y-6 animate-fade-in">
      
      <Button variant="ghost" asChild>
        <Link to="/athletes">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Atletas
        </Link>
      </Button>

      
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar alt={athlete.name} size="2xl" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-secondary-900">{athlete.name}</h1>
                <Badge variant={statusConfig.variant} size="lg">
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-secondary-500">
                <span className="flex items-center gap-1.5">
                  <Dumbbell className="h-4 w-4" />
                  {athlete.sport}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {athlete.email}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-primary-500" />
              Informacoes Basicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-secondary-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Idade
                </dt>
                <dd className="text-sm font-medium text-secondary-900">
                  {age !== null ? `${age} anos` : '-'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-secondary-500 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Altura
                </dt>
                <dd className="text-sm font-medium text-secondary-900">
                  {athlete.height ? `${athlete.height} cm` : '-'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-secondary-500 flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Peso
                </dt>
                <dd className="text-sm font-medium text-secondary-900">
                  {athlete.weight ? `${athlete.weight} kg` : '-'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-secondary-500 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </dt>
                <dd className="text-sm font-medium text-secondary-900 truncate max-w-[150px]">
                  {athlete.email}
                </dd>
              </div>
              {athlete.phone && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-secondary-500 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </dt>
                  <dd className="text-sm font-medium text-secondary-900">{athlete.phone}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-warning-500" />
              Risco de Lesão
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <Loading text="Carregando perfil..." />
            ) : profile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-500">Nivel de Risco</span>
                  <Badge variant={getRiskBadge(profile.injuryRisk.level).variant} size="lg">
                    {getRiskBadge(profile.injuryRisk.level).label}
                  </Badge>
                </div>

                {profile.injuryRisk.factors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-secondary-700 mb-2">Fatores de Risco</p>
                    <ul className="space-y-1.5">
                      {profile.injuryRisk.factors.map((factor, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-secondary-600 flex items-start gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-warning-400 mt-1.5 shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile.injuryRisk.recommendations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-secondary-700 mb-2">Recomendacoes</p>
                    <ul className="space-y-1.5">
                      {profile.injuryRisk.recommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-secondary-600 flex items-start gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                title="Dados nao disponiveis"
                description="Não há dados de risco de lesão para este paciente"
              />
            )}
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-primary-500" />
              Analise Biomecanica
            </CardTitle>
          </CardHeader>
          <CardContent>
            {biomechanicsLoading ? (
              <Loading text="Carregando analise..." />
            ) : biomechanics ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-secondary-700 mb-1">Postura</p>
                  <p className="text-sm text-secondary-600 bg-secondary-50 rounded-lg p-2">
                    {biomechanics.analysis.posture}
                  </p>
                </div>

                {biomechanics.analysis.movementPatterns.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-secondary-700 mb-2">
                      Padroes de Movimento
                    </p>
                    <ul className="space-y-1.5">
                      {biomechanics.analysis.movementPatterns.map((pattern, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-secondary-600 flex items-start gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-success-400 mt-1.5 shrink-0" />
                          {pattern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {biomechanics.analysis.imbalances.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-secondary-700 mb-2">Desequilibrios</p>
                    <ul className="space-y-1.5">
                      {biomechanics.analysis.imbalances.map((imbalance, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-secondary-600 flex items-start gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-danger-400 mt-1.5 shrink-0" />
                          {imbalance}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                title="Dados nao disponiveis"
                description="Não há análise biomecânica para este paciente"
              />
            )}
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acoes Rapidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link to={`/injury-records?athlete=${athleteId}`}>Ver Historico de Lesões</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/treatments?athlete=${athleteId}`}>Ver Tratamentos</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/appointments?athlete=${athleteId}`}>Ver Atendimentos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
