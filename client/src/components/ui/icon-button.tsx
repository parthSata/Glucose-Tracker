import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  variant?: 'neutral' | 'primary' | 'danger'
  children: ReactNode
}

export function IconButton({
  label,
  variant = 'neutral',
  className = '',
  type = 'button',
  disabled,
  children,
  ...props
}: IconButtonProps) {
  const variants = {
    neutral:
      'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900',
    primary:
      'border border-teal-700 bg-teal-700 text-white hover:border-teal-800 hover:bg-teal-800',
    danger:
      'border border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100',
  }

  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      disabled={disabled}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
