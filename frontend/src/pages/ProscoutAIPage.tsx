import { useState, useRef, useCallback, useMemo } from 'react'
import { MessageSquarePlus, Share2 } from 'lucide-react'
import {
	ChatInput,
	MessageList,
	WelcomeScreen,
	type Message,
	type ChatInputRef,
} from '../components/chat'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip'
import { cn } from '../lib/utils'
import { useSendMessage } from '../features/proscout-ai/hooks'

export function ProscoutAIPage() {
	const [messages, setMessages] = useState<Message[]>([])
	const [conversationId, setConversationId] = useState<string | undefined>(undefined)
	const chatInputRef = useRef<ChatInputRef>(null)
	const sendMessageMutation = useSendMessage()

	const getGreeting = useCallback(() => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Bom dia'
		if (hour < 18) return 'Boa tarde'
		return 'Boa noite'
	}, [])

	const isEmpty = messages.length === 0

	const handleSendMessage = useCallback(
		async (content: string) => {
			const userMessage: Message = {
				id: Date.now().toString(),
				role: 'user',
				content,
				timestamp: new Date(),
			}

			setMessages((prev) => [...prev, userMessage])

			setTimeout(() => {
				chatInputRef.current?.focus()
			}, 150)

			try {
				const response = await sendMessageMutation.mutateAsync({
					conversationId,
					message: content,
				})

				// Salva o conversationId para próximas mensagens
				if (!conversationId) {
					setConversationId(response.conversationId)
				}

				// Adiciona a resposta do assistente
				const assistantMessage: Message = {
					id: response.message.id,
					role: 'assistant',
					content: response.message.content,
					timestamp: new Date(response.message.timestamp),
				}

				setMessages((prev) => [...prev, assistantMessage])

				setTimeout(() => {
					chatInputRef.current?.focus()
				}, 150)
			} catch (error) {
				console.error('Erro ao enviar mensagem:', error)

				// Mostra mensagem de erro
				const errorMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: 'assistant',
					content:
						'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
					timestamp: new Date(),
				}

				setMessages((prev) => [...prev, errorMessage])
			}
		},
		[conversationId, sendMessageMutation, chatInputRef]
	)

	const handleNewConversation = useCallback(() => {
		setMessages([])
		setConversationId(undefined)
		setTimeout(() => {
			chatInputRef.current?.focus()
		}, 100)
	}, [chatInputRef])

	const handleShare = useCallback(() => {
		console.log('Compartilhar conversa')
	}, [])

	const greeting = useMemo(() => getGreeting(), [getGreeting])

	return (
		<TooltipProvider>
			<div className="flex h-full max-h-[calc(100vh-2rem)] items-center justify-center overflow-hidden bg-secondary-50 p-4">
				<div
					className={cn(
						'flex h-full w-full max-w-5xl flex-col overflow-hidden',
						'rounded-lg border border-secondary-200 bg-white shadow-sm'
					)}
				>
					{!isEmpty && (
						<>
							<header className="flex shrink-0 items-center justify-between bg-white px-6 py-3">
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleNewConversation}
											leftIcon={<MessageSquarePlus className="h-4 w-4" />}
										>
											Nova conversa
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Iniciar uma nova conversa</p>
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleShare}
											leftIcon={<Share2 className="h-4 w-4" />}
										>
											Compartilhar
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Compartilhar esta conversa</p>
									</TooltipContent>
								</Tooltip>
							</header>
							<Separator />
						</>
					)}

					<div className="flex flex-1 flex-col overflow-hidden max-h-[600px]">
						{isEmpty ? (
							<EmptyState
								greeting={greeting}
								onSend={handleSendMessage}
								chatInputRef={chatInputRef}
							/>
						) : (
							<ChatArea
								messages={messages}
								isLoading={sendMessageMutation.isPending}
								onSend={handleSendMessage}
								chatInputRef={chatInputRef}
							/>
						)}
					</div>
				</div>
			</div>
		</TooltipProvider>
	)
}

interface EmptyStateProps {
	greeting: string
	onSend: (content: string) => void
	chatInputRef: React.RefObject<ChatInputRef | null>
}

function EmptyState({ greeting, onSend, chatInputRef }: EmptyStateProps) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center px-4 pt-4">
			<WelcomeScreen greeting={greeting} />
			<div className="w-full max-w-3xl mt-8">
				<ChatInput
					ref={chatInputRef}
					onSend={onSend}
					placeholder="Como posso ajudar você hoje?"
					centered
				/>
			</div>
			<div className="mt-4">
				<p className="text-xs text-secondary-500 my-4">
					ProscoutAI pode cometer erros. Verifique informações importantes.
				</p>
			</div>
		</div>
	)
}

interface ChatAreaProps {
	messages: Message[]
	isLoading: boolean
	onSend: (content: string) => void
	chatInputRef: React.RefObject<ChatInputRef | null>
}

function ChatArea({ messages, isLoading, onSend, chatInputRef }: ChatAreaProps) {
	return (
		<>
			<MessageList messages={messages} isLoading={isLoading} className="flex-1" />

			<Separator />

			<div className="shrink-0 bg-white">
				<div className="mx-auto max-w-3xl px-4 py-4">
					<ChatInput
						ref={chatInputRef}
						onSend={onSend}
						placeholder="Responder..."
						centered={false}
					/>
				</div>
			</div>
		</>
	)
}
