import { DateTime } from 'luxon'
import PhysicalAssessment from '#models/physical_assessment'
import Athlete from '#models/athlete'
import type { AssessmentTypeEnum } from '../enums/type_physical_assessment.js'

export class PhysicalAssessmentService {
	static async create(payload: {
		athleteId: number
		userId: number
		assessmentDate: Date
		type: AssessmentTypeEnum
		rangeOfMotion?: any
		muscleStrength?: any
		functionalTests?: any
		posturalAssessment?: any
		weight?: number
		height?: number
		bodyFatPercentage?: number
		observations?: string
		limitations?: string
		recommendations?: string
		attachments?: string[]
	}): Promise<PhysicalAssessment> {
		const assessment = await PhysicalAssessment.create({
			...payload,
			assessmentDate: DateTime.fromJSDate(payload.assessmentDate),
		})
		return assessment
	}

	static async update(
		id: number,
		payload: Partial<{
			assessmentDate: Date
			type: AssessmentTypeEnum
			rangeOfMotion: any
			muscleStrength: any
			functionalTests: any
			posturalAssessment: any
			weight: number
			height: number
			bodyFatPercentage: number
			observations: string
			limitations: string
			recommendations: string
			attachments: string[]
		}>,
	): Promise<PhysicalAssessment> {
		const assessment = await PhysicalAssessment.findOrFail(id)
		const toMerge: any = { ...payload }

		if (payload.assessmentDate) {
			toMerge.assessmentDate = DateTime.fromJSDate(payload.assessmentDate)
		}

		assessment.merge(toMerge)
		await assessment.save()
		return assessment
	}

	static async delete(id: number): Promise<void> {
		const assessment = await PhysicalAssessment.findOrFail(id)
		await assessment.delete()
	}

	static async findByAthlete(athleteId: number): Promise<PhysicalAssessment[]> {
		return await PhysicalAssessment.query()
			.where('athleteId', athleteId)
			.orderBy('assessmentDate', 'desc')
	}

	static async findById(id: number): Promise<PhysicalAssessment> {
		return await PhysicalAssessment.findOrFail(id)
	}

	static async list(userId: number): Promise<PhysicalAssessment[]> {
		const athletes = await Athlete.query().where('userId', userId).select('id')
		const athleteIds = athletes.map((a) => a.id)

		const assessments = await PhysicalAssessment.query()
			.whereIn('athleteId', athleteIds)
			.preload('athlete')
			.orderBy('assessmentDate', 'desc')

		return assessments
	}
}
