import { apiClient } from '../../lib/api'

export type InjuryRecord = {
  id: number
  athleteId: number
  injuryType: string
  bodyPart: string
  severity: string
  status: string
  injuryDate: string
  recoveryDate?: string | null
  expectedRecovery?: number | string
  actualRecovery?: number | string | null
  treatmentProtocol?: string
  cause?: string
  athlete?: {
    id: number
    name: string
  }
}

export type CreateInjuryRecordPayload = {
  athleteId: number
  injuryType: string
  bodyPart: string
  severity: string
  status: string
  injuryDate: string
  recoveryDate?: string | null
  expectedRecovery: number
  actualRecovery?: number | null
  treatmentProtocol: string
  cause: string
}

export type UpdateInjuryRecordPayload = Partial<CreateInjuryRecordPayload>

export function getInjuryRecords() {
  return apiClient.get<{ status: number; data: InjuryRecord[] }>('/api/injury-records')
}

export function createInjuryRecord(payload: CreateInjuryRecordPayload) {
  return apiClient.post<{ status: number; message: string; injuryRecord: InjuryRecord }>(
    '/api/injury-records',
    payload,
  )
}

export function updateInjuryRecord(id: number, payload: UpdateInjuryRecordPayload) {
  return apiClient.patch<{ status: number; message: string; injuryRecord: InjuryRecord }>(
    `/api/injury-records/${id}`,
    payload,
  )
}

export function deleteInjuryRecord(id: number) {
  return apiClient.delete<{ status: number; message: string }>(`/api/injury-records/${id}`)
}
