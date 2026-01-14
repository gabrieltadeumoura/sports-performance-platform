import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { StatusAthleteEnum } from '../enums/status_athlete_enum.js'
import InjuryRecord from './injuryrecord.js'
import User from './user.js'

export default class Athlete extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare userId: number

	@column()
	declare name: string

	@column()
	declare sport: string

	@column()
	declare birthDate: number

	@column()
	declare height: number | null

	@column()
	declare weight: number | null

	@column()
	declare status: StatusAthleteEnum

	@column()
	declare phone: string | null

	@column()
	declare email: string

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@hasMany(() => InjuryRecord)
	declare injuryRecords: HasMany<typeof InjuryRecord>

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>
}
