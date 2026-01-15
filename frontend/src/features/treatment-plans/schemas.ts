import { z } from 'zod'

export const treatmentPlanStatusEnum = z.enum(
  ['draft', 'active', 'paused', 'completed', 'cancelled'],
  {
    message: 'Status e obrigatorio',
  },
)

export const createTreatmentPlanSchema = z.object({
  athleteId: z.number().positive('Atleta é obrigatório'),
  injuryRecordId: z.number().positive().nullable().optional(),
  diagnosis: z.string().min(5, 'Diagnóstico deve ter pelo menos 5 caracteres'),
  objectives: z.string().min(10, 'Objetivos devem ter pelo menos 10 caracteres'),
  notes: z.string().nullable().optional(),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().nullable().optional(),
  status: treatmentPlanStatusEnum.optional(),
})

export const updateTreatmentPlanSchema = createTreatmentPlanSchema.partial()

export type CreateTreatmentPlanFormValues = z.infer<typeof createTreatmentPlanSchema>
export type UpdateTreatmentPlanFormValues = z.infer<typeof updateTreatmentPlanSchema>
