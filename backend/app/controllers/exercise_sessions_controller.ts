import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import ExerciseSession from '#models/exercise_session'
import { ExerciseSessionService } from '#services/ExerciseSessionService'
import { CreateExerciseSessionSchema } from '#validators/create_exercise_session_schema'

export default class ExerciseSessionsController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: CreateExerciseSessionSchema,
			data,
		})

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const session = await ExerciseSessionService.create(payload)

		return response.status(201).json({
			status: 201,
			message: 'Exercise session created',
			session,
		})
	}

	public async listByPrescribedExercise({ params, response }: HttpContext) {
		const sessions = await ExerciseSessionService.findByPrescribedExercise(
			params.prescribedExerciseId,
		)

		return response.json({ status: 200, sessions })
	}

	public async listByAthlete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const athlete = await Athlete.findOrFail(params.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const sessions = await ExerciseSessionService.findByAthlete(
			params.athleteId,
		)

		return response.json({ status: 200, sessions })
	}

	public async update({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()

		const session = await ExerciseSession.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(session.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await ExerciseSessionService.update(params.id, data)

		return response.json({
			status: 200,
			message: 'Exercise session updated',
			session: updated,
		})
	}
}
