import { DateTime } from 'luxon'
import TreatmentPlan from '#models/treatment_plan'
import { TreatmentPlanStatusEnum } from '../enums/treatment_plan_status_enum.js'

export class TreatmentPlanService {
	static async create(payload: {
		athleteId: number
		userId: number
		injuryRecordId?: number
		diagnosis: string
		objectives: string
		notes?: string
		startDate: Date
		endDate?: Date
		status?: TreatmentPlanStatusEnum
	}): Promise<TreatmentPlan> {
		const treatmentPlan = await TreatmentPlan.create({
			...payload,
			startDate: DateTime.fromJSDate(payload.startDate),
			endDate: payload.endDate
				? DateTime.fromJSDate(payload.endDate)
				: undefined,
			status: payload.status ?? TreatmentPlanStatusEnum.DRAFT,
		})
		return treatmentPlan
	}

	static async update(
		id: number,
		payload: Partial<{
			injuryRecordId: number
			diagnosis: string
			objectives: string
			notes: string
			startDate: Date
			endDate: Date
			status: TreatmentPlanStatusEnum
		}>,
	): Promise<TreatmentPlan> {
		const treatmentPlan = await TreatmentPlan.findOrFail(id)
		const toMerge: any = { ...payload }

		if (payload.startDate) {
			toMerge.startDate = DateTime.fromJSDate(payload.startDate)
		}

		if (payload.endDate) {
			toMerge.endDate = DateTime.fromJSDate(payload.endDate)
		}

		treatmentPlan.merge(toMerge)
		await treatmentPlan.save()
		return treatmentPlan
	}

	static async delete(id: number): Promise<void> {
		const treatmentPlan = await TreatmentPlan.findOrFail(id)
		await treatmentPlan.delete()
	}

	static async findByAthlete(athleteId: number): Promise<TreatmentPlan[]> {
		return await TreatmentPlan.query()
			.where('athleteId', athleteId)
			.orderBy('startDate', 'desc')
	}

	static async findById(id: number): Promise<TreatmentPlan> {
		return await TreatmentPlan.findOrFail(id)
	}

	static async activate(id: number): Promise<TreatmentPlan> {
		const treatmentPlan = await TreatmentPlan.findOrFail(id)
		treatmentPlan.status = TreatmentPlanStatusEnum.ACTIVE
		await treatmentPlan.save()
		return treatmentPlan
	}

	static async pause(id: number): Promise<TreatmentPlan> {
		const treatmentPlan = await TreatmentPlan.findOrFail(id)
		treatmentPlan.status = TreatmentPlanStatusEnum.PAUSED
		await treatmentPlan.save()
		return treatmentPlan
	}

	static async complete(id: number): Promise<TreatmentPlan> {
		const treatmentPlan = await TreatmentPlan.findOrFail(id)
		treatmentPlan.status = TreatmentPlanStatusEnum.COMPLETED
		await treatmentPlan.save()
		return treatmentPlan
	}
}
