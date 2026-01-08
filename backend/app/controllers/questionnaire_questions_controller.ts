import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { QuestionnaireQuestionService } from '#services/QuestionnaireQuestionService'
import { CreateQuestionnaireQuestionSchema } from '#validators/create_questionnaire_question_schema'

export default class QuestionnaireQuestionsController {
	public async create({ request, response }: HttpContext) {
		const data = request.all()
		const payload = await vine.validate({
			schema: CreateQuestionnaireQuestionSchema,
			data,
		})

		const question = await QuestionnaireQuestionService.create(payload)

		return response
			.status(201)
			.json({ status: 201, message: 'Question created', question })
	}

	public async listByQuestionnaire({ params, response }: HttpContext) {
		const questions = await QuestionnaireQuestionService.findByQuestionnaire(
			params.questionnaireId,
		)

		return response.json({ status: 200, questions })
	}

	public async update({ params, request, response }: HttpContext) {
		const data = request.all()

		const question = await QuestionnaireQuestionService.update(params.id, data)

		return response.json({ status: 200, message: 'Question updated', question })
	}

	public async delete({ params, response }: HttpContext) {
		await QuestionnaireQuestionService.delete(params.id)

		return response.json({ status: 200, message: 'Question deleted' })
	}

	public async reorder({ request, response }: HttpContext) {
		const { questionId, newOrder } = request.only(['questionId', 'newOrder'])

		const question = await QuestionnaireQuestionService.reorder(
			questionId,
			newOrder,
		)

		return response.json({
			status: 200,
			message: 'Question reordered',
			question,
		})
	}
}
