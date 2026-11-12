import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
  const variants = {
    primary:
      'bg-teal-700 text-white hover:bg-teal-800 focus-visible:outline-teal-700',
    secondary:
      'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 focus-visible:outline-stone-400',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
