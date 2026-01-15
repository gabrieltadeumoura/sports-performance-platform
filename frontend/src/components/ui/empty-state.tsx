import * as React from 'react'
import { cn } from '../../lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-secondary-300 bg-secondary-50/50 px-6 py-12 text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100">
          <span className="text-secondary-400">{icon}</span>
        </div>
      )}
      <h3 className="text-base font-semibold text-secondary-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-secondary-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
