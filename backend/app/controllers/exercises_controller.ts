import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ExerciseService } from '#services/ExerciseService'
import { CreateExerciseSchema } from '#validators/create_exercise_schema'
import { UpdateExerciseSchema } from '#validators/update_exercise_schema'
import type { BodyRegionEnum } from '../enums/body_region_enum.js'
import type { ExerciseCategoryEnum } from '../enums/exercise_category_enum.js'

export default class ExercisesController {
	public async create({ request, response }: HttpContext) {
		const data = request.only([
			'name',
			'description',
			'instructions',
			'category',
			'bodyRegion',
			'difficulty',
			'estimatedDurationMinutes',
			'equipmentNeeded',
			'contraindications',
			'isActive',
		])

		const payload = await vine.validate({ schema: CreateExerciseSchema, data })

		const exercise = await ExerciseService.create(payload)

		return response.status(201).json({
			status: 201,
			message: 'Exercise created successfully',
			exercise,
		})
	}

	public async list({ request, response }: HttpContext) {
		const { category, bodyRegion, isActive } = request.qs()

		const exercises = await ExerciseService.list({
			category: category as ExerciseCategoryEnum,
			bodyRegion: bodyRegion as BodyRegionEnum,
			isActive:
				isActive === 'true' ? true : isActive === 'false' ? false : undefined,
		})

		return response.json({
			status: 200,
			exercises,
		})
	}

	public async show({ params, response }: HttpContext) {
		const exercise = await ExerciseService.findById(params.id)

		return response.json({
			status: 200,
			exercise,
		})
	}

	public async update({ params, request, response }: HttpContext) {
		const data = request.only([
			'name',
			'description',
			'instructions',
			'category',
			'bodyRegion',
			'difficulty',
			'estimatedDurationMinutes',
			'equipmentNeeded',
			'contraindications',
			'isActive',
		])

		const payload = await vine.validate({ schema: UpdateExerciseSchema, data })

		const exercise = await ExerciseService.update(params.id, payload)

		return response.json({
			status: 200,
			message: 'Exercise updated successfully',
			exercise,
		})
	}

	public async delete({ params, response }: HttpContext) {
		await ExerciseService.delete(params.id)

		return response.json({
			status: 200,
			message: 'Exercise deleted successfully',
		})
	}

	public async listByCategory({ params, response }: HttpContext) {
		const exercises = await ExerciseService.list({
			category: params.category as ExerciseCategoryEnum,
			isActive: true,
		})

		return response.json({
			status: 200,
			exercises,
		})
	}

	public async listByBodyRegion({ params, response }: HttpContext) {
		const exercises = await ExerciseService.list({
			bodyRegion: params.region as BodyRegionEnum,
			isActive: true,
		})

		return response.json({
			status: 200,
			exercises,
		})
	}
}
