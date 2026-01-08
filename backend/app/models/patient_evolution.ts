import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { EvolutionTypeEnum } from '../enums/evolution_type_enum.js'
import Athlete from './athlete.js'
import TreatmentPlan from './treatment_plan.js'
import User from './user.js'

export default class PatientEvolution extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare athleteId: number

	@column()
	declare userId: number

	@column()
	declare treatmentPlanId: number | null

	@column.date()
	declare evolutionDate: DateTime

	@column()
	declare type: EvolutionTypeEnum

	@column({
		prepare: (value: any) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare metrics: Record<string, any> | null

	@column()
	declare painLevel: number | null

	@column()
	declare rangeOfMotion: number | null

	@column()
	declare strengthLevel: number | null

	@column()
	declare observations: string

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
