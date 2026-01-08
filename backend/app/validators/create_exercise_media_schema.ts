import vine from '@vinejs/vine'
import { MediaTypeEnum } from '../enums/media_type_enum.js'

export const CreateExerciseMediaSchema = vine.object({
	exerciseId: vine.number().positive(),
	type: vine.enum(Object.values(MediaTypeEnum)),
	url: vine.string().url(),
	thumbnailUrl: vine.string().url().optional(),
	displayOrder: vine.number().optional(),
	description: vine.string().trim().optional(),
})
