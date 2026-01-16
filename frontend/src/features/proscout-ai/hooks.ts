import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	sendMessage,
	getConversations,
	getConversation,
	deleteConversation,
	type SendMessagePayload,
} from './api'

// Query keys
export const proscoutAIKeys = {
	all: ['proscout-ai'] as const,
	conversations: () => [...proscoutAIKeys.all, 'conversations'] as const,
	conversation: (id: string) => [...proscoutAIKeys.all, 'conversation', id] as const,
}

// Hooks
export function useConversations() {
	return useQuery({
		queryKey: proscoutAIKeys.conversations(),
		queryFn: getConversations,
	})
}

export function useConversation(id: string) {
	return useQuery({
		queryKey: proscoutAIKeys.conversation(id),
		queryFn: () => getConversation(id),
		enabled: !!id,
	})
}

export function useSendMessage() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
		onSuccess: (data) => {
			// Invalidate conversations list
			queryClient.invalidateQueries({ queryKey: proscoutAIKeys.conversations() })
			// Invalidate specific conversation
			queryClient.invalidateQueries({
				queryKey: proscoutAIKeys.conversation(data.conversationId),
			})
		},
	})
}

export function useDeleteConversation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteConversation(id),
		onSuccess: () => {
			// Invalidate conversations list
			queryClient.invalidateQueries({ queryKey: proscoutAIKeys.conversations() })
		},
	})
}
