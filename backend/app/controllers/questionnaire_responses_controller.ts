import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import { QuestionnaireResponseService } from '#services/QuestionnaireResponseService'
import { CreateQuestionnaireResponseSchema } from '#validators/create_questionnaire_response_schema'

export default class QuestionnaireResponsesController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: CreateQuestionnaireResponseSchema,
			data,
		})

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const questionnaireResponse = await QuestionnaireResponseService.create({
			...payload,
			userId,
		})

		return response.status(201).json({
			status: 201,
			message: 'Questionnaire response created',
			response: questionnaireResponse,
		})
	}

	public async listByQuestionnaire({ params, response }: HttpContext) {
		const responses = await QuestionnaireResponseService.findByQuestionnaire(
			params.questionnaireId,
		)

		return response.json({ status: 200, responses })
	}

	public async listByAthlete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const athlete = await Athlete.findOrFail(params.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const responses = await QuestionnaireResponseService.findByAthlete(
			params.athleteId,
		)

		return response.json({ status: 200, responses })
	}

	public async listByTreatmentPlan({ params, response }: HttpContext) {
		const responses = await QuestionnaireResponseService.findByTreatmentPlan(
			params.treatmentPlanId,
		)

		return response.json({ status: 200, responses })
	}

	public async show({ params, response }: HttpContext) {
		const questionnaireResponse = await QuestionnaireResponseService.findById(
			params.id,
		)

		return response.json({ status: 200, response: questionnaireResponse })
	}
}
