import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Exercise from './exercise.js'
import TreatmentPlan from './treatment_plan.js'

export default class PrescribedExercise extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare treatmentPlanId: number

	@column()
	declare exerciseId: number

	@column()
	declare sets: number

	@column()
	declare repetitions: number | null

	@column()
	declare durationSeconds: number | null

	@column()
	declare restSeconds: number | null

	@column()
	declare frequency: string

	@column()
	declare displayOrder: number

	@column()
	declare instructions: string | null

	@column()
	declare notes: string | null

	@column()
	declare isActive: boolean

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => TreatmentPlan)
	declare treatmentPlan: BelongsTo<typeof TreatmentPlan>

	@belongsTo(() => Exercise)
	declare exercise: BelongsTo<typeof Exercise>
}
