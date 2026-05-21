import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'yellow' | 'premium'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'rounded-full bg-brand-blue text-primary-foreground hover:brightness-110 transition',
  secondary: 'rounded-full border border-border bg-background text-foreground hover:bg-secondary transition',
  outline:   'rounded-full border border-border bg-background text-foreground hover:bg-secondary transition',
  ghost:     'rounded-full text-muted-foreground hover:bg-secondary transition',
  yellow:    'rounded-full bg-brand-yellow text-brand-yellow-foreground shadow-sm hover:brightness-95 transition',
  premium: [
    'group relative rounded-full text-primary-foreground',
    'bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.62_0.22_260)]',
    'shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6),inset_0_1px_0_oklch(1_0_0/0.35)]',
    'ring-1 ring-[oklch(0.62_0.22_260/0.4)]',
    'hover:shadow-[0_18px_40px_-12px_oklch(0.62_0.22_260/0.7),inset_0_1px_0_oklch(1_0_0/0.4)]',
    'hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300',
  ].join(' '),
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-3 text-sm font-semibold',
  lg: 'px-8 py-3.5 text-sm font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {variant === 'premium' && (
          <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        )}
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
