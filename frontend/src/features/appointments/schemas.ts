import { z } from 'zod'

export const appointmentStatusEnum = z.enum([
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
  'rescheduled',
])

export const appointmentTypeEnum = z.enum([
  'consultation',
  'treatment',
  'follow_up',
  'assessment',
  'review',
])

export const createAppointmentSchema = z.object({
  athleteId: z.number().positive('Selecione um atleta'),
  treatmentPlanId: z.number().positive().optional(),
  appointmentDate: z.string().min(1, 'Data e hora do atendimento é obrigatória'),
  durationMinutes: z.number().positive().optional(),
  type: appointmentTypeEnum,
  status: appointmentStatusEnum.optional(),
  notes: z.string().optional(),
  reason: z.string().optional(),
  observations: z.string().optional(),
  reminderSent: z.boolean().optional(),
})

export const updateAppointmentSchema = createAppointmentSchema.partial()

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentSchema>
