import { useState } from 'react'
import { ChatInput, MessageList, WelcomeScreen, type Message } from '../components/chat'

export function ProscoutAIPage() {
	const [messages, setMessages] = useState<Message[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const getGreeting = () => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Bom dia'
		if (hour < 18) return 'Boa tarde'
		return 'Boa noite'
	}

	const isEmpty = messages.length === 0

	const handleSendMessage = (content: string) => {
		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content,
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, userMessage])
		setIsLoading(true)

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
		}, 1500)
	}

	return (
		<div className="flex h-full flex-col bg-white">
			{!isEmpty && (
				<div className="flex shrink-0 items-center justify-between border-b border-secondary-200 bg-white px-6 py-3">
					<button className="flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-900 transition-colors">
						<span className="font-medium">Nova conversa</span>
						<span className="text-xs text-secondary-400">↓</span>
					</button>
					<button className="text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors">
						Compartilhar
					</button>
				</div>
			)}

			<div className="flex flex-1 min-h-0 flex-col">
				{isEmpty ? (
					<div className="flex flex-1 flex-col items-center justify-center px-4">
						<WelcomeScreen greeting={getGreeting()} />
						<div className="w-full max-w-3xl mt-8">
							<ChatInput
								onSend={handleSendMessage}
								disabled={isLoading}
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
				) : (
					<>
						<div className="flex-1 min-h-0 overflow-y-auto bg-white">
							<MessageList messages={messages} isLoading={isLoading} />
						</div>
						<div className="shrink-0 border-t border-secondary-200 bg-white">
							<div className="mx-auto max-w-3xl px-4 py-4">
								<ChatInput
									onSend={handleSendMessage}
									disabled={isLoading}
									placeholder="Responder..."
									centered={false}
								/>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
