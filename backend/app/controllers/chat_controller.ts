import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ChatService } from '#services/ChatService'
import { SendChatMessageSchema } from '#validators/send_chat_message_schema'

export default class ChatController {
	/**
	 * POST /api/v1/chat
	 * Envia uma mensagem/query para o chat (que será processada pela API Python)
	 */
	public async send({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()

		// Valida payload
		const payload = await vine.validate({
			schema: SendChatMessageSchema,
			data,
		})

		try {
			// Processa query (faz chamada para API Python)
			const message = await ChatService.processQuery({
				userId,
				...payload,
			})

			return response.status(201).json({
				status: 201,
				message: 'Message processed successfully',
				chatMessage: message,
			})
		} catch (error) {
			console.error('❌ Erro ao processar mensagem do chat:', error)

			return response.status(500).json({
				status: 500,
				message: 'Erro ao processar mensagem. Tente novamente.',
				error: error instanceof Error ? error.message : 'Erro desconhecido',
			})
		}
	}

	/**
	 * GET /api/v1/chat/history
	 * Retorna histórico de mensagens do usuário
	 */
	public async history({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const conversationId = request.input('conversationId')
		const limit = request.input('limit', 50)
		const offset = request.input('offset', 0)

		const { messages, total } = await ChatService.getHistory({
			userId,
			conversationId,
			limit: Math.min(limit, 100), // máximo 100
			offset,
		})

		return response.status(200).json({
			status: 200,
			messages,
			pagination: {
				total,
				limit,
				offset,
				hasMore: offset + limit < total,
			},
		})
	}

	/**
	 * GET /api/v1/chat/conversations
	 * Lista todas as conversas do usuário
	 */
	public async conversations({ auth, response }: HttpContext) {
		const userId = auth.user!.id

		const conversations = await ChatService.listConversations(userId)

		return response.status(200).json({
			status: 200,
			conversations,
		})
	}
}
