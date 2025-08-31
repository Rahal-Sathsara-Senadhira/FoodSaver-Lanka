import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus, Minus } from 'lucide-react'

function StockAdjustModal({ open, onOpenChange, item, onConfirm, isLoading }) {
  const [mode, setMode] = React.useState('increase') // 'increase' | 'decrease'
  const [qty, setQty] = React.useState(1)
  const [reason, setReason] = React.useState('')

  React.useEffect(() => {
    if (open) {
      setMode('increase')
      setQty(1)
      setReason('')
    }
  }, [open])

  const sign = mode === 'increase' ? 1 : -1

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
              Adjust Stock
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Item:{' '}
              <span className="font-medium text-slate-900 dark:text-white">
                {item?.name || item?.category || '—'}
              </span>
              {item?.category ? <> • {item.category}</> : null}
            </div>

            {/* Mode */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('increase')}
                className={`px-3 py-1.5 rounded-lg border ${
                  mode === 'increase'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Plus className="inline -mt-0.5 mr-1" size={16} />
                Increase
              </button>
              <button
                type="button"
                onClick={() => setMode('decrease')}
                className={`px-3 py-1.5 rounded-lg border ${
                  mode === 'decrease'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Minus className="inline -mt-0.5 mr-1" size={16} />
                Decrease
              </button>
            </div>

            {/* Qty */}
            <div className="grid gap-1">
              <label className="text-sm">Quantity (packs)</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
              <p className="text-xs text-slate-500">
                Food pack = 25 portions, Soup pack = 18 portions.
              </p>
            </div>

            {/* Reason */}
            <div className="grid gap-1">
              <label className="text-sm">Reason (optional)</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Received from donor / Damaged stock"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                disabled={isLoading || Number(qty) <= 0}
                onClick={() => onConfirm?.({ delta: sign * Number(qty || 0), reason })}
                className={`px-4 py-2 rounded-xl text-white ${
                  mode === 'increase' ? 'bg-emerald-600' : 'bg-rose-600'
                } disabled:opacity-60`}
              >
                {isLoading ? 'Saving…' : 'Confirm'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default StockAdjustModal
