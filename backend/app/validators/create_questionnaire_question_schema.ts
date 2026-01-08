import vine from '@vinejs/vine'
import { QuestionTypeEnum } from '../enums/question_type_enum.js'

export const CreateQuestionnaireQuestionSchema = vine.object({
	questionnaireId: vine.number().positive(),
	questionText: vine.string().trim().minLength(5),
	questionType: vine.enum(Object.values(QuestionTypeEnum)),
	options: vine.array(vine.string()).optional(),
	isRequired: vine.boolean().optional(),
	displayOrder: vine.number().optional(),
	helpText: vine.string().trim().optional(),
})
