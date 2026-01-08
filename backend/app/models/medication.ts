import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Athlete from './athlete.js'

export default class Medication extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare athleteId: number

	@column()
	declare name: string

	@column()
	declare dosage: string | null

	@column()
	declare frequency: string | null

	@column()
	declare instructions: string | null

	@column()
	declare prescribedBy: string | null

	@column.date()
	declare startDate: DateTime

	@column.date()
	declare endDate: DateTime | null

	@column()
	declare isActive: boolean

	@column()
	declare notes: string | null

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => Athlete)
	declare athlete: BelongsTo<typeof Athlete>
}
