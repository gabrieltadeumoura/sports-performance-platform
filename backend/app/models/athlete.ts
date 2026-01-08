import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { RiskLevelEnum } from '../enums/status_athlete_enum.js'
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
	declare position: string

	@column()
	declare age: number

	@column()
	declare height: number

	@column()
	declare weight: number

	@column()
	declare team: string

	@column()
	declare isActive: boolean

	@column()
	declare riskLevel: RiskLevelEnum

	@column()
	declare biomechanicsProfile: string

	@column()
	declare currentInjuries: string

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@hasMany(() => InjuryRecord)
	declare injuryRecords: HasMany<typeof InjuryRecord>

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>

	public calculateInjuryRisk(): number {
		let profile: any = {}
		try {
			profile = JSON.parse(this.biomechanicsProfile || '{}')
		} catch (error) {
			profile = {}
		}

		let risk = 0

		if (profile.asymmetry > 15) risk += 25
		if (profile.flexibility < 70) risk += 20
		if (profile.strength_imbalance > 20) risk += 30
		if (profile.previous_injuries > 2) risk += 25

		return Math.min(risk, 100)
	}
}
