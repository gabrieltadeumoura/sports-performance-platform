import vine from '@vinejs/vine'
import { RiskLevelEnum } from '../enums/status_athlete_enum.js'

export const CreateAthleteSchema = vine.object({
	name: vine.string(),
	position: vine.string(),
	age: vine.number(),
	height: vine.number(),
	weight: vine.number(),
	team: vine.string(),
	isActive: vine.boolean(),
	riskLevel: vine.enum(Object.values(RiskLevelEnum)),
	biomechanicsProfile: vine.string(),
	currentInjuries: vine.string(),
})
