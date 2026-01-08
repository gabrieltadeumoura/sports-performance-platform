import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { QuestionTypeEnum } from '../enums/question_type_enum.js'
import Questionnaire from './questionnaire.js'

export default class QuestionnaireQuestion extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare questionnaireId: number

	@column()
	declare questionText: string

	@column()
	declare questionType: QuestionTypeEnum

	@column({
		prepare: (value: any) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare options: string[] | null

	@column()
	declare isRequired: boolean

	@column()
	declare displayOrder: number

	@column()
	declare helpText: string | null

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => Questionnaire)
	declare questionnaire: BelongsTo<typeof Questionnaire>
}
