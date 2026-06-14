import { forwardRef, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import classnames from 'classnames'
import { useTheme } from '../../theme'
import { useSize } from '../../theme'
import type { Size } from '../../theme'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: Size
  loading?: boolean
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  children?: ReactNode
  className?: string
  asChild?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
  rel?: string
}

const Spinner = () => (
  <svg
    className="animate-spin"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size: sizeProp,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'start',
      children,
      className,
      asChild = false,
      onClick,
      type = 'button',
      href,
      target,
      rel,
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const { size: contextSize } = useSize()
    const size = sizeProp ?? contextSize

    const variantClasses: Record<string, string> = {
      primary:
        'bg-color9 text-color1 hover:bg-color10 focus-visible:ring-2 focus-visible:ring-color8',
      secondary:
        'bg-color4 text-color11 hover:bg-color5 focus-visible:ring-2 focus-visible:ring-color7',
      ghost:
        'bg-transparent text-color11 hover:bg-color4 focus-visible:ring-2 focus-visible:ring-color7',
      outline:
        'bg-transparent text-color11 border border-color7 hover:bg-color4 focus-visible:ring-2 focus-visible:ring-color7',
    }

    const baseClasses = classnames(
      theme,
      `button${size}`,
      'inline-flex items-center justify-center gap-2 font-medium leading-none select-none outline-none transition-colors duration-200',
      variantClasses[variant],
      (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
      className,
    )

    const content = (
      <>
        {loading && <Spinner />}
        {!loading && icon && iconPosition === 'start' && icon}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'end' && icon}
      </>
    )

    if (asChild && Slot) {
      return (
        <Slot className={baseClasses} ref={ref as any} onClick={onClick}>
          {children}
        </Slot>
      )
    }

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={baseClasses}
          onClick={onClick}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        className={baseClasses}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {content}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
