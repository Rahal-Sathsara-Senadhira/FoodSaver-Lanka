import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, X, ChevronRight } from 'lucide-react'
import { useAvailableDrivers } from '../../hooks/useDrivers'

const VEHICLE_FILTERS = ['All', 'Bike', 'Car', 'Van', 'Tuk']

function useDebounced(value, delay = 200) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}

export default function DriverPickerModal({ open, onOpenChange, onPick }) {
  const [qRaw, setQRaw] = React.useState('')
  const q = useDebounced(qRaw, 200)
  const [vehicle, setVehicle] = React.useState('All')

  const { data, isLoading } = useAvailableDrivers(q)
  let drivers = data?.data || []
  if (vehicle !== 'All') {
    drivers = drivers.filter((d) => d.vehicleType?.toLowerCase() === vehicle.toLowerCase())
  }

  // keyboard nav
  const [active, setActive] = React.useState(-1)
  const listRef = React.useRef(null)
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    if (!open) return
    setActive(drivers.length ? 0 : -1)
    setQRaw('')
    setVehicle('All')
    const id = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  React.useEffect(() => {
    if (active < 0 || !listRef.current) return
    const el = listRef.current.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onKeyDown = (e) => {
    if (!drivers.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, drivers.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && drivers[active]) handlePick(drivers[active])
    }
  }

  const handlePick = (driver) => {
    onPick?.(driver)
  }

  const VehiclePill = ({ type }) => (
    <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
      {type}
    </span>
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
              Assign Driver
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-5 pt-3">
            {/* Sticky search + filters */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 pb-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 mb-2">
                <Search size={16} className="text-slate-400" />
                <input
                  ref={inputRef}
                  value={qRaw}
                  onChange={(e) => setQRaw(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search by name or vehicle…"
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_FILTERS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { setVehicle(v); setActive(0) }}
                    className={[
                      'px-3 py-1.5 rounded-full text-sm border',
                      vehicle === v
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                    ].join(' ')}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div
              ref={listRef}
              className="mt-3 max-h-[60vh] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800"
              role="listbox"
              aria-label="Available drivers"
              tabIndex={-1}
            >
              {isLoading ? (
                <div className="px-4 py-6 text-sm text-slate-500">Loading available drivers…</div>
              ) : drivers.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500">No available drivers match your filters.</div>
              ) : (
                drivers.map((d, idx) => {
                  const activeRow = idx === active
                  return (
                    <button
                      key={d.id}
                      data-idx={idx}
                      role="option"
                      aria-selected={activeRow}
                      onClick={() => handlePick(d)}
                      onMouseEnter={() => setActive(idx)}
                      className={[
                        'w-full text-left px-4 py-3 focus:outline-none',
                        activeRow
                          ? 'bg-slate-100 dark:bg-slate-800/60'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate text-slate-900 dark:text-white">
                            {d.firstName} {d.lastName}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap gap-2">
                            <VehiclePill type={d.vehicleType} />
                            <span className="truncate">• {d.vehicleNumber}</span>
                            <span className="truncate">• {d.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-500 dark:text-slate-400">ID #{d.id}</span>
                          <ChevronRight size={16} className="text-slate-400 dark:text-slate-500" />
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
