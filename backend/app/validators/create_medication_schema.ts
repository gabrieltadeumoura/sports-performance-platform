import vine from '@vinejs/vine'

export const CreateMedicationSchema = vine.object({
	athleteId: vine.number().positive(),
	name: vine.string().trim().minLength(2),
	dosage: vine.string().trim().optional(),
	frequency: vine.string().trim().optional(),
	instructions: vine.string().trim().optional(),
	prescribedBy: vine.string().trim().optional(),
	startDate: vine.date(),
	endDate: vine.date().optional(),
	isActive: vine.boolean().optional(),
	notes: vine.string().trim().optional(),
})
