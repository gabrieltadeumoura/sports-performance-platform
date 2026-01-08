import vine from '@vinejs/vine'

export const CreateQuestionnaireResponseSchema = vine.object({
	questionnaireId: vine.number().positive(),
	athleteId: vine.number().positive(),
	treatmentPlanId: vine.number().positive().optional(),
	responses: vine.record(vine.any()),
	notes: vine.string().trim().optional(),
	completedAt: vine.date(),
})
