import { apiClient } from '../../lib/api'

// Types
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

// API Functions (to be implemented later)
export async function sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
	const response = await apiClient.post<SendMessageResponse>('/proscout-ai/messages', payload)
	return response.data
}

export async function getConversations(): Promise<ChatConversation[]> {
	const response = await apiClient.get<ChatConversation[]>('/proscout-ai/conversations')
	return response.data
}

export async function getConversation(id: string): Promise<ChatConversation> {
	const response = await apiClient.get<ChatConversation>(`/proscout-ai/conversations/${id}`)
	return response.data
}

export async function deleteConversation(id: string): Promise<void> {
	await apiClient.delete(`/proscout-ai/conversations/${id}`)
}
