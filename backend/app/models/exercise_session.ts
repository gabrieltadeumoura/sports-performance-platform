import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { SessionStatusEnum } from '../enums/session_status_enum.js'
import Athlete from './athlete.js'
import PrescribedExercise from './prescribed_exercise.js'

export default class ExerciseSession extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare prescribedExerciseId: number

	@column()
	declare athleteId: number

	@column.dateTime()
	declare sessionDate: DateTime

	@column()
	declare setsCompleted: number | null

	@column()
	declare repetitionsCompleted: number | null

	@column()
	declare durationSeconds: number | null

	@column()
	declare loadKg: number | null

	@column()
	declare painLevel: number | null

	@column()
	declare difficultyLevel: number | null

	@column()
	declare observations: string | null

	@column()
	declare status: SessionStatusEnum

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => PrescribedExercise)
	declare prescribedExercise: BelongsTo<typeof PrescribedExercise>

	@belongsTo(() => Athlete)
	declare athlete: BelongsTo<typeof Athlete>
}
