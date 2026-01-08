import vine from '@vinejs/vine'
import { AppointmentStatusEnum } from '../enums/appointment_status_enum.js'
import { AppointmentTypeEnum } from '../enums/appointment_type_enum.js'

export const UpdateAppointmentSchema = vine.object({
	appointmentDate: vine.date().optional(),
	durationMinutes: vine.number().positive().optional(),
	type: vine.enum(Object.values(AppointmentTypeEnum)).optional(),
	status: vine.enum(Object.values(AppointmentStatusEnum)).optional(),
	notes: vine.string().trim().optional(),
	reason: vine.string().trim().optional(),
	observations: vine.string().trim().optional(),
	reminderSent: vine.boolean().optional(),
})
