import React from 'react'
import { useApprovedDonors } from '../../hooks/useDonors'
import { Search, Check } from 'lucide-react'

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function DonorCombobox({
  value,              // donorId (string|number) or ''
  onChange,           // (id, donorObj) => void
  placeholder = 'Search donors by name…',
  className = '',
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const debouncedQ = useDebouncedValue(query, 200)
  const { data, isLoading } = useApprovedDonors(debouncedQ)
  const donors = data?.data ?? []

  const containerRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const listRef = React.useRef(null)
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const selected = donors.find(d => String(d.id) === String(value))

  React.useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function onKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
      setActiveIndex(0)
      return
    }
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, donors.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && donors[activeIndex]) {
        choose(donors[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function choose(d) {
    onChange?.(d.id, d)
    setQuery(d.name)
    setOpen(false)
    // keep focus for fast data entry
    inputRef.current?.focus()
  }

  // keep query in sync when the selected donor changes externally
  React.useEffect(() => {
    if (selected && query === '') setQuery(selected.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(0) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
        />
      </div>

      {open && (
        <div
          ref={listRef}
          className="absolute z-40 mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-soft overflow-hidden"
          role="listbox"
        >
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-slate-500">Searching…</div>
          ) : donors.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">No donors found</div>
          ) : (
            <ul className="max-h-72 overflow-auto">
              {donors.map((d, idx) => {
                const active = idx === activeIndex
                const selectedNow = String(d.id) === String(value)
                return (
                  <li
                    key={d.id}
                    role="option"
                    aria-selected={selectedNow}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(d)}
                    className={[
                      'flex items-center justify-between px-3 py-2 cursor-pointer',
                      active ? 'bg-slate-100 dark:bg-slate-800' : '',
                    ].join(' ')}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm text-slate-900 dark:text-slate-100">{d.name}</div>
                      {d.address && (
                        <div className="truncate text-xs text-slate-500 dark:text-slate-400">{d.address}</div>
                      )}
                    </div>
                    {selectedNow && <Check size={16} className="text-slate-600 dark:text-slate-300 shrink-0" />}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
