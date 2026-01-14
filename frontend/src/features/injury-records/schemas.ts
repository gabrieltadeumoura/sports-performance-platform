import { z } from 'zod'

export const createInjuryRecordSchema = z.object({
  athleteId: z.number().min(1, 'Selecione um atleta'),
  injuryType: z.string().min(1, 'Tipo de lesão é obrigatório'),
  bodyPart: z.string().min(1, 'Parte do corpo é obrigatória'),
  severity: z.enum(['minor', 'moderate', 'severe', 'critical']),
  cause: z.string(),
  expectedRecovery: z.number().min(0, 'Deve ser maior ou igual a 0'),
  actualRecovery: z.number().min(0).optional(),
  treatmentProtocol: z.string(),
  status: z.enum(['active', 'recovering', 'recovered']),
  injuryDate: z.string().min(1, 'Data da lesão é obrigatória').transform(date => {
    return new Date(date + 'T00:00:00.000Z').toISOString()
  }),
  recoveryDate: z.string().optional().transform(date => {
    return date ? new Date(date + 'T00:00:00.000Z').toISOString() : undefined
  }),
})


export const updateInjuryRecordSchema = createInjuryRecordSchema

export type CreateInjuryRecordFormValues = z.input<typeof createInjuryRecordSchema>
export type UpdateInjuryRecordFormValues = z.input<typeof updateInjuryRecordSchema>
