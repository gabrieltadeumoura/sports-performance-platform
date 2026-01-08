import vine from '@vinejs/vine'
import { AssessmentTypeEnum } from '../enums/type_physical_assessment.js'

export const CreatePhysicalAssessmentSchema = vine.object({
	athleteId: vine.number().positive(),
	assessmentDate: vine.date(),
	type: vine.enum(Object.values(AssessmentTypeEnum)),
	rangeOfMotion: vine.any().optional(),
	muscleStrength: vine.any().optional(),
	functionalTests: vine.any().optional(),
	posturalAssessment: vine.any().optional(),
	weight: vine.number().positive().optional(),
	height: vine.number().positive().optional(),
	bodyFatPercentage: vine.number().min(0).max(100).optional(),
	observations: vine.string().trim().optional(),
	limitations: vine.string().trim().optional(),
	recommendations: vine.string().trim().optional(),
	attachments: vine.array(vine.string()).optional(),
})
