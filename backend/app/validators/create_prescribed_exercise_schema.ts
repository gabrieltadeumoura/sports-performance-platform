import vine from '@vinejs/vine'

export const CreatePrescribedExerciseSchema = vine.object({
	treatmentPlanId: vine.number().positive(),
	exerciseId: vine.number().positive(),
	sets: vine.number().positive(),
	repetitions: vine.number().positive().optional(),
	durationSeconds: vine.number().positive().optional(),
	restSeconds: vine.number().positive().optional(),
	frequency: vine.string().trim().minLength(3),
	displayOrder: vine.number().optional(),
	instructions: vine.string().trim().optional(),
	notes: vine.string().trim().optional(),
	isActive: vine.boolean().optional(),
})
