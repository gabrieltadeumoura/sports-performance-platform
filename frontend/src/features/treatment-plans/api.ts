import { apiClient } from '../../lib/api'

export type TreatmentPlan = {
  id: number
  athleteId: number
  userId: number
  injuryRecordId: number | null
  diagnosis: string
  objectives: string
  notes: string | null
  startDate: string
  endDate: string | null
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  createdAt?: string
  updatedAt?: string
  athlete?: {
    id: number
    name: string
  }
  injuryRecord?: {
    id: number
    injuryType: string
  }
}

export type CreateTreatmentPlanPayload = {
  athleteId: number
  injuryRecordId?: number
  diagnosis: string
  objectives: string
  notes?: string
  startDate: string
  endDate?: string
  status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
}

export type UpdateTreatmentPlanPayload = Partial<CreateTreatmentPlanPayload>

export function getTreatmentPlans() {
  return apiClient.get<{ status: number; treatmentPlans: TreatmentPlan[] }>(
    '/api/treatment-plans',
  )
}

export function getTreatmentPlanById(id: number) {
  return apiClient.get<{ status: number; treatmentPlan: TreatmentPlan }>(
    `/api/treatment-plans/${id}`,
  )
}

export function getTreatmentPlansByAthlete(athleteId: number) {
  return apiClient.get<{ status: number; treatmentPlans: TreatmentPlan[] }>(
    `/api/treatment-plans/athlete/${athleteId}`,
  )
}

export function createTreatmentPlan(payload: CreateTreatmentPlanPayload) {
  return apiClient.post<{ status: number; message: string; treatmentPlan: TreatmentPlan }>(
    '/api/treatment-plans',
    payload,
  )
}

export function updateTreatmentPlan(id: number, payload: UpdateTreatmentPlanPayload) {
  return apiClient.patch<{ status: number; message: string; treatmentPlan: TreatmentPlan }>(
    `/api/treatment-plans/${id}`,
    payload,
  )
}

export function deleteTreatmentPlan(id: number) {
  return apiClient.delete<{ status: number; message: string }>(`/api/treatment-plans/${id}`)
}

export function activateTreatmentPlan(id: number) {
  return apiClient.post<{ status: number; message: string; treatmentPlan: TreatmentPlan }>(
    `/api/treatment-plans/${id}/activate`,
  )
}

export function pauseTreatmentPlan(id: number) {
  return apiClient.post<{ status: number; message: string; treatmentPlan: TreatmentPlan }>(
    `/api/treatment-plans/${id}/pause`,
  )
}

export function completeTreatmentPlan(id: number) {
  return apiClient.post<{ status: number; message: string; treatmentPlan: TreatmentPlan }>(
    `/api/treatment-plans/${id}/complete`,
  )
}
