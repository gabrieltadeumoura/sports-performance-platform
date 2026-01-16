import { Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
	greeting: string
}

export function WelcomeScreen({ greeting }: WelcomeScreenProps) {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="flex items-center gap-3">
				<Sparkles className="h-6 w-6 text-primary-600" />
				<h1 className="text-3xl font-light text-secondary-700">{greeting}</h1>
			</div>
		</div>
	)
}
