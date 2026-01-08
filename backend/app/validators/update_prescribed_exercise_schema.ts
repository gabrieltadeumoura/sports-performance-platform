import vine from '@vinejs/vine'

export const UpdatePrescribedExerciseSchema = vine.object({
	sets: vine.number().positive().optional(),
	repetitions: vine.number().positive().optional(),
	durationSeconds: vine.number().positive().optional(),
	restSeconds: vine.number().positive().optional(),
	frequency: vine.string().trim().minLength(3).optional(),
	displayOrder: vine.number().optional(),
	instructions: vine.string().trim().optional(),
	notes: vine.string().trim().optional(),
	isActive: vine.boolean().optional(),
})
