import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'
import type { QuestionnaireTypeEnum } from '../enums/questionnaire_type_enum.js'

export default class Questionnaire extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare title: string

	@column()
	declare description: string | null

	@column()
	declare type: QuestionnaireTypeEnum

	@column()
	declare isActive: boolean

	@column()
	declare displayOrder: number

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime
}
