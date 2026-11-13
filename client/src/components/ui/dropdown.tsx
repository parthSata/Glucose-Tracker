import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

export type DropdownOption = {
  value: string
  label: string
  disabled?: boolean
}

type DropdownProps = {
  id?: string
  name?: string
  value: string
  options: DropdownOption[]
  placeholder?: string
  hasError?: boolean
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  onChange: (value: string) => void
}

export function Dropdown({
  id,
  name,
  value,
  options,
  placeholder = 'Select an option',
  hasError = false,
  disabled = false,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  onChange,
}: DropdownProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const listboxId = `${triggerId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const selected = options.find((option) => option.value === value)
  const enabledOptions = options.filter((option) => !option.disabled)

  useEffect(() => {
    if (!open) {
      return
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onDocumentKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onDocumentKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onDocumentKeyDown)
    }
  }, [open])

  function openMenu() {
    if (disabled) {
      return
    }

    const selectedIndex = enabledOptions.findIndex(
      (option) => option.value === value,
    )
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  function selectOption(option: DropdownOption) {
    if (option.disabled) {
      return
    }

    onChange(option.value)
    setOpen(false)
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return
    }

    if (
      event.key === 'ArrowDown' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      if (!open) {
        openMenu()
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        const option = enabledOptions[activeIndex]
        if (option) {
          selectOption(option)
        }
      }
    }

    if (!open) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) =>
        current < enabledOptions.length - 1 ? current + 1 : 0,
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) =>
        current > 0 ? current - 1 : enabledOptions.length - 1,
      )
    }
  }

  return (
    <div ref={rootRef} className={`relative w-full ${className}`.trim()}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={ariaInvalid ?? hasError}
        aria-describedby={ariaDescribedBy}
        onClick={() => {
          if (open) {
            setOpen(false)
            return
          }
          openMenu()
        }}
        onKeyDown={onTriggerKeyDown}
        className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2 text-left text-sm text-stone-900 shadow-sm outline-none transition focus:ring-2 ${
          hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : open
              ? 'border-teal-500 focus:border-teal-500 focus:ring-teal-100'
              : 'border-stone-300 hover:border-teal-400 focus:border-teal-600 focus:ring-teal-100'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className={selected ? 'text-stone-900' : 'text-stone-400'}>
          {selected?.label ?? placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-stone-500 transition ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-stone-300 bg-white p-1.5 shadow-lg"
        >
          {options.map((option) => {
            const enabledIndex = enabledOptions.findIndex(
              (item) => item.value === option.value,
            )
            const isActive = enabledIndex === activeIndex
            const isSelected = option.value === value

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onMouseEnter={() => {
                    if (!option.disabled && enabledIndex >= 0) {
                      setActiveIndex(enabledIndex)
                    }
                  }}
                  onClick={() => selectOption(option)}
                  className={`flex w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isActive
                      ? 'bg-teal-700 text-white'
                      : isSelected
                        ? 'bg-teal-50 text-teal-900'
                        : 'text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
