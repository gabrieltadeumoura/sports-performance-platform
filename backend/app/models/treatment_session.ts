import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { SessionStatusEnum } from '../enums/session_status_enum.js'
import Athlete from './athlete.js'
import TreatmentPlan from './treatment_plan.js'
import User from './user.js'

export default class TreatmentSession extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare treatmentPlanId: number

	@column()
	declare athleteId: number

	@column()
	declare userId: number

	@column.dateTime()
	declare sessionDate: DateTime

	@column()
	declare type: 'in_person' | 'remote'

	@column({
		prepare: (value: any) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare techniquesApplied: string[] | null

	@column()
	declare observations: string | null

	@column()
	declare nextSteps: string | null

	@column.dateTime()
	declare nextSessionDate: DateTime | null

	@column()
	declare status: SessionStatusEnum

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => TreatmentPlan)
	declare treatmentPlan: BelongsTo<typeof TreatmentPlan>

	@belongsTo(() => Athlete)
	declare athlete: BelongsTo<typeof Athlete>

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>
}
