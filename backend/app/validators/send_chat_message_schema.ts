import vine from '@vinejs/vine'

export const SendChatMessageSchema = vine.object({
	query: vine.string().trim().minLength(1).maxLength(2000),
	context: vine.string().trim().optional(),
	conversationId: vine.string().uuid({ version: [4] }).optional(),
	metadata: vine.object({}).optional(),
})
