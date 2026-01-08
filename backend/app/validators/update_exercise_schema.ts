import vine from '@vinejs/vine'
import { BodyRegionEnum } from '../enums/body_region_enum.js'
import { ExerciseCategoryEnum } from '../enums/exercise_category_enum.js'
import { ExerciseDifficultyEnum } from '../enums/exercise_difficulty_enum.js'

export const UpdateExerciseSchema = vine.object({
	name: vine.string().trim().minLength(3).optional(),
	description: vine.string().trim().optional(),
	instructions: vine.string().trim().optional(),
	category: vine.enum(Object.values(ExerciseCategoryEnum)).optional(),
	bodyRegion: vine.enum(Object.values(BodyRegionEnum)).optional(),
	difficulty: vine.enum(Object.values(ExerciseDifficultyEnum)).optional(),
	estimatedDurationMinutes: vine.number().min(1).optional(),
	equipmentNeeded: vine.string().trim().optional(),
	contraindications: vine.string().trim().optional(),
	isActive: vine.boolean().optional(),
})
