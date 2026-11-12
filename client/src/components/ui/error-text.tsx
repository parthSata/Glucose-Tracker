type ErrorTextProps = {
  id?: string
  message?: string
}

export function ErrorText({ id, message }: ErrorTextProps) {
  if (!message) {
    return null
  }

  return (
    <p id={id} className="mt-1.5 text-sm text-red-700" role="alert">
      {message}
    </p>
  )
}
