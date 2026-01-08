import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { SeverityInjuryEnum } from '../enums/severity_injury_enum.js'
import type { StatusInjuryRecordEnum } from '../enums/status_injury_record_enum.js'
import Athlete from './athlete.js'

export default class InjuryRecord extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare athleteId: number

	@column()
	declare injuryType: string

	@column()
	declare bodyPart: string

	@column()
	declare severity: SeverityInjuryEnum

	@column()
	declare cause: string

	@column()
	declare expectedRecovery: number

	@column()
	declare actualRecovery?: number | null

	@column()
	declare treatmentProtocol: string

	@column()
	declare status: StatusInjuryRecordEnum

	@column.dateTime()
	declare injuryDate: DateTime

	@column.dateTime()
	declare recoveryDate?: DateTime | null

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => Athlete)
	declare athlete: BelongsTo<typeof Athlete>
}
