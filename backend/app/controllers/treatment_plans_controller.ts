import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import TreatmentPlan from '#models/treatment_plan'
import { TreatmentPlanService } from '#services/TreatmentPlanService'
import { CreateTreatmentPlanSchema } from '#validators/create_treatment_plan_schema'
import { UpdateTreatmentPlanSchema } from '#validators/update_treatment_plan_schema'

export default class TreatmentPlansController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id

		const data = request.only([
			'athleteId',
			'injuryRecordId',
			'diagnosis',
			'objectives',
			'notes',
			'startDate',
			'endDate',
			'status',
		])

		const payload = await vine.validate({
			schema: CreateTreatmentPlanSchema,
			data,
		})

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const treatmentPlan = await TreatmentPlanService.create({
			...payload,
			userId,
		})

		return response.status(201).json({
			status: 201,
			message: 'Treatment plan created successfully',
			treatmentPlan,
		})
	}

	public async list({ auth, response }: HttpContext) {
		const userId = auth.user!.id

		const athletes = await Athlete.query().where('userId', userId).select('id')
		const athleteIds = athletes.map((a) => a.id)

		const treatmentPlans = await TreatmentPlan.query()
			.whereIn('athleteId', athleteIds)
			.preload('athlete')
			.orderBy('startDate', 'desc')

		return response.json({
			status: 200,
			treatmentPlans,
		})
	}

	public async show({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const treatmentPlan = await TreatmentPlan.query()
			.where('id', params.id)
			.preload('athlete')
			.firstOrFail()

		const athlete = await Athlete.findOrFail(treatmentPlan.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		return response.json({
			status: 200,
			treatmentPlan,
		})
	}

	public async update({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id

		const data = request.only([
			'injuryRecordId',
			'diagnosis',
			'objectives',
			'notes',
			'startDate',
			'endDate',
			'status',
		])

		const payload = await vine.validate({
			schema: UpdateTreatmentPlanSchema,
			data,
		})

		const treatmentPlan = await TreatmentPlan.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(treatmentPlan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await TreatmentPlanService.update(params.id, payload)

		return response.json({
			status: 200,
			message: 'Treatment plan updated successfully',
			treatmentPlan: updated,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const treatmentPlan = await TreatmentPlan.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(treatmentPlan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await TreatmentPlanService.delete(params.id)

		return response.json({
			status: 200,
			message: 'Treatment plan deleted successfully',
		})
	}

	public async listByAthlete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const athlete = await Athlete.findOrFail(params.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const treatmentPlans = await TreatmentPlanService.findByAthlete(
			params.athleteId,
		)

		return response.json({
			status: 200,
			treatmentPlans,
		})
	}

	public async activate({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const treatmentPlan = await TreatmentPlan.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(treatmentPlan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await TreatmentPlanService.activate(params.id)

		return response.json({
			status: 200,
			message: 'Treatment plan activated',
			treatmentPlan: updated,
		})
	}

	public async pause({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const treatmentPlan = await TreatmentPlan.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(treatmentPlan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await TreatmentPlanService.pause(params.id)

		return response.json({
			status: 200,
			message: 'Treatment plan paused',
			treatmentPlan: updated,
		})
	}

	public async complete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const treatmentPlan = await TreatmentPlan.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(treatmentPlan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await TreatmentPlanService.complete(params.id)

		return response.json({
			status: 200,
			message: 'Treatment plan completed',
			treatmentPlan: updated,
		})
	}
}
