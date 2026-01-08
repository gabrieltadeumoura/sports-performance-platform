import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { ReportTypeEnum } from '../enums/report_type_enum.js'
import Athlete from './athlete.js'
import TreatmentPlan from './treatment_plan.js'
import User from './user.js'

export default class Report extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare athleteId: number

	@column()
	declare userId: number

	@column()
	declare treatmentPlanId: number | null

	@column()
	declare title: string

	@column()
	declare type: ReportTypeEnum

	@column.date()
	declare reportDate: DateTime

	@column.date()
	declare periodStart: DateTime | null

	@column.date()
	declare periodEnd: DateTime | null

	@column({
		prepare: (value: any) => JSON.stringify(value),
		consume: (value: string) => JSON.parse(value),
	})
	declare data: Record<string, any>

	@column()
	declare summary: string | null

	@column()
	declare recommendations: string | null

	@column({
		prepare: (value: any) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare attachments: string[] | null

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => Athlete)
	declare athlete: BelongsTo<typeof Athlete>

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>

	@belongsTo(() => TreatmentPlan)
	declare treatmentPlan: BelongsTo<typeof TreatmentPlan>
}
