import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg'
  text?: string
}

const sizeStyles = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Loading({ size = 'default', text, className, ...props }: LoadingProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      {...props}
    >
      <Loader2 className={cn('animate-spin text-primary-600', sizeStyles[size])} />
      {text && <span className="text-sm text-secondary-600">{text}</span>}
    </div>
  )
}

export function LoadingPage({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  )
}

export function LoadingOverlay({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Loading size="lg" text={text} />
    </div>
  )
}
