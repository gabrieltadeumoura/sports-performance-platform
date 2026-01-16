import { Bot, User } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card, CardContent } from '../ui/card'

export interface Message {
	id: string
	content: string
	role: 'user' | 'assistant'
	timestamp: Date
}

interface ChatMessageProps {
	message: Message
	isLatest?: boolean
}

export function ChatMessage({ message, isLatest = false }: ChatMessageProps) {
	const isUser = message.role === 'user'

	return (
		<div
			className={cn(
				'px-6 py-4 transition-opacity duration-200',
				isLatest && 'animate-slide-up'
			)}
		>
			<div className="flex gap-3 items-start">
				<div className="shrink-0">
					{isUser ? (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-200 text-secondary-700">
							<User className="h-4 w-4" />
						</div>
					) : (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-sm">
							<Bot className="h-4 w-4" />
						</div>
					)}
				</div>

				<div className="flex-1 min-w-0 space-y-2">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-secondary-900">
							{isUser ? 'Você' : 'ProscoutAI'}
						</span>
						<span className="text-xs text-secondary-400">
							{message.timestamp.toLocaleTimeString('pt-BR', {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</span>
					</div>

					<Card
						variant={isUser ? 'outline' : 'default'}
						padding="none"
						className={cn(
							'max-h-[400px] overflow-hidden',
							isUser
								? 'bg-primary-50 border-primary-200'
								: 'bg-white border-secondary-200'
						)}
					>
						<CardContent className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-300 scrollbar-track-transparent hover:scrollbar-thumb-secondary-400">
							<div className="text-sm text-secondary-700 leading-relaxed whitespace-pre-wrap wrap-break-word">
								{message.content}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
