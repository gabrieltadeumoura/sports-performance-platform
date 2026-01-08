import Questionnaire from '#models/questionnaire'
import type { QuestionnaireTypeEnum } from '../enums/questionnaire_type_enum.js'

export class QuestionnaireService {
	static async create(payload: {
		title: string
		description?: string
		type: QuestionnaireTypeEnum
		isActive?: boolean
		displayOrder?: number
	}): Promise<Questionnaire> {
		const questionnaire = await Questionnaire.create({
			...payload,
			isActive: payload.isActive ?? true,
			displayOrder: payload.displayOrder ?? 0,
		})
		return questionnaire
	}

	static async update(
		id: number,
		payload: Partial<{
			title: string
			description: string
			type: QuestionnaireTypeEnum
			isActive: boolean
			displayOrder: number
		}>,
	): Promise<Questionnaire> {
		const questionnaire = await Questionnaire.findOrFail(id)
		questionnaire.merge(payload)
		await questionnaire.save()
		return questionnaire
	}

	static async delete(id: number): Promise<void> {
		const questionnaire = await Questionnaire.findOrFail(id)
		await questionnaire.delete()
	}

	static async list(filters?: {
		type?: QuestionnaireTypeEnum
		isActive?: boolean
	}): Promise<Questionnaire[]> {
		const query = Questionnaire.query()

		if (filters?.type) {
			query.where('type', filters.type)
		}

		if (filters?.isActive !== undefined) {
			query.where('isActive', filters.isActive)
		}

		return await query.orderBy('displayOrder', 'asc')
	}

	static async findById(id: number): Promise<Questionnaire> {
		return await Questionnaire.query().where('id', id).firstOrFail()
	}
}
