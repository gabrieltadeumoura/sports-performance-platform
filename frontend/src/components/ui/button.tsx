import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-60 rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-sky-600 text-zinc-50 hover:bg-sky-500',
        outline: 'border border-zinc-700 bg-transparent hover:bg-zinc-900',
        ghost: 'bg-transparent hover:bg-zinc-900',
      },
      size: {
        default: 'px-3 py-2',
        sm: 'px-2 py-1 text-xs',
        lg: 'px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ className, variant, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, className }))} {...props} />
}

