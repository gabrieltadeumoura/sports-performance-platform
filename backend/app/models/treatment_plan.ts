import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { TreatmentPlanStatusEnum } from '../enums/treatment_plan_status_enum.js'
import Athlete from './athlete.js'
import InjuryRecord from './injuryrecord.js'
import User from './user.js'

export default class TreatmentPlan extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare athleteId: number

	@column()
	declare userId: number

	@column()
	declare injuryRecordId: number | null

	@column()
	declare diagnosis: string

	@column()
	declare objectives: string

	@column()
	declare notes: string | null

	@column.date()
	declare startDate: DateTime

	@column.date()
	declare endDate: DateTime | null

	@column()
	declare status: TreatmentPlanStatusEnum

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => Athlete)
	declare athlete: BelongsTo<typeof Athlete>

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>

	@belongsTo(() => InjuryRecord)
	declare injuryRecord: BelongsTo<typeof InjuryRecord>
}
