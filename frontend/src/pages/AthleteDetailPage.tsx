import { useParams } from 'react-router-dom'
import {
  useAthlete,
  useAthleteBiomechanics,
  useAthleteProfile,
} from '../features/athletes/hooks'

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
    return <div className="text-sm text-zinc-400">Carregando...</div>
  }

  if (!athlete) {
    return <div className="text-sm text-red-400">Atleta não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{athlete.name}</h1>
        <p className="text-sm text-zinc-400">
          {athlete.sport} • {athlete.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-medium text-zinc-400 mb-2">Informações Básicas</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-zinc-400">Idade:</span>{' '}
              <span>
                {athlete.birthDate
                  ? `${new Date().getFullYear() - athlete.birthDate} anos`
                  : '-'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400">Altura:</span>{' '}
              <span>{athlete.height ? `${athlete.height}cm` : '-'}</span>
            </div>
            <div>
              <span className="text-zinc-400">Peso:</span>{' '}
              <span>{athlete.weight ? `${athlete.weight}kg` : '-'}</span>
            </div>
            <div>
              <span className="text-zinc-400">E-mail:</span> <span>{athlete.email}</span>
            </div>
            {athlete.phone && (
              <div>
                <span className="text-zinc-400">Telefone:</span> <span>{athlete.phone}</span>
              </div>
            )}
            <div>
              <span className="text-zinc-400">Status:</span>{' '}
              <span
                className={
                  athlete.status === 'active'
                    ? 'text-green-400'
                    : athlete.status === 'treatment'
                      ? 'text-yellow-400'
                      : 'text-zinc-400'
                }
              >
                {athlete.status === 'active'
                  ? 'Ativo'
                  : athlete.status === 'treatment'
                    ? 'Em Tratamento'
                    : athlete.status === 'removed'
                      ? 'Removido'
                      : 'Liberado'}
              </span>
            </div>
          </div>
        </div>

        {profileLoading ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm text-zinc-400">Carregando perfil...</div>
          </div>
        ) : profile ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="text-sm font-medium text-zinc-400 mb-2">Risco de Lesão</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-400">Nível:</span>{' '}
                <span className="font-medium">{profile.injuryRisk.level}</span>
              </div>
              {profile.injuryRisk.factors.length > 0 && (
                <div>
                  <div className="text-zinc-400 mb-1">Fatores:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {profile.injuryRisk.factors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.injuryRisk.recommendations.length > 0 && (
                <div>
                  <div className="text-zinc-400 mb-1">Recomendações:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {profile.injuryRisk.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {biomechanicsLoading ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm text-zinc-400">Carregando análise biomecânica...</div>
          </div>
        ) : biomechanics ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="text-sm font-medium text-zinc-400 mb-2">Análise Biomecânica</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-400">Postura:</span>{' '}
                <span>{biomechanics.analysis.posture}</span>
              </div>
              {biomechanics.analysis.movementPatterns.length > 0 && (
                <div>
                  <div className="text-zinc-400 mb-1">Padrões de Movimento:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {biomechanics.analysis.movementPatterns.map((pattern, idx) => (
                      <li key={idx}>{pattern}</li>
                    ))}
                  </ul>
                </div>
              )}
              {biomechanics.analysis.imbalances.length > 0 && (
                <div>
                  <div className="text-zinc-400 mb-1">Desequilíbrios:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {biomechanics.analysis.imbalances.map((imbalance, idx) => (
                      <li key={idx}>{imbalance}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
