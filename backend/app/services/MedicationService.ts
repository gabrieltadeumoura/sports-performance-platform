import { DateTime } from 'luxon'
import Medication from '#models/medication'

export class MedicationService {
	static async create(payload: {
		athleteId: number
		name: string
		dosage?: string
		frequency?: string
		instructions?: string
		prescribedBy?: string
		startDate: Date
		endDate?: Date
		isActive?: boolean
		notes?: string
	}): Promise<Medication> {
		const medication = await Medication.create({
			...payload,
			startDate: DateTime.fromJSDate(payload.startDate),
			endDate: payload.endDate
				? DateTime.fromJSDate(payload.endDate)
				: undefined,
			isActive: payload.isActive ?? true,
		})
		return medication
	}

	static async update(
		id: number,
		payload: Partial<{
			name: string
			dosage: string
			frequency: string
			instructions: string
			prescribedBy: string
			startDate: Date
			endDate: Date
			isActive: boolean
			notes: string
		}>,
	): Promise<Medication> {
		const medication = await Medication.findOrFail(id)
		const toMerge: any = { ...payload }

		if (payload.startDate) {
			toMerge.startDate = DateTime.fromJSDate(payload.startDate)
		}

		if (payload.endDate) {
			toMerge.endDate = DateTime.fromJSDate(payload.endDate)
		}

		medication.merge(toMerge)
		await medication.save()
		return medication
	}

	static async delete(id: number): Promise<void> {
		const medication = await Medication.findOrFail(id)
		await medication.delete()
	}

	static async findByAthlete(
		athleteId: number,
		isActive?: boolean,
	): Promise<Medication[]> {
		const query = Medication.query().where('athleteId', athleteId)

		if (isActive !== undefined) {
			query.where('isActive', isActive)
		}

		return await query.orderBy('startDate', 'desc')
	}

	static async activate(id: number): Promise<Medication> {
		const medication = await Medication.findOrFail(id)
		medication.isActive = true
		await medication.save()
		return medication
	}

	static async deactivate(id: number): Promise<Medication> {
		const medication = await Medication.findOrFail(id)
		medication.isActive = false
		await medication.save()
		return medication
	}
}
