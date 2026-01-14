import { DateTime } from 'luxon'
import Appointment from '#models/appointment'
import { AppointmentStatusEnum } from '../enums/appointment_status_enum.js'
import type { AppointmentTypeEnum } from '../enums/appointment_type_enum.js'

export class AppointmentService {
	static async create(payload: {
		athleteId: number
		userId: number
		treatmentPlanId?: number
		appointmentDate: Date
		durationMinutes?: number
		type: AppointmentTypeEnum
		status?: AppointmentStatusEnum
		notes?: string
		reason?: string
		observations?: string
		reminderSent?: boolean
	}): Promise<Appointment> {
		const appointment = await Appointment.create({
			...payload,
			appointmentDate: DateTime.fromJSDate(payload.appointmentDate),
			durationMinutes: payload.durationMinutes ?? 60,
			status: payload.status ?? AppointmentStatusEnum.SCHEDULED,
			reminderSent: payload.reminderSent ?? false,
		})
		return appointment
	}

	static async update(
		id: number,
		payload: Partial<{
			appointmentDate: Date
			durationMinutes: number
			type: AppointmentTypeEnum
			status: AppointmentStatusEnum
			notes: string
			reason: string
			observations: string
			reminderSent: boolean
		}>,
	): Promise<Appointment> {
		const appointment = await Appointment.findOrFail(id)
		const toMerge: any = { ...payload }

		if (payload.appointmentDate) {
			toMerge.appointmentDate = DateTime.fromJSDate(payload.appointmentDate)
		}

		appointment.merge(toMerge)
		await appointment.save()
		return appointment
	}

	static async delete(id: number): Promise<void> {
		const appointment = await Appointment.findOrFail(id)
		await appointment.delete()
	}

	static async findByAthlete(athleteId: number): Promise<Appointment[]> {
		return await Appointment.query()
			.where('athleteId', athleteId)
			.orderBy('appointmentDate', 'desc')
	}

	static async findByUser(userId: number): Promise<Appointment[]> {
		return await Appointment.query()
			.where('userId', userId)
			.preload('athlete')
			.orderBy('appointmentDate', 'desc')
	}

	static async findByDateRange(
		userId: number,
		startDate: Date,
		endDate: Date,
	): Promise<Appointment[]> {
		return await Appointment.query()
			.where('userId', userId)
			.whereBetween('appointmentDate', [
				DateTime.fromJSDate(startDate).toSQL()!,
				DateTime.fromJSDate(endDate).toSQL()!,
			])
			.preload('athlete')
			.orderBy('appointmentDate', 'asc')
	}

	static async confirm(id: number): Promise<Appointment> {
		const appointment = await Appointment.findOrFail(id)
		appointment.status = AppointmentStatusEnum.CONFIRMED
		await appointment.save()
		return appointment
	}

	static async cancel(id: number): Promise<Appointment> {
		const appointment = await Appointment.findOrFail(id)
		appointment.status = AppointmentStatusEnum.CANCELLED
		await appointment.save()
		return appointment
	}

	static async reschedule(id: number, newDate: Date): Promise<Appointment> {
		const appointment = await Appointment.findOrFail(id)
		appointment.appointmentDate = DateTime.fromJSDate(newDate)
		appointment.status = AppointmentStatusEnum.RESCHEDULED
		await appointment.save()
		return appointment
	}

	static async findById(id: number): Promise<Appointment> {
		return await Appointment.query()
			.where('id', id)
			.preload('athlete')
			.preload('user')
			.firstOrFail()
	}

	static async listByMonth(
		userId: number,
		year: number,
		month: number,
	): Promise<Appointment[]> {
		const startDate = DateTime.fromObject({ year, month, day: 1 }).startOf('day')
		const endDate = startDate.endOf('month')

		return await Appointment.query()
			.where('userId', userId)
			.whereBetween('appointmentDate', [startDate.toSQL()!, endDate.toSQL()!])
			.preload('athlete')
			.preload('treatmentPlan')
			.orderBy('appointmentDate', 'asc')
	}
}
