import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Appointment from '#models/appointment'
import Athlete from '#models/athlete'
import { AppointmentService } from '#services/AppointmentService'
import { CreateAppointmentSchema } from '#validators/create_appointment_schema'
import { UpdateAppointmentSchema } from '#validators/update_appointment_schema'

export default class AppointmentsController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: CreateAppointmentSchema,
			data,
		})

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const appointment = await AppointmentService.create({ ...payload, userId })

		return response
			.status(201)
			.json({ status: 201, message: 'Appointment created', appointment })
	}

	public async list({ auth, response }: HttpContext) {
		const userId = auth.user!.id

		const appointments = await AppointmentService.findByUser(userId)

		return response.json({ status: 200, appointments })
	}

	public async show({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const appointment = await AppointmentService.findById(params.id)

		if (appointment.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		return response.json({ status: 200, appointment })
	}

	public async update({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: UpdateAppointmentSchema,
			data,
		})

		const appointment = await Appointment.findOrFail(params.id)

		if (appointment.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await AppointmentService.update(params.id, payload)

		return response.json({
			status: 200,
			message: 'Appointment updated',
			appointment: updated,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const appointment = await Appointment.findOrFail(params.id)

		if (appointment.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await AppointmentService.delete(params.id)

		return response.json({ status: 200, message: 'Appointment deleted' })
	}

	public async listByAthlete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const athlete = await Athlete.findOrFail(params.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const appointments = await AppointmentService.findByAthlete(
			params.athleteId,
		)

		return response.json({ status: 200, appointments })
	}

	public async listByUser({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		if (params.userId !== userId.toString()) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const appointments = await AppointmentService.findByUser(userId)

		return response.json({ status: 200, appointments })
	}

	public async listByDateRange({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const { startDate, endDate } = request.qs()

		const appointments = await AppointmentService.findByDateRange(
			userId,
			new Date(startDate),
			new Date(endDate),
		)

		return response.json({ status: 200, appointments })
	}

	public async confirm({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const appointment = await Appointment.findOrFail(params.id)

		if (appointment.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await AppointmentService.confirm(params.id)

		return response.json({
			status: 200,
			message: 'Appointment confirmed',
			appointment: updated,
		})
	}

	public async cancel({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const appointment = await Appointment.findOrFail(params.id)

		if (appointment.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await AppointmentService.cancel(params.id)

		return response.json({
			status: 200,
			message: 'Appointment cancelled',
			appointment: updated,
		})
	}

	public async reschedule({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id
		const { newDate } = request.only(['newDate'])

		const appointment = await Appointment.findOrFail(params.id)

		if (appointment.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await AppointmentService.reschedule(
			params.id,
			new Date(newDate),
		)

		return response.json({
			status: 200,
			message: 'Appointment rescheduled',
			appointment: updated,
		})
	}
}
