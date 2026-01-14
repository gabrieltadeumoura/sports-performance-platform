import { apiClient } from '../../lib/api'

export type Athlete = {
  id: number
  name: string
  sport: string
  birthDate: number
  height: number | null
  weight: number | null
  status: 'active' | 'treatment' | 'removed' | 'released'
  phone: string | null
  email: string
  createdAt?: string
  updatedAt?: string
  injuryRecords?: Array<{
    id: number
    injury_type: string
    body_part: string
    severity: string
    status: string
    injury_date: string
  }>
}

export type CreateAthletePayload = {
  name: string
  sport: string
  birthDate: number
  height: number | null
  weight: number | null
  status: 'active' | 'treatment' | 'removed' | 'released'
  phone: string | null
  email: string
}

export type UpdateAthletePayload = Partial<CreateAthletePayload>

export type AthleteProfile = {
  athlete: Athlete
  injuryRisk: {
    level: string
    factors: string[]
    recommendations: string[]
  }
}

export type BiomechanicalProfile = {
  athleteId: number
  analysis: {
    posture: string
    movementPatterns: string[]
    imbalances: string[]
    recommendations: string[]
  }
}

export function getAthletes() {
  return apiClient.get<{ athletes: Athlete[]; updated_at: string }>('/api/athletes')
}

export function getAthleteById(id: number) {
  return apiClient.get<{ data: Athlete }>(`/api/athletes/${id}`)
}

export function getAthleteProfile(id: number) {
  return apiClient.get<{ data: AthleteProfile }>(`/api/athletes/${id}/profile`)
}

export function getAthleteBiomechanics(id: number) {
  return apiClient.get<{ data: BiomechanicalProfile }>(`/api/athletes/${id}/biomechanics`)
}

export function createAthlete(payload: CreateAthletePayload) {
  return apiClient.post<{ status: number; message: string; athlete: Athlete }>(
    '/api/athletes',
    payload,
  )
}

export function updateAthlete(id: number, payload: UpdateAthletePayload) {
  return apiClient.patch<{ status: number; message: string; athlete: Athlete }>(
    `/api/athletes/${id}`,
    payload,
  )
}

export function deleteAthlete(id: number) {
  return apiClient.delete<{ status: number; message: string }>(`/api/athletes/${id}`)
}
