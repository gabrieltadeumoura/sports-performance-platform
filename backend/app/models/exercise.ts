import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'
import type { BodyRegionEnum } from '../enums/body_region_enum.js'
import type { ExerciseCategoryEnum } from '../enums/exercise_category_enum.js'
import type { ExerciseDifficultyEnum } from '../enums/exercise_difficulty_enum.js'

export default class Exercise extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare name: string

	@column()
	declare description: string | null

	@column()
	declare instructions: string | null

	@column()
	declare category: ExerciseCategoryEnum

	@column()
	declare bodyRegion: BodyRegionEnum

	@column()
	declare difficulty: ExerciseDifficultyEnum

	@column()
	declare estimatedDurationMinutes: number | null

	@column()
	declare equipmentNeeded: string | null

	@column()
	declare contraindications: string | null

	@column()
	declare isActive: boolean

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime
}
