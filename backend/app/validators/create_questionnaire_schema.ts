import vine from '@vinejs/vine'
import { QuestionnaireTypeEnum } from '../enums/questionnaire_type_enum.js'

export const CreateQuestionnaireSchema = vine.object({
	title: vine.string().trim().minLength(3),
	description: vine.string().trim().optional(),
	type: vine.enum(Object.values(QuestionnaireTypeEnum)),
	isActive: vine.boolean().optional(),
	displayOrder: vine.number().optional(),
})
