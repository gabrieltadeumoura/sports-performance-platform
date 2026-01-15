import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const progressVariants = cva('h-2 w-full overflow-hidden rounded-full bg-secondary-200', {
  variants: {
    variant: {
      default: '',
      primary: '',
      success: '',
      warning: '',
      danger: '',
      info: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-secondary-600',
        primary: 'bg-primary-600',
        success: 'bg-success-600',
        warning: 'bg-warning-600',
        danger: 'bg-danger-600',
        info: 'bg-info-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorClassName?: string
  showValue?: boolean
  formatValue?: (value: number) => string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      variant,
      indicatorClassName,
      showValue,
      formatValue,
      ...props
    },
    ref
  ) => {
    const displayValue = formatValue ? formatValue(value || 0) : `${value}%`

    return (
      <div className="w-full">
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(progressVariants({ variant }), className)}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              progressIndicatorVariants({ variant }),
              indicatorClassName
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        </ProgressPrimitive.Root>
        {showValue && (
          <div className="mt-1 flex justify-between text-xs text-secondary-500">
            <span>{displayValue}</span>
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
