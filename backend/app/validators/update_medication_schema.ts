import vine from '@vinejs/vine'

export const UpdateMedicationSchema = vine.object({
	name: vine.string().trim().minLength(2).optional(),
	dosage: vine.string().trim().optional(),
	frequency: vine.string().trim().optional(),
	instructions: vine.string().trim().optional(),
	prescribedBy: vine.string().trim().optional(),
	startDate: vine.date().optional(),
	endDate: vine.date().optional(),
	isActive: vine.boolean().optional(),
	notes: vine.string().trim().optional(),
})
