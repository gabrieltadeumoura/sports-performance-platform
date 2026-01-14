import { z } from 'zod'

export const statusAthleteEnum = z.enum(['active', 'treatment', 'removed', 'released'], {
  errorMap: () => ({ message: 'Status é obrigatório' }),
})

export const createAthleteSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  sport: z.string().min(1, 'Esporte é obrigatório'),
  birthDate: z.number().min(1900).max(new Date().getFullYear()),
  height: z.number().min(0).max(300).nullable().optional(),
  weight: z.number().min(0).max(500).nullable().optional(),
  status: statusAthleteEnum,
  phone: z.string().nullable().optional(),
  email: z.string().email('E-mail inválido'),
})

export const updateAthleteSchema = createAthleteSchema.partial()

export type CreateAthleteFormValues = z.infer<typeof createAthleteSchema>
export type UpdateAthleteFormValues = z.infer<typeof updateAthleteSchema>
