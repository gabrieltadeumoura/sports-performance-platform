import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ChatService } from '#services/ChatService'

// Schema para o formato esperado pelo frontend
const SendMessageSchema = vine.object({
	conversationId: vine.string().uuid({ version: [4] }).optional(),
	message: vine.string().trim().minLength(1).maxLength(2000),
})

export default class ProscoutAIController {
	/**
	 * POST /proscout-ai/messages
	 * Envia mensagem para o chat (formato adaptado para o frontend)
	 */
	public async sendMessage({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()

		// Valida payload
		const payload = await vine.validate({
			schema: SendMessageSchema,
			data,
		})

		try {
			// Processa query usando o ChatService existente
			const chatMessage = await ChatService.processQuery({
				userId,
				query: payload.message,
				conversationId: payload.conversationId,
			})

			// Retorna no formato esperado pelo frontend
			return response.status(201).json({
				conversationId: chatMessage.conversationId,
				message: {
					id: chatMessage.id.toString(),
					role: 'assistant',
					content: chatMessage.response || 'Sem resposta',
					timestamp: chatMessage.createdAt.toISO(),
				},
			})
		} catch (error) {
			console.error('❌ Erro ao processar mensagem do ProscoutAI:', error)

			return response.status(500).json({
				error: 'Erro ao processar mensagem. Tente novamente.',
			})
		}
	}

	/**
	 * GET /proscout-ai/conversations
	 * Lista todas as conversas do usuário
	 */
	public async getConversations({ auth, response }: HttpContext) {
		const userId = auth.user!.id

		try {
			const conversations = await ChatService.listConversations(userId)

			// Adapta para o formato esperado pelo frontend
			const formattedConversations = conversations.map((conv) => ({
				id: conv.conversationId,
				title: conv.lastMessage.substring(0, 50) + '...',
				messages: [],
				createdAt: conv.lastMessageAt,
				updatedAt: conv.lastMessageAt,
			}))

			return response.status(200).json(formattedConversations)
		} catch (error) {
			console.error('❌ Erro ao buscar conversas:', error)
			return response.status(500).json({ error: 'Erro ao buscar conversas' })
		}
	}

	/**
	 * GET /proscout-ai/conversations/:id
	 * Retorna uma conversa específica com todas as mensagens
	 */
	public async getConversation({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const conversationId = params.id

		try {
			const { messages } = await ChatService.getHistory({
				userId,
				conversationId,
				limit: 100,
			})

			// Adapta para o formato esperado pelo frontend
			const formattedMessages = messages.map((msg) => ({
				id: msg.id.toString(),
				role: msg.query ? 'user' : 'assistant',
				content: msg.query || msg.response || '',
				timestamp: msg.createdAt.toISO(),
			}))

			const conversation = {
				id: conversationId,
				title: messages[0]?.query?.substring(0, 50) + '...' || 'Conversa',
				messages: formattedMessages,
				createdAt: messages[messages.length - 1]?.createdAt.toISO() || '',
				updatedAt: messages[0]?.createdAt.toISO() || '',
			}

			return response.status(200).json(conversation)
		} catch (error) {
			console.error('❌ Erro ao buscar conversa:', error)
			return response.status(500).json({ error: 'Erro ao buscar conversa' })
		}
	}

	/**
	 * DELETE /proscout-ai/conversations/:id
	 * Deleta uma conversa (placeholder - implementar se necessário)
	 */
	public async deleteConversation({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const conversationId = params.id

		// TODO: Implementar lógica de deleção se necessário
		console.log(`Deletar conversa ${conversationId} do usuário ${userId}`)

		return response.status(204).send('')
	}
}
