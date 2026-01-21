import { apiClient } from '../../lib/api'

export type ChatMessage = {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: string
}

export type ChatConversation = {
	id: string
	title: string
	messages: ChatMessage[]
	createdAt: string
	updatedAt: string
}

export type SendMessagePayload = {
	conversationId?: string
	message: string
}

export type SendMessageResponse = {
	conversationId: string
	message: ChatMessage
}

export async function sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
	return await apiClient.post<SendMessageResponse>('/api/proscout-ai/messages', payload)
}

export async function getConversations(): Promise<ChatConversation[]> {
	return await apiClient.get<ChatConversation[]>('/api/proscout-ai/conversations')
}

export async function getConversation(id: string): Promise<ChatConversation> {
	return await apiClient.get<ChatConversation>(`/api/proscout-ai/conversations/${id}`)
}

export async function deleteConversation(id: string): Promise<void> {
	await apiClient.delete(`/api/proscout-ai/conversations/${id}`)
}
