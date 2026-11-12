import type { LabelHTMLAttributes } from 'react'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  requiredMark?: boolean
}

export function Label({
  children,
  requiredMark = false,
  className = '',
  ...props
}: LabelProps) {
  return (
    <label
      className={`mb-1.5 block text-sm font-medium text-stone-700 ${className}`.trim()}
      {...props}
    >
      {children}
      {requiredMark ? <span className="text-red-600"> *</span> : null}
    </label>
  )
}
