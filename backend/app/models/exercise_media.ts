import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { MediaTypeEnum } from '../enums/media_type_enum.js'
import Exercise from './exercise.js'

export default class ExerciseMedia extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare exerciseId: number

	@column()
	declare type: MediaTypeEnum

	@column()
	declare url: string

	@column()
	declare thumbnailUrl: string | null

	@column()
	declare displayOrder: number

	@column()
	declare description: string | null

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => Exercise)
	declare exercise: BelongsTo<typeof Exercise>
}
