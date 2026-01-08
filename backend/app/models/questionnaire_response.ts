import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Athlete from './athlete.js'
import Questionnaire from './questionnaire.js'
import TreatmentPlan from './treatment_plan.js'
import User from './user.js'

export default class QuestionnaireResponse extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare questionnaireId: number

	@column()
	declare athleteId: number

	@column()
	declare userId: number | null

	@column()
	declare treatmentPlanId: number | null

	@column({
		prepare: (value: any) => JSON.stringify(value),
		consume: (value: string) => JSON.parse(value),
	})
	declare responses: Record<string, any>

	@column()
	declare notes: string | null

	@column.dateTime()
	declare completedAt: DateTime

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => Questionnaire)
	declare questionnaire: BelongsTo<typeof Questionnaire>

	@belongsTo(() => Athlete)
	declare athlete: BelongsTo<typeof Athlete>

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>

	@belongsTo(() => TreatmentPlan)
	declare treatmentPlan: BelongsTo<typeof TreatmentPlan>
}
