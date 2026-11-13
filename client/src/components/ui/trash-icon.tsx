type TrashIconProps = {
  className?: string
}

export function TrashIcon({ className = 'h-4 w-4' }: TrashIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path
        d="M3 6h18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6V4h8v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6l-1 14H6L5 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  )
}
