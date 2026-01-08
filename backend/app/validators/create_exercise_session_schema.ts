import vine from '@vinejs/vine'
import { SessionStatusEnum } from '../enums/session_status_enum.js'

export const CreateExerciseSessionSchema = vine.object({
	prescribedExerciseId: vine.number().positive(),
	athleteId: vine.number().positive(),
	sessionDate: vine.date(),
	setsCompleted: vine.number().min(0).optional(),
	repetitionsCompleted: vine.number().min(0).optional(),
	durationSeconds: vine.number().min(0).optional(),
	loadKg: vine.number().min(0).optional(),
	painLevel: vine.number().min(0).max(10).optional(),
	difficultyLevel: vine.number().min(1).max(10).optional(),
	observations: vine.string().trim().optional(),
	status: vine.enum(Object.values(SessionStatusEnum)).optional(),
})
