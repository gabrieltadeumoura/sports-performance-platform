import { DateTime } from 'luxon'
import QuestionnaireResponse from '#models/questionnaire_response'

export class QuestionnaireResponseService {
	static async create(payload: {
		questionnaireId: number
		athleteId: number
		userId?: number
		treatmentPlanId?: number
		responses: Record<string, any>
		notes?: string
		completedAt: Date
	}): Promise<QuestionnaireResponse> {
		const response = await QuestionnaireResponse.create({
			...payload,
			completedAt: DateTime.fromJSDate(payload.completedAt),
		})
		return response
	}

	static async findByAthlete(
		athleteId: number,
	): Promise<QuestionnaireResponse[]> {
		return await QuestionnaireResponse.query()
			.where('athleteId', athleteId)
			.preload('questionnaire')
			.orderBy('completedAt', 'desc')
	}

	static async findByQuestionnaire(
		questionnaireId: number,
	): Promise<QuestionnaireResponse[]> {
		return await QuestionnaireResponse.query()
			.where('questionnaireId', questionnaireId)
			.orderBy('completedAt', 'desc')
	}

	static async findByTreatmentPlan(
		treatmentPlanId: number,
	): Promise<QuestionnaireResponse[]> {
		return await QuestionnaireResponse.query()
			.where('treatmentPlanId', treatmentPlanId)
			.preload('questionnaire')
			.orderBy('completedAt', 'desc')
	}

	static async findById(id: number): Promise<QuestionnaireResponse> {
		return await QuestionnaireResponse.query()
			.where('id', id)
			.preload('questionnaire')
			.preload('athlete')
			.firstOrFail()
	}
}
