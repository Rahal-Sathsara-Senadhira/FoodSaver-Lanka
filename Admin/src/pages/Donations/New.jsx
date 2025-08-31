import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BasePanel from '../../components/common/BasePanel'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { useCreateDonation } from '../../hooks/useDonations'
import DonorCombobox from '../../components/common/DonorCombobox'
import { Plus, Trash2 } from 'lucide-react'

function toIsoFromLocal(dateStr, timeStr) {
  if (!dateStr || !timeStr) return ''
  const local = new Date(`${dateStr}T${timeStr}`)
  return new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString()
}

const TYPE_OPTS = [
  { value: 'FOOD', label: 'Food Container' },
  { value: 'SOUP', label: 'Soup Container' },
]

function fmtTime(dt) { return dt.toTimeString().slice(0, 5) }
function fmtDate(dt) { return dt.toISOString().slice(0, 10) }

export default function NewDonation() {
  const nav = useNavigate()
  const createDonation = useCreateDonation()

  const [donorId, setDonorId] = React.useState('')

  // Local category lists (can be fetched later)
  const [cats, setCats] = React.useState({
    FOOD: ['Fried Rice', 'Pasta'],
    SOUP: ['Chicken Soup', 'Dhal Soup'],
  })

  // Dynamic rows
  const [items, setItems] = React.useState([
    { type: 'FOOD', category: 'Fried Rice', qty: 0, description: '', addingNewCat: false, newCat: '' },
  ])

  // Pickup date/time
  const now = React.useMemo(() => new Date(), [])
  const [date, setDate] = React.useState(fmtDate(now))
  const defaultSoon = React.useMemo(() => {
    const d = new Date()
    d.setHours(d.getHours() + 2, 0, 0, 0)
    return d
  }, [])
  const [time, setTime] = React.useState(fmtTime(defaultSoon))
  const [notes, setNotes] = React.useState('')

  // Totals derived from rows
  const packsFood = items.reduce((sum, it) => sum + (it.type === 'FOOD' ? Number(it.qty || 0) : 0), 0)
  const packsSoup = items.reduce((sum, it) => sum + (it.type === 'SOUP' ? Number(it.qty || 0) : 0), 0)
  const canSubmit = donorId && (packsFood + packsSoup > 0) && date && time

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    await createDonation.mutateAsync({
      donorId,
      packsFood,
      packsSoup,
      pickupAt: toIsoFromLocal(date, time),
      notes,
      items: items
        .filter((i) => Number(i.qty) > 0)
        .map(({ type, category, qty, description }) => ({
          type, category, qty: Number(qty), description,
        })),
    })
    nav('/donations')
  }

  // Time presets
  const setPlusHours = (h) => {
    const d = new Date()
    d.setHours(d.getHours() + h, 0, 0, 0)
    setDate(fmtDate(d)); setTime(fmtTime(d))
  }
  const setTodayAt = (h, m = 0) => {
    const d = new Date()
    d.setHours(h, m, 0, 0)
    setDate(fmtDate(d)); setTime(fmtTime(d))
  }
  const setTomorrowAt = (h, m = 0) => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(h, m, 0, 0)
    setDate(fmtDate(d)); setTime(fmtTime(d))
  }

  // Row helpers
  const addRow = () =>
    setItems((p) => [
      ...p,
      { type: 'FOOD', category: cats.FOOD[0] || '', qty: 0, description: '', addingNewCat: false, newCat: '' },
    ])
  const removeRow = (idx) => setItems((p) => p.filter((_, i) => i !== idx))
  const updateRow = (idx, patch) =>
    setItems((p) => p.map((r, i) => (i === idx ? { ...r, ...patch } : r)))

  const handleTypeChange = (idx, newType) => {
    const defaultCat = cats[newType][0] || ''
    updateRow(idx, { type: newType, category: defaultCat, addingNewCat: false, newCat: '' })
  }
  const handleCategoryChange = (idx, value) => {
    if (value === '__add__') updateRow(idx, { addingNewCat: true, newCat: '' })
    else updateRow(idx, { category: value })
  }
  const confirmAddCategory = (idx) => {
    const row = items[idx]
    const trimmed = (row.newCat || '').trim()
    if (!trimmed) return
    setCats((prev) => {
      const list = prev[row.type] || []
      if (!list.includes(trimmed)) {
        return { ...prev, [row.type]: [...list, trimmed] }
      }
      return prev
    })
    updateRow(idx, { category: trimmed, addingNewCat: false, newCat: '' })
  }
  const cancelAddCategory = (idx) => updateRow(idx, { addingNewCat: false, newCat: '' })

  return (
    <div className="max-w-none w-full">
      <Breadcrumbs items={[{ label: 'Donations', to: '/donations' }, { label: 'New Donation' }]} />
      <BasePanel
        title="New Donation"
        description="Record a call-in donation from an approved restaurant/hotel"
      >
        <form onSubmit={onSubmit} className="grid gap-6">
          {/* Donor */}
          <section className="grid gap-1">
            <label className="text-sm">Donor (approved)</label>
            <DonorCombobox value={donorId} onChange={setDonorId} className="w-full" />
            <p className="text-xs text-slate-500">Type to search; use ↑/↓ and Enter to select. Only approved donors are listed.</p>
          </section>

          {/* Items */}
          <section className="grid gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Items</h3>
              <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="grid gap-3">
              {items.map((row, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                  {/* responsive 12-col grid; one line on lg+, wraps below that */}
                  <div className="grid gap-3 items-end grid-cols-1 sm:grid-cols-2 md:grid-cols-12">
                    {/* Type: 2 cols on lg (fits one line), bigger on md for comfort */}
                    <div className="grid gap-1 md:col-span-3 lg:col-span-2">
                      <label className="text-sm">Type</label>
                      <select
                        value={row.type}
                        onChange={(e) => handleTypeChange(idx, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                      >
                        {TYPE_OPTS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Category: 4 cols on lg */}
                    <div className="grid gap-1 md:col-span-5 lg:col-span-4">
                      <label className="text-sm">Food Category</label>
                      {!row.addingNewCat ? (
                        <select
                          value={row.category}
                          onChange={(e) => handleCategoryChange(idx, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                        >
                          {(cats[row.type] || []).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value="__add__">+ Add new Category</option>
                        </select>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            value={row.newCat}
                            onChange={(e) => updateRow(idx, { newCat: e.target.value })}
                            placeholder="New category name"
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => confirmAddCategory(idx)}
                            className="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => cancelAddCategory(idx)}
                            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Qty: 1 col on lg */}
                    <div className="grid gap-1 md:col-span-2 lg:col-span-1">
                      <label className="text-sm">Qty</label>
                      <input
                        type="number"
                        min="0"
                        value={row.qty}
                        onChange={(e) => updateRow(idx, { qty: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                      />
                    </div>

                    {/* Description: 4 cols on lg, full-width on md */}
                    <div className="grid gap-1 md:col-span-12 lg:col-span-4">
                      <label className="text-sm">Description</label>
                      <input
                        value={row.description}
                        onChange={(e) => updateRow(idx, { description: e.target.value })}
                        placeholder={row.type === 'FOOD' ? 'eg. Fried rice with chopcie' : 'eg. Dhal soup with bread'}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                      />
                    </div>

                    {/* Remove: 1 col on lg, push to end */}
                    <div className="flex md:col-span-12 lg:col-span-1 md:justify-start lg:justify-end">
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        aria-label="Remove row"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {row.type === 'FOOD'
                      ? 'Each Food Container pack contains 25 portions.'
                      : 'Each Soup Container pack contains 18 portions.'}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span><strong className="text-slate-900 dark:text-white">{packsFood}</strong> Food packs</span>
              <span><strong className="text-slate-900 dark:text-white">{packsSoup}</strong> Soup packs</span>
            </div>
          </section>

          {/* Pickup */}
          <section className="grid gap-1">
            <label className="text-sm">Pickup at</label>
            <div className="grid gap-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                />
                <input
                  type="time"
                  step="900"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <QuickBtn onClick={() => setPlusHours(1)}>+1 hour</QuickBtn>
                <QuickBtn onClick={() => setPlusHours(2)}>+2 hours</QuickBtn>
                <QuickBtn onClick={() => setTodayAt(19, 0)}>Today 7:00 pm</QuickBtn>
                <QuickBtn onClick={() => setTomorrowAt(10, 0)}>Tomorrow 10:00 am</QuickBtn>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="grid gap-1">
            <label className="text-sm">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions from the call"
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
            />
          </section>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            <Link to="/donations" className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!canSubmit || createDonation.isPending}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-60"
            >
              {createDonation.isPending ? 'Saving…' : 'Save Donation'}
            </button>
          </div>
        </form>
      </BasePanel>
    </div>
  )
}

function QuickBtn({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  )
}
