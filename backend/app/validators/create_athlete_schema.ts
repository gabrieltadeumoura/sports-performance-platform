import vine from '@vinejs/vine'
import { StatusAthleteEnum } from '../enums/status_athlete_enum.js'

export const CreateAthleteSchema = vine.object({
	name: vine.string(),
	sport: vine.string(),
	birthDate: vine.number(),
	height: vine.number().nullable(),
	weight: vine.number().nullable(),
	status: vine.enum(Object.values(StatusAthleteEnum)),
	phone: vine.string().nullable(),
	email: vine.string().email(),
})
