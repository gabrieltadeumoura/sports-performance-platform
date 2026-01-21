import { randomUUID } from 'node:crypto'
import env from '#start/env'
import ChatMessage from '#models/chat_message'
import { ChatMessageStatusEnum } from '../enums/chat_message_status_enum.js'
import { ChatMessageTypeEnum } from '../enums/chat_message_type_enum.js'

export class ChatService {
	/**
	 * URL da API Python externa de chat
	 */
	private static CHAT_API_URL = env.get('CHAT_API_URL', 'http://localhost:8000/api/v1/chat')

	/**
	 * Timeout para requisições (em ms)
	 */
	private static REQUEST_TIMEOUT = env.get('CHAT_API_TIMEOUT', 30000)

	/**
	 * Processa uma query enviando para a API Python externa
	 */
	static async processQuery(payload: {
		userId: number
		query: string
		conversationId?: string
		context?: string
		metadata?: Record<string, any>
	}): Promise<ChatMessage> {
		const startTime = Date.now()

		// Gera conversationId se não existir
		const conversationId = payload.conversationId || randomUUID()

		// Cria mensagem com status pending
		const message = await ChatMessage.create({
			userId: payload.userId,
			conversationId,
			query: payload.query,
			type: ChatMessageTypeEnum.QUERY,
			status: ChatMessageStatusEnum.PENDING,
			metadata: payload.metadata || null,
		})

		try {
			// Atualiza status para processing
			message.status = ChatMessageStatusEnum.PROCESSING
			await message.save()

			// Chama API Python externa
			const response = await this.callExternalChatAPI({
				query: payload.query,
				context: payload.context,
				conversationId,
				metadata: payload.metadata,
			})

			// Calcula tempo de processamento
			const processingTime = Date.now() - startTime

			// Atualiza mensagem com resposta
			message.response = response
			message.status = ChatMessageStatusEnum.COMPLETED
			message.processingTimeMs = processingTime
			await message.save()

			return message
		} catch (error) {
			// Em caso de erro, marca como failed
			message.status = ChatMessageStatusEnum.FAILED
			message.response =
				error instanceof Error
					? `Erro ao processar sua mensagem: ${error.message}`
					: 'Erro ao processar sua mensagem. Tente novamente.'
			await message.save()
			throw error
		}
	}

	/**
	 * Faz requisição para a API Python externa
	 */
	private static async callExternalChatAPI(payload: {
		query: string
		context?: string
		conversationId: string
		metadata?: Record<string, any>
	}): Promise<string> {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT)

		try {
			const response = await fetch(this.CHAT_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: payload.query,
					context: payload.context,
					conversation_id: payload.conversationId,
					metadata: payload.metadata,
				}),
				signal: controller.signal,
			})

			clearTimeout(timeoutId)

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(
					`API Python retornou erro ${response.status}: ${errorText || 'Erro desconhecido'}`
				)
			}

			const data = await response.json()

			// Extrai a resposta do formato retornado pela API Python
			// API Python retorna: { answer: string, sources: [], token_usage: number }
			return data.answer || data.response || data.message || JSON.stringify(data)
		} catch (error) {
			if (error instanceof Error) {
				if (error.name === 'AbortError') {
					throw new Error(
						`Timeout ao chamar API Python (${this.REQUEST_TIMEOUT / 1000}s excedidos)`
					)
				}
				throw new Error(`Erro ao chamar API Python: ${error.message}`)
			}
			throw new Error('Erro desconhecido ao chamar API Python')
		} finally {
			clearTimeout(timeoutId)
		}
	}

	/**
	 * Busca histórico de mensagens de um usuário
	 */
	static async getHistory(payload: {
		userId: number
		conversationId?: string
		limit?: number
		offset?: number
	}): Promise<{ messages: ChatMessage[]; total: number }> {
		const query = ChatMessage.query().where('user_id', payload.userId)

		if (payload.conversationId) {
			query.where('conversation_id', payload.conversationId)
		}

		// Conta total
		const total = await query.clone().count('* as total').first()

		// Busca mensagens com paginação
		const messages = await query
			.orderBy('created_at', 'desc')
			.limit(payload.limit || 50)
			.offset(payload.offset || 0)

		return {
			messages,
			total: Number(total?.$extras.total || 0),
		}
	}

	/**
	 * Lista todas as conversas de um usuário
	 */
	static async listConversations(userId: number): Promise<
		Array<{
			conversationId: string
			messageCount: number
			lastMessage: string
			lastMessageAt: string
		}>
	> {
		// Busca conversações únicas agrupadas
		const rawConversations = await ChatMessage.query()
			.where('user_id', userId)
			.select('conversation_id')
			.groupBy('conversation_id')
			.orderByRaw('MAX(created_at) DESC')

		// Para cada conversa, busca última mensagem e contagem
		const result = await Promise.all(
			rawConversations.map(async (conv) => {
				const lastMessage = await ChatMessage.query()
					.where('conversation_id', conv.conversationId)
					.orderBy('created_at', 'desc')
					.first()

				const count = await ChatMessage.query()
					.where('conversation_id', conv.conversationId)
					.count('* as total')
					.first()

				return {
					conversationId: conv.conversationId,
					messageCount: Number(count?.$extras.total || 0),
					lastMessage: lastMessage?.query || '',
					lastMessageAt: lastMessage?.createdAt.toISO() || '',
				}
			})
		)

		return result
	}
}
