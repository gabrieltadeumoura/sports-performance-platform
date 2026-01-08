import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { QuestionnaireService } from '#services/QuestionnaireService'
import { CreateQuestionnaireSchema } from '#validators/create_questionnaire_schema'
import type { QuestionnaireTypeEnum } from '../enums/questionnaire_type_enum.js'

export default class QuestionnairesController {
	public async create({ request, response }: HttpContext) {
		const data = request.all()
		const payload = await vine.validate({
			schema: CreateQuestionnaireSchema,
			data,
		})

		const questionnaire = await QuestionnaireService.create(payload)

		return response
			.status(201)
			.json({ status: 201, message: 'Questionnaire created', questionnaire })
	}

	public async list({ request, response }: HttpContext) {
		const { type, isActive } = request.qs()

		const questionnaires = await QuestionnaireService.list({
			type: type as QuestionnaireTypeEnum,
			isActive:
				isActive === 'true' ? true : isActive === 'false' ? false : undefined,
		})

		return response.json({ status: 200, questionnaires })
	}

	public async show({ params, response }: HttpContext) {
		const questionnaire = await QuestionnaireService.findById(params.id)

		return response.json({ status: 200, questionnaire })
	}

	public async update({ params, request, response }: HttpContext) {
		const data = request.all()

		const questionnaire = await QuestionnaireService.update(params.id, data)

		return response.json({
			status: 200,
			message: 'Questionnaire updated',
			questionnaire,
		})
	}

	public async delete({ params, response }: HttpContext) {
		await QuestionnaireService.delete(params.id)

		return response.json({ status: 200, message: 'Questionnaire deleted' })
	}

	public async listByType({ params, response }: HttpContext) {
		const questionnaires = await QuestionnaireService.list({
			type: params.type as QuestionnaireTypeEnum,
			isActive: true,
		})

		return response.json({ status: 200, questionnaires })
	}
}
