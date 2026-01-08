import PrescribedExercise from '#models/prescribed_exercise'

export class PrescribedExerciseService {
	static async create(payload: {
		treatmentPlanId: number
		exerciseId: number
		sets: number
		repetitions?: number
		durationSeconds?: number
		restSeconds?: number
		frequency: string
		displayOrder?: number
		instructions?: string
		notes?: string
		isActive?: boolean
	}): Promise<PrescribedExercise> {
		const prescribed = await PrescribedExercise.create({
			...payload,
			displayOrder: payload.displayOrder ?? 0,
			isActive: payload.isActive ?? true,
		})
		return prescribed
	}

	static async update(
		id: number,
		payload: Partial<{
			sets: number
			repetitions: number
			durationSeconds: number
			restSeconds: number
			frequency: string
			displayOrder: number
			instructions: string
			notes: string
			isActive: boolean
		}>,
	): Promise<PrescribedExercise> {
		const prescribed = await PrescribedExercise.findOrFail(id)
		prescribed.merge(payload)
		await prescribed.save()
		return prescribed
	}

	static async delete(id: number): Promise<void> {
		const prescribed = await PrescribedExercise.findOrFail(id)
		await prescribed.delete()
	}

	static async findByTreatmentPlan(
		treatmentPlanId: number,
	): Promise<PrescribedExercise[]> {
		return await PrescribedExercise.query()
			.where('treatmentPlanId', treatmentPlanId)
			.preload('exercise')
			.orderBy('displayOrder', 'asc')
	}

	static async activate(id: number): Promise<PrescribedExercise> {
		const prescribed = await PrescribedExercise.findOrFail(id)
		prescribed.isActive = true
		await prescribed.save()
		return prescribed
	}

	static async deactivate(id: number): Promise<PrescribedExercise> {
		const prescribed = await PrescribedExercise.findOrFail(id)
		prescribed.isActive = false
		await prescribed.save()
		return prescribed
	}
}
