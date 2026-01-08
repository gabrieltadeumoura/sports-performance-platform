import { DateTime } from 'luxon'
import PatientEvolution from '#models/patient_evolution'
import type { EvolutionTypeEnum } from '../enums/evolution_type_enum.js'

export class PatientEvolutionService {
	static async create(payload: {
		athleteId: number
		userId: number
		treatmentPlanId?: number
		evolutionDate: Date
		type: EvolutionTypeEnum
		metrics?: any
		painLevel?: number
		rangeOfMotion?: number
		strengthLevel?: number
		observations: string
		attachments?: string[]
	}): Promise<PatientEvolution> {
		const evolution = await PatientEvolution.create({
			...payload,
			evolutionDate: DateTime.fromJSDate(payload.evolutionDate),
		})
		return evolution
	}

	static async update(
		id: number,
		payload: Partial<{
			evolutionDate: Date
			type: EvolutionTypeEnum
			metrics: any
			painLevel: number
			rangeOfMotion: number
			strengthLevel: number
			observations: string
			attachments: string[]
		}>,
	): Promise<PatientEvolution> {
		const evolution = await PatientEvolution.findOrFail(id)
		const toMerge: any = { ...payload }

		if (payload.evolutionDate) {
			toMerge.evolutionDate = DateTime.fromJSDate(payload.evolutionDate)
		}

		evolution.merge(toMerge)
		await evolution.save()
		return evolution
	}

	static async delete(id: number): Promise<void> {
		const evolution = await PatientEvolution.findOrFail(id)
		await evolution.delete()
	}

	static async findByAthlete(athleteId: number): Promise<PatientEvolution[]> {
		return await PatientEvolution.query()
			.where('athleteId', athleteId)
			.orderBy('evolutionDate', 'desc')
	}

	static async findByTreatmentPlan(
		treatmentPlanId: number,
	): Promise<PatientEvolution[]> {
		return await PatientEvolution.query()
			.where('treatmentPlanId', treatmentPlanId)
			.orderBy('evolutionDate', 'desc')
	}
}
