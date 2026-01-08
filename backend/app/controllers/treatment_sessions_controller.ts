import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import TreatmentPlan from '#models/treatment_plan'
import TreatmentSession from '#models/treatment_session'
import { TreatmentSessionService } from '#services/TreatmentSessionService'
import { CreateTreatmentSessionSchema } from '#validators/create_treatment_session_schema'

export default class TreatmentSessionsController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: CreateTreatmentSessionSchema,
			data,
		})

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const session = await TreatmentSessionService.create({ ...payload, userId })

		return response
			.status(201)
			.json({ status: 201, message: 'Treatment session created', session })
	}

	public async listByTreatmentPlan({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const plan = await TreatmentPlan.findOrFail(params.treatmentPlanId)
		const athlete = await Athlete.findOrFail(plan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const sessions = await TreatmentSessionService.findByTreatmentPlan(
			params.treatmentPlanId,
		)

		return response.json({ status: 200, sessions })
	}

	public async listByAthlete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const athlete = await Athlete.findOrFail(params.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const sessions = await TreatmentSessionService.findByAthlete(
			params.athleteId,
		)

		return response.json({ status: 200, sessions })
	}

	public async update({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()

		const session = await TreatmentSession.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(session.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await TreatmentSessionService.update(params.id, data)

		return response.json({
			status: 200,
			message: 'Treatment session updated',
			session: updated,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const session = await TreatmentSession.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(session.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await TreatmentSessionService.delete(params.id)

		return response.json({ status: 200, message: 'Treatment session deleted' })
	}
}
