import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

export function Input({ hasError = false, className = '', id, ...props }: InputProps) {
  return (
    <input
      id={id}
      className={`min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:ring-2 ${
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-stone-300 focus:border-teal-600 focus:ring-teal-100'
      } ${className}`.trim()}
      {...props}
    />
  )
}
