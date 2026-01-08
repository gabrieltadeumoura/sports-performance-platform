import { DateTime } from 'luxon'
import TreatmentSession from '#models/treatment_session'
import { SessionStatusEnum } from '../enums/session_status_enum.js'

export class TreatmentSessionService {
	static async create(payload: {
		treatmentPlanId: number
		athleteId: number
		userId: number
		sessionDate: Date
		type: 'in_person' | 'remote'
		techniquesApplied?: string[]
		observations?: string
		nextSteps?: string
		nextSessionDate?: Date
		status?: SessionStatusEnum
	}): Promise<TreatmentSession> {
		const session = await TreatmentSession.create({
			...payload,
			sessionDate: DateTime.fromJSDate(payload.sessionDate),
			nextSessionDate: payload.nextSessionDate
				? DateTime.fromJSDate(payload.nextSessionDate)
				: undefined,
			status: payload.status ?? SessionStatusEnum.SCHEDULED,
		})
		return session
	}

	static async update(
		id: number,
		payload: Partial<{
			sessionDate: Date
			type: 'in_person' | 'remote'
			techniquesApplied: string[]
			observations: string
			nextSteps: string
			nextSessionDate: Date
			status: SessionStatusEnum
		}>,
	): Promise<TreatmentSession> {
		const session = await TreatmentSession.findOrFail(id)
		const toMerge: any = { ...payload }

		if (payload.sessionDate) {
			toMerge.sessionDate = DateTime.fromJSDate(payload.sessionDate)
		}

		if (payload.nextSessionDate) {
			toMerge.nextSessionDate = DateTime.fromJSDate(payload.nextSessionDate)
		}

		session.merge(toMerge)
		await session.save()
		return session
	}

	static async delete(id: number): Promise<void> {
		const session = await TreatmentSession.findOrFail(id)
		await session.delete()
	}

	static async findByTreatmentPlan(
		treatmentPlanId: number,
	): Promise<TreatmentSession[]> {
		return await TreatmentSession.query()
			.where('treatmentPlanId', treatmentPlanId)
			.orderBy('sessionDate', 'desc')
	}

	static async findByAthlete(athleteId: number): Promise<TreatmentSession[]> {
		return await TreatmentSession.query()
			.where('athleteId', athleteId)
			.orderBy('sessionDate', 'desc')
	}
}
