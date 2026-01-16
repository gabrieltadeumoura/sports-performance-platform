import { useState, useRef, useEffect, type KeyboardEvent, type FormEvent } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { cn } from '../../lib/utils'

interface ChatInputProps {
	onSend: (message: string) => void
	disabled?: boolean
	placeholder?: string
	className?: string
	centered?: boolean
}

export function ChatInput({
	onSend,
	disabled = false,
	placeholder = 'Digite sua mensagem...',
	className,
	centered = false,
}: ChatInputProps) {
	const [message, setMessage] = useState('')
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current
		if (!textarea) return

		textarea.style.height = 'auto'
		const newHeight = Math.min(textarea.scrollHeight, 200)
		textarea.style.height = `${newHeight}px`
	}

	useEffect(() => {
		adjustTextareaHeight()
	}, [message])

	const handleSend = () => {
		const trimmedMessage = message.trim()
		if (!trimmedMessage || disabled) return

		onSend(trimmedMessage)
		setMessage('')

		setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto'
			}
		}, 0)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		handleSend()
	}

	const canSend = message.trim().length > 0 && !disabled

	return (
		<div className={className}>
			<form onSubmit={handleSubmit} className="relative">
				<div
					className={cn(
						'flex items-end gap-2 rounded-xl border bg-white transition-all duration-200',
						'focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
						canSend
							? 'border-primary-400'
							: 'border-secondary-300 hover:border-secondary-400'
					)}
				>
					<Textarea
						ref={textareaRef}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						disabled={disabled}
						rows={1}
						className={cn(
							'flex-1 resize-none !border-0 !shadow-none !outline-none',
							'focus-visible:!ring-0',
							'min-h-[44px] max-h-[200px] overflow-y-auto',
							'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary-300'
						)}
					/>

					<div className="flex items-end px-2 pb-2">
						<Button
							type="submit"
							size="icon-sm"
							disabled={!canSend}
							className={cn(
								'rounded-lg transition-all duration-200',
								canSend
									? 'bg-primary-600 hover:bg-primary-700 text-white'
									: 'bg-secondary-200 text-secondary-500'
							)}
						>
							<Send className="h-4 w-4" />
							<span className="sr-only">Enviar mensagem</span>
						</Button>
					</div>
				</div>

				{!centered && (
					<div className="mt-2 flex items-center justify-between text-xs text-secondary-500">
						<div className="flex items-center gap-1.5">
							<Sparkles className="h-3.5 w-3.5 text-primary-500" />
							<span>Pressione Enter para enviar, Shift+Enter para nova linha</span>
						</div>
						<span className={cn(message.length > 1000 && 'text-warning-600')}>
							{message.length}/2000
						</span>
					</div>
				)}
			</form>
		</div>
	)
}
