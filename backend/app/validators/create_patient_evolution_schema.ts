import vine from '@vinejs/vine'
import { EvolutionTypeEnum } from '../enums/evolution_type_enum.js'

export const CreatePatientEvolutionSchema = vine.object({
	athleteId: vine.number().positive(),
	treatmentPlanId: vine.number().positive().optional(),
	evolutionDate: vine.date(),
	type: vine.enum(Object.values(EvolutionTypeEnum)),
	metrics: vine.any().optional(),
	painLevel: vine.number().min(0).max(10).optional(),
	rangeOfMotion: vine.number().min(0).max(100).optional(),
	strengthLevel: vine.number().min(0).max(100).optional(),
	observations: vine.string().trim().minLength(5),
	attachments: vine.array(vine.string()).optional(),
})
