import vine from '@vinejs/vine'
import { TreatmentPlanStatusEnum } from '../enums/treatment_plan_status_enum.js'

export const CreateTreatmentPlanSchema = vine.object({
	athleteId: vine.number().positive(),
	injuryRecordId: vine.number().positive().optional(),
	diagnosis: vine.string().trim().minLength(5),
	objectives: vine.string().trim().minLength(10),
	notes: vine.string().trim().optional(),
	startDate: vine.date({ formats: ['iso8601'] }),
	endDate: vine.date({ formats: ['iso8601'] }).optional(),
	status: vine.enum(Object.values(TreatmentPlanStatusEnum)).optional(),
})
