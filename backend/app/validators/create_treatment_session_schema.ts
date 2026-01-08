import vine from '@vinejs/vine'
import { SessionStatusEnum } from '../enums/session_status_enum.js'

export const CreateTreatmentSessionSchema = vine.object({
	treatmentPlanId: vine.number().positive(),
	athleteId: vine.number().positive(),
	sessionDate: vine.date(),
	type: vine.enum(['in_person', 'remote']),
	techniquesApplied: vine.array(vine.string()).optional(),
	observations: vine.string().trim().optional(),
	nextSteps: vine.string().trim().optional(),
	nextSessionDate: vine.date().optional(),
	status: vine.enum(Object.values(SessionStatusEnum)).optional(),
})
