import { useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
import { ChatMessage, type Message } from './ChatMessage'
import { cn } from '../../lib/utils'

interface MessageListProps {
	messages: Message[]
	isLoading?: boolean
	className?: string
}

export function MessageList({ messages, isLoading = false, className }: MessageListProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
		messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
	}

	useEffect(() => {
		scrollToBottom('auto')
	}, [])

	useEffect(() => {
		if (messages.length > 0) {
			scrollToBottom('smooth')
		}
	}, [messages.length])

	return (
		<div
			ref={containerRef}
			className={cn(
				'h-full overflow-y-auto overscroll-contain',
				'scrollbar-thin scrollbar-thumb-secondary-300 scrollbar-track-transparent hover:scrollbar-thumb-secondary-400',
				className
			)}
		>
			<div className="mx-auto max-w-3xl">
				{messages.map((message, index) => (
					<ChatMessage
						key={message.id}
						message={message}
						isLatest={index === messages.length - 1}
					/>
				))}

				{isLoading && (
					<div className="flex gap-4 border-b border-secondary-100 bg-secondary-50/30 px-6 py-6 animate-slide-up">
						<div className="flex-shrink-0">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
								<Bot className="h-4 w-4 text-white" />
							</div>
						</div>
						<div className="flex-1 space-y-1">
							<div className="flex items-center gap-2">
								<span className="text-sm font-semibold text-secondary-900">
									ProscoutAI
								</span>
								<span className="text-xs text-secondary-400">digitando...</span>
							</div>
							<div className="flex gap-1.5">
								<span className="h-2 w-2 rounded-full bg-secondary-400 animate-bounce [animation-delay:-0.3s]" />
								<span className="h-2 w-2 rounded-full bg-secondary-400 animate-bounce [animation-delay:-0.15s]" />
								<span className="h-2 w-2 rounded-full bg-secondary-400 animate-bounce" />
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>
		</div>
	)
}
