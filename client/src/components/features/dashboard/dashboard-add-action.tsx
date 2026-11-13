import { Link } from 'react-router-dom'

type DashboardAddActionProps = {
  className?: string
}

export function DashboardAddAction({ className = '' }: DashboardAddActionProps) {
  return (
    <Link
      to="/readings"
      className={`inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${className}`.trim()}
    >
      Add reading
    </Link>
  )
}
