import { apiClient } from '../../lib/api'

export type Appointment = {
  id: number
  athleteId: number
  userId: number
  treatmentPlanId: number | null
  appointmentDate: string
  durationMinutes: number
  type: 'consultation' | 'treatment' | 'follow_up' | 'assessment' | 'review'
  status:
    | 'scheduled'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show'
    | 'rescheduled'
  notes: string | null
  reason: string | null
  observations: string | null
  reminderSent: boolean
  createdAt?: string
  updatedAt?: string
  athlete?: {
    id: number
    name: string
  }
  treatmentPlan?: {
    id: number
    diagnosis: string
  }
}

export type CreateAppointmentPayload = {
  athleteId: number
  treatmentPlanId?: number
  appointmentDate: string
  durationMinutes?: number
  type: 'consultation' | 'treatment' | 'follow_up' | 'assessment' | 'review'
  status?:
    | 'scheduled'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show'
    | 'rescheduled'
  notes?: string
  reason?: string
  observations?: string
  reminderSent?: boolean
}

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload>

export function getAppointments() {
  return apiClient.get<{ status: number; appointments: Appointment[] }>(
    '/api/appointments',
  )
}

export function getAppointmentById(id: number) {
  return apiClient.get<{ status: number; appointment: Appointment }>(
    `/api/appointments/${id}`,
  )
}

export function getAppointmentsByMonth(year: number, month: number) {
  return apiClient.get<{ status: number; appointments: Appointment[] }>(
    `/api/appointments/month?year=${year}&month=${month}`,
  )
}

export function createAppointment(payload: CreateAppointmentPayload) {
  return apiClient.post<{ status: number; message: string; appointment: Appointment }>(
    '/api/appointments',
    payload,
  )
}

export function updateAppointment(id: number, payload: UpdateAppointmentPayload) {
  return apiClient.patch<{ status: number; message: string; appointment: Appointment }>(
    `/api/appointments/${id}`,
    payload,
  )
}

export function deleteAppointment(id: number) {
  return apiClient.delete<{ status: number; message: string }>(`/api/appointments/${id}`)
}

export function confirmAppointment(id: number) {
  return apiClient.post<{ status: number; message: string; appointment: Appointment }>(
    `/api/appointments/${id}/confirm`,
  )
}

export function cancelAppointment(id: number) {
  return apiClient.post<{ status: number; message: string; appointment: Appointment }>(
    `/api/appointments/${id}/cancel`,
  )
}

export function rescheduleAppointment(id: number, newDate: string) {
  return apiClient.post<{ status: number; message: string; appointment: Appointment }>(
    `/api/appointments/${id}/reschedule`,
    { newDate },
  )
}
