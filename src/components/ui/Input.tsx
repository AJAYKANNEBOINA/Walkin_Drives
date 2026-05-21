import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={[
              'block w-full rounded-full border border-border bg-card py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-transparent',
              error ? 'border-destructive focus:ring-destructive/40' : '',
              icon ? 'pl-11 pr-4' : 'px-4',
              className,
            ].join(' ')}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
