import { z } from 'zod'

// Message schema
export const messageSchema = z.object({
	message: z
		.string()
		.min(1, 'A mensagem não pode estar vazia')
		.max(2000, 'A mensagem não pode ter mais de 2000 caracteres'),
	conversationId: z.string().optional(),
})

export type MessageFormData = z.infer<typeof messageSchema>

// Conversation schema
export const conversationSchema = z.object({
	title: z
		.string()
		.min(1, 'O título não pode estar vazio')
		.max(100, 'O título não pode ter mais de 100 caracteres'),
})

export type ConversationFormData = z.infer<typeof conversationSchema>
