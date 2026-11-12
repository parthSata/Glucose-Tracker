import type { SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean
}

export function Select({
  hasError = false,
  className = '',
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      id={id}
      className={`min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition focus:ring-2 ${
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-stone-300 focus:border-teal-600 focus:ring-teal-100'
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  )
}
