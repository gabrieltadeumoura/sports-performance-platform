import Exercise from '#models/exercise'
import type { BodyRegionEnum } from '../enums/body_region_enum.js'
import type { ExerciseCategoryEnum } from '../enums/exercise_category_enum.js'
import type { ExerciseDifficultyEnum } from '../enums/exercise_difficulty_enum.js'

export class ExerciseService {
	static async create(payload: {
		name: string
		description?: string
		instructions?: string
		category: ExerciseCategoryEnum
		bodyRegion: BodyRegionEnum
		difficulty: ExerciseDifficultyEnum
		estimatedDurationMinutes?: number
		equipmentNeeded?: string
		contraindications?: string
		isActive?: boolean
	}): Promise<Exercise> {
		const exercise = await Exercise.create({
			...payload,
			isActive: payload.isActive ?? true,
		})
		return exercise
	}

	static async update(
		id: number,
		payload: Partial<{
			name: string
			description: string
			instructions: string
			category: ExerciseCategoryEnum
			bodyRegion: BodyRegionEnum
			difficulty: ExerciseDifficultyEnum
			estimatedDurationMinutes: number
			equipmentNeeded: string
			contraindications: string
			isActive: boolean
		}>,
	): Promise<Exercise> {
		const exercise = await Exercise.findOrFail(id)
		exercise.merge(payload)
		await exercise.save()
		return exercise
	}

	static async delete(id: number): Promise<void> {
		const exercise = await Exercise.findOrFail(id)
		await exercise.delete()
	}

	static async list(filters?: {
		category?: ExerciseCategoryEnum
		bodyRegion?: BodyRegionEnum
		isActive?: boolean
	}): Promise<Exercise[]> {
		const query = Exercise.query()

		if (filters?.category) {
			query.where('category', filters.category)
		}

		if (filters?.bodyRegion) {
			query.where('bodyRegion', filters.bodyRegion)
		}

		if (filters?.isActive !== undefined) {
			query.where('isActive', filters.isActive)
		}

		return await query.orderBy('name', 'asc')
	}

	static async findById(id: number): Promise<Exercise> {
		return await Exercise.findOrFail(id)
	}
}
