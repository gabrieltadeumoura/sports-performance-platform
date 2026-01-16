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

export function ProscoutAIPage() {
	const [messages, setMessages] = useState<Message[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const chatInputRef = useRef<ChatInputRef>(null)

	const getGreeting = useCallback(() => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Bom dia'
		if (hour < 18) return 'Boa tarde'
		return 'Boa noite'
	}, [])

	const isEmpty = messages.length === 0

	const handleSendMessage = useCallback(
		(content: string) => {
			const userMessage: Message = {
				id: Date.now().toString(),
				role: 'user',
				content,
				timestamp: new Date(),
			}

			setMessages((prev) => [...prev, userMessage])
			setIsLoading(true)

			setTimeout(() => {
				chatInputRef.current?.focus()
			}, 150)

			setTimeout(() => {
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: 'assistant',
					content:
						'Obrigado pela sua pergunta! Esta é uma versão de demonstração do chat. Em breve, estarei totalmente funcional para responder suas perguntas sobre tratamentos, análises de dados de atletas, recomendações personalizadas e muito mais.',
					timestamp: new Date(),
				}

				setMessages((prev) => [...prev, assistantMessage])
				setIsLoading(false)

				setTimeout(() => {
					chatInputRef.current?.focus()
				}, 150)
			}, 1500)
		},
		[chatInputRef]
	)

	const handleNewConversation = useCallback(() => {
		setMessages([])
		setIsLoading(false)
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
			<div className="flex h-full items-center justify-center bg-secondary-50 p-4">
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

					<div className="flex flex-1 min-h-[400px] flex-col">
						{isEmpty ? (
							<EmptyState
								greeting={greeting}
								onSend={handleSendMessage}
								chatInputRef={chatInputRef}
							/>
						) : (
							<ChatArea
								messages={messages}
								isLoading={isLoading}
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
		<div className="flex flex-1 flex-col items-center justify-center px-4">
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
				<p className="text-xs text-secondary-500">
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
			<div className="flex-1 min-h-[400px] overflow-y-auto overflow-x-hidden bg-white">
				<MessageList messages={messages} isLoading={isLoading} />
			</div>

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
