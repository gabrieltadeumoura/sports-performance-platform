import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
        secondary:
          'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300',
        outline:
          'border border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50 hover:border-secondary-400 active:bg-secondary-100',
        ghost:
          'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 active:bg-secondary-200',
        danger:
          'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-sm',
        success:
          'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-sm',
        link: 'text-primary-600 underline-offset-4 hover:underline hover:text-primary-700',
      },
      size: {
        xs: 'h-7 px-2 text-xs rounded-md',
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-xs': 'h-6 w-6 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </Comp>
  )
}

export { buttonVariants }
