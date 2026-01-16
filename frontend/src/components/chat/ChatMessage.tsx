import { Bot, User } from 'lucide-react'
import { cn } from '../../lib/utils'

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
				'group flex gap-4 border-b border-secondary-100 px-6 py-6 transition-colors duration-200',
				isUser ? 'bg-white' : 'bg-secondary-50/30',
				isLatest && 'animate-slide-up'
			)}
		>
			<div className="flex-shrink-0">
				{isUser ? (
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-200 text-secondary-700">
						<User className="h-4 w-4" />
					</div>
				) : (
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-sm">
						<Bot className="h-4 w-4" />
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0 space-y-1">
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

				<div className="text-sm text-secondary-700 leading-relaxed whitespace-pre-wrap">
					{message.content}
				</div>
			</div>
		</div>
	)
}
