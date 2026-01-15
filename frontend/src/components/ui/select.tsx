import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const selectVariants = cva(
  'flex w-full appearance-none rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-secondary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error:
          'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20',
      },
      selectSize: {
        sm: 'h-8 text-xs',
        default: 'h-10',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'default',
    },
  }
)

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  label?: string
  error?: string
  hint?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      selectSize,
      label,
      error,
      hint,
      options,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId()
    const hasError = !!error
    const selectVariant = hasError ? 'error' : variant

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-secondary-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              selectVariants({ variant: selectVariant, selectSize }),
              'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-4 w-4 text-secondary-400" />
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-xs text-danger-600">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="mt-1.5 text-xs text-secondary-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select, selectVariants }
