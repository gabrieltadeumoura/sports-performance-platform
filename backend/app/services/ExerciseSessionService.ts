import { DateTime } from 'luxon'
import ExerciseSession from '#models/exercise_session'
import { SessionStatusEnum } from '../enums/session_status_enum.js'

export class ExerciseSessionService {
	static async create(payload: {
		prescribedExerciseId: number
		athleteId: number
		sessionDate: Date
		setsCompleted?: number
		repetitionsCompleted?: number
		durationSeconds?: number
		loadKg?: number
		painLevel?: number
		difficultyLevel?: number
		observations?: string
		status?: SessionStatusEnum
	}): Promise<ExerciseSession> {
		const session = await ExerciseSession.create({
			...payload,
			sessionDate: DateTime.fromJSDate(payload.sessionDate),
			status: payload.status ?? SessionStatusEnum.SCHEDULED,
		})
		return session
	}

	static async update(
		id: number,
		payload: Partial<{
			setsCompleted: number
			repetitionsCompleted: number
			durationSeconds: number
			loadKg: number
			painLevel: number
			difficultyLevel: number
			observations: string
			status: SessionStatusEnum
		}>,
	): Promise<ExerciseSession> {
		const session = await ExerciseSession.findOrFail(id)
		session.merge(payload)
		await session.save()
		return session
	}

	static async findByPrescribedExercise(
		prescribedExerciseId: number,
	): Promise<ExerciseSession[]> {
		return await ExerciseSession.query()
			.where('prescribedExerciseId', prescribedExerciseId)
			.orderBy('sessionDate', 'desc')
	}

	static async findByAthlete(athleteId: number): Promise<ExerciseSession[]> {
		return await ExerciseSession.query()
			.where('athleteId', athleteId)
			.orderBy('sessionDate', 'desc')
	}
}
