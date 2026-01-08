import vine from '@vinejs/vine'
import { TreatmentPlanStatusEnum } from '../enums/treatment_plan_status_enum.js'

export const UpdateTreatmentPlanSchema = vine.object({
	injuryRecordId: vine.number().positive().optional(),
	diagnosis: vine.string().trim().minLength(5).optional(),
	objectives: vine.string().trim().minLength(10).optional(),
	notes: vine.string().trim().optional(),
	startDate: vine.date().optional(),
	endDate: vine.date().optional(),
	status: vine.enum(Object.values(TreatmentPlanStatusEnum)).optional(),
})
