import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import PatientEvolution from '#models/patient_evolution'
import { PatientEvolutionService } from '#services/PatientEvolutionService'
import { CreatePatientEvolutionSchema } from '#validators/create_patient_evolution_schema'

export default class PatientEvolutionsController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: CreatePatientEvolutionSchema,
			data,
		})

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const evolution = await PatientEvolutionService.create({
			...payload,
			userId,
		})

		return response
			.status(201)
			.json({ status: 201, message: 'Patient evolution created', evolution })
	}

	public async listByAthlete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const athlete = await Athlete.findOrFail(params.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const evolutions = await PatientEvolutionService.findByAthlete(
			params.athleteId,
		)

		return response.json({ status: 200, evolutions })
	}

	public async listByTreatmentPlan({ params, response }: HttpContext) {
		const evolutions = await PatientEvolutionService.findByTreatmentPlan(
			params.treatmentPlanId,
		)

		return response.json({ status: 200, evolutions })
	}

	public async update({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()

		const evolution = await PatientEvolution.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(evolution.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await PatientEvolutionService.update(params.id, data)

		return response.json({
			status: 200,
			message: 'Patient evolution updated',
			evolution: updated,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const evolution = await PatientEvolution.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(evolution.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await PatientEvolutionService.delete(params.id)

		return response.json({ status: 200, message: 'Patient evolution deleted' })
	}
}
