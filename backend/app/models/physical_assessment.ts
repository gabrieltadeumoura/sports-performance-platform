import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { AssessmentTypeEnum } from '../enums/type_physical_assessment.js'
import Athlete from './athlete.js'
import User from './user.js'

export default class PhysicalAssessment extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare athleteId: number

	@column()
	declare userId: number

	@column.date()
	declare assessmentDate: DateTime

	@column()
	declare type: AssessmentTypeEnum

	@column({
		prepare: (value: any) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare rangeOfMotion: Record<string, any> | null

	@column({
		prepare: (value: any) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare muscleStrength: Record<string, any> | null

	@column({
		prepare: (value: any) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare functionalTests: Record<string, any> | null

	@column({
		prepare: (value: any) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare posturalAssessment: Record<string, any> | null

	@column()
	declare weight: number | null

	@column()
	declare height: number | null

	@column()
	declare bodyFatPercentage: number | null

	@column()
	declare observations: string | null

	@column()
	declare limitations: string | null

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
}
