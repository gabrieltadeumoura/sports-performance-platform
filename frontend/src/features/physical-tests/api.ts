import { apiClient } from '../../lib/api'

export type PhysicalAssessment = {
  id: number
  athleteId: number
  assessmentDate: string
  type: string
  rangeOfMotion?: unknown
  muscleStrength?: unknown
  functionalTests?: unknown
  posturalAssessment?: unknown
  weight?: number
  height?: number
  bodyFatPercentage?: number
  observations?: string
  limitations?: string
  recommendations?: string
  attachments?: unknown
}

export type CreatePhysicalAssessmentPayload = {
  athleteId: number
  assessmentDate: string
  type: string
  rangeOfMotion?: unknown
  muscleStrength?: unknown
  functionalTests?: unknown
  posturalAssessment?: unknown
  weight?: number
  height?: number
  bodyFatPercentage?: number
  observations?: string
  limitations?: string
  recommendations?: string
  attachments?: unknown
}

export type UpdatePhysicalAssessmentPayload = Partial<CreatePhysicalAssessmentPayload>

export function getPhysicalAssessments() {
  return apiClient.get<{ data: PhysicalAssessment[] }>('/api/physical-assessments')
}

export function getPhysicalAssessmentById(id: number) {
  return apiClient.get<{ data: PhysicalAssessment }>(`/api/physical-assessments/${id}`)
}

export function getPhysicalAssessmentsByAthlete(athleteId: number) {
  return apiClient.get<{ data: PhysicalAssessment[] }>(
    `/api/physical-assessments/athlete/${athleteId}`,
  )
}

export function createPhysicalAssessment(payload: CreatePhysicalAssessmentPayload) {
  return apiClient.post<{ status: number; message: string; assessment: PhysicalAssessment }>(
    '/api/physical-assessments',
    payload,
  )
}

export function updatePhysicalAssessment(id: number, payload: UpdatePhysicalAssessmentPayload) {
  return apiClient.patch<{ status: number; message: string; assessment: PhysicalAssessment }>(
    `/api/physical-assessments/${id}`,
    payload,
  )
}

export function deletePhysicalAssessment(id: number) {
  return apiClient.delete<{ status: number; message: string }>(`/api/physical-assessments/${id}`)
}
