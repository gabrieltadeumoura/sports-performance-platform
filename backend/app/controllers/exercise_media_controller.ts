import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ExerciseMediaService } from '#services/ExerciseMediaService'
import { CreateExerciseMediaSchema } from '#validators/create_exercise_media_schema'

export default class ExerciseMediaController {
	public async create({ request, response }: HttpContext) {
		const data = request.all()
		const payload = await vine.validate({
			schema: CreateExerciseMediaSchema,
			data,
		})

		const media = await ExerciseMediaService.create(payload)

		return response
			.status(201)
			.json({ status: 201, message: 'Exercise media created', media })
	}

	public async delete({ params, response }: HttpContext) {
		await ExerciseMediaService.delete(params.id)

		return response.json({ status: 200, message: 'Exercise media deleted' })
	}

	public async listByExercise({ params, response }: HttpContext) {
		const media = await ExerciseMediaService.findByExercise(params.exerciseId)

		return response.json({ status: 200, media })
	}
}
