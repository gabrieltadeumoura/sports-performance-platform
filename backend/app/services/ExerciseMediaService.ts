import ExerciseMedia from '#models/exercise_media'
import type { MediaTypeEnum } from '../enums/media_type_enum.js'

export class ExerciseMediaService {
	static async create(payload: {
		exerciseId: number
		type: MediaTypeEnum
		url: string
		thumbnailUrl?: string
		displayOrder?: number
		description?: string
	}): Promise<ExerciseMedia> {
		const media = await ExerciseMedia.create({
			...payload,
			displayOrder: payload.displayOrder ?? 0,
		})
		return media
	}

	static async delete(id: number): Promise<void> {
		const media = await ExerciseMedia.findOrFail(id)
		await media.delete()
	}

	static async findByExercise(exerciseId: number): Promise<ExerciseMedia[]> {
		return await ExerciseMedia.query()
			.where('exerciseId', exerciseId)
			.orderBy('displayOrder', 'asc')
	}
}
