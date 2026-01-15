import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const alertVariants = cva(
  'relative w-full rounded-xl border p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-secondary-50 border-secondary-200 text-secondary-900',
        info: 'bg-info-50 border-info-200 text-info-900',
        success: 'bg-success-50 border-success-200 text-success-900',
        warning: 'bg-warning-50 border-warning-200 text-warning-900',
        danger: 'bg-danger-50 border-danger-200 text-danger-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const alertIconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
}

const alertIconColorMap = {
  default: 'text-secondary-600',
  info: 'text-info-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onClose?: () => void
  icon?: React.ReactNode
  showIcon?: boolean
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', onClose, icon, showIcon = true, children, ...props }, ref) => {
    const IconComponent = alertIconMap[variant || 'default']
    const iconColor = alertIconColorMap[variant || 'default']

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex gap-3">
          {showIcon && (
            <div className={cn('shrink-0 mt-0.5', iconColor)}>
              {icon ? (
                React.isValidElement(icon) ? icon : null
              ) : (
                <IconComponent className="h-5 w-5" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">{children}</div>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                variant === 'default' && 'text-secondary-500 focus:ring-secondary-500',
                variant === 'info' && 'text-info-500 focus:ring-info-500',
                variant === 'success' && 'text-success-500 focus:ring-success-500',
                variant === 'warning' && 'text-warning-500 focus:ring-warning-500',
                variant === 'danger' && 'text-danger-500 focus:ring-danger-500'
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
