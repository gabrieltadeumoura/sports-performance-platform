import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import PhysicalAssessment from '#models/physical_assessment'
import { PhysicalAssessmentService } from '#services/PhysicalAssessmentService'
import { CreatePhysicalAssessmentSchema } from '#validators/create_physical_assessment_schema'

export default class PhysicalAssessmentsController {
	public async list({ auth, response }: HttpContext) {
		const userId = auth.user!.id

		const assessments = await PhysicalAssessmentService.list(userId)

		return response.json({
			status: 200,
			data: assessments,
		})
	}

	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id

		const data = request.only([
			'athleteId',
			'assessmentDate',
			'type',
			'rangeOfMotion',
			'muscleStrength',
			'functionalTests',
			'posturalAssessment',
			'weight',
			'height',
			'bodyFatPercentage',
			'observations',
			'limitations',
			'recommendations',
			'attachments',
		])

		const payload = await vine.validate({
			schema: CreatePhysicalAssessmentSchema,
			data,
		})

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const assessment = await PhysicalAssessmentService.create({
			...payload,
			userId,
		})

		return response.status(201).json({
			status: 201,
			message: 'Physical assessment created successfully',
			assessment,
		})
	}

	public async show({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const assessment = await PhysicalAssessment.query()
			.where('id', params.id)
			.preload('athlete')
			.firstOrFail()

		const athlete = await Athlete.findOrFail(assessment.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		return response.json({
			status: 200,
			assessment,
		})
	}

	public async update({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id

		const data = request.only([
			'assessmentDate',
			'type',
			'rangeOfMotion',
			'muscleStrength',
			'functionalTests',
			'posturalAssessment',
			'weight',
			'height',
			'bodyFatPercentage',
			'observations',
			'limitations',
			'recommendations',
			'attachments',
		])

		const payload = await vine.validate({
			schema: CreatePhysicalAssessmentSchema,
			data,
		})

		const assessment = await PhysicalAssessment.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(assessment.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await PhysicalAssessmentService.update(params.id, payload)

		return response.json({
			status: 200,
			message: 'Physical assessment updated successfully',
			assessment: updated,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const assessment = await PhysicalAssessment.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(assessment.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await PhysicalAssessmentService.delete(params.id)

		return response.json({
			status: 200,
			message: 'Physical assessment deleted successfully',
		})
	}

	public async listByAthlete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const athlete = await Athlete.findOrFail(params.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const assessments = await PhysicalAssessmentService.findByAthlete(
			params.athleteId,
		)

		return response.json({
			status: 200,
			assessments,
		})
	}
}
