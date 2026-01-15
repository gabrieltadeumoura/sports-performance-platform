import * as React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label?: string
    isPositive?: boolean
  }
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

const variantStyles = {
  default: {
    card: 'bg-white border-secondary-200',
    icon: 'bg-secondary-100 text-secondary-600',
  },
  primary: {
    card: 'bg-white border-primary-200',
    icon: 'bg-primary-100 text-primary-600',
  },
  success: {
    card: 'bg-white border-success-200',
    icon: 'bg-success-100 text-success-600',
  },
  warning: {
    card: 'bg-white border-warning-200',
    icon: 'bg-warning-100 text-warning-600',
  },
  danger: {
    card: 'bg-white border-danger-200',
    icon: 'bg-danger-100 text-danger-600',
  },
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
  className,
  ...props
}: StatsCardProps) {
  const styles = variantStyles[variant]

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
        ? TrendingDown
        : Minus
    : null

  const trendColor = trend
    ? trend.isPositive !== undefined
      ? trend.isPositive
        ? 'text-success-600'
        : 'text-danger-600'
      : trend.value > 0
        ? 'text-success-600'
        : trend.value < 0
          ? 'text-danger-600'
          : 'text-secondary-500'
    : ''

  return (
    <div
      className={cn(
        'rounded-xl border p-5 shadow-card transition-all duration-200 hover:shadow-card-hover',
        styles.card,
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-secondary-900">{value}</p>
          {trend && (
            <div className={cn('mt-2 flex items-center gap-1 text-xs font-medium', trendColor)}>
              {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
              <span>
                {trend.value > 0 && '+'}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="text-secondary-400 font-normal">{trend.label}</span>
              )}
            </div>
          )}
          {description && !trend && (
            <p className="mt-2 text-xs text-secondary-500">{description}</p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              styles.icon
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
