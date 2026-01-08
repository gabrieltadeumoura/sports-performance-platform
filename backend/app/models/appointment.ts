import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { AppointmentStatusEnum } from '../enums/appointment_status_enum.js'
import type { AppointmentTypeEnum } from '../enums/appointment_type_enum.js'
import Athlete from './athlete.js'
import TreatmentPlan from './treatment_plan.js'
import User from './user.js'

export default class Appointment extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare athleteId: number

	@column()
	declare userId: number

	@column()
	declare treatmentPlanId: number | null

	@column.dateTime()
	declare appointmentDate: DateTime

	@column()
	declare durationMinutes: number

	@column()
	declare type: AppointmentTypeEnum

	@column()
	declare status: AppointmentStatusEnum

	@column()
	declare notes: string | null

	@column()
	declare reason: string | null

	@column()
	declare observations: string | null

	@column()
	declare reminderSent: boolean

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
