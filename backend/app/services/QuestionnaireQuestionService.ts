import QuestionnaireQuestion from '#models/questionnaire_question'
import type { QuestionTypeEnum } from '../enums/question_type_enum.js'

export class QuestionnaireQuestionService {
	static async create(payload: {
		questionnaireId: number
		questionText: string
		questionType: QuestionTypeEnum
		options?: string[]
		isRequired?: boolean
		displayOrder?: number
		helpText?: string
	}): Promise<QuestionnaireQuestion> {
		const question = await QuestionnaireQuestion.create({
			...payload,
			isRequired: payload.isRequired ?? false,
			displayOrder: payload.displayOrder ?? 0,
		})
		return question
	}

	static async update(
		id: number,
		payload: Partial<{
			questionText: string
			questionType: QuestionTypeEnum
			options: string[]
			isRequired: boolean
			displayOrder: number
			helpText: string
		}>,
	): Promise<QuestionnaireQuestion> {
		const question = await QuestionnaireQuestion.findOrFail(id)
		question.merge(payload)
		await question.save()
		return question
	}

	static async delete(id: number): Promise<void> {
		const question = await QuestionnaireQuestion.findOrFail(id)
		await question.delete()
	}

	static async findByQuestionnaire(
		questionnaireId: number,
	): Promise<QuestionnaireQuestion[]> {
		return await QuestionnaireQuestion.query()
			.where('questionnaireId', questionnaireId)
			.orderBy('displayOrder', 'asc')
	}

	static async reorder(
		questionId: number,
		newOrder: number,
	): Promise<QuestionnaireQuestion> {
		const question = await QuestionnaireQuestion.findOrFail(questionId)
		question.displayOrder = newOrder
		await question.save()
		return question
	}
}
