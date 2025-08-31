import React from 'react'
import BasePanel from '../../components/common/BasePanel'
import { useDonationsList, useCreateDonation, useAssignDonationDriver } from '../../hooks/useDonations'
import { DONATION_STATUS } from '../../lib/enums'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export default function DonationsList() {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('')
  const { data, isLoading, error } = useDonationsList({ q: query, status })

  return (
    <BasePanel
      title="Donations"
      description="Track incoming and received donations"
      actions={
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search donations…"
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none"
          />
          <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <option value="">All Status</option>
            {Object.entries(DONATION_STATUS).map(([k,v]) => (
              <option key={k} value={v}>{v}</option>
            ))}
          </select>

          <AddDonationButton />
        </div>
      }
    >
      {isLoading && <div className="text-slate-500">Loading…</div>}
      {error && <div className="text-red-600">Failed to load: {String(error.message || error)}</div>}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 pr-4">Donor</th>
                <th className="py-2 pr-4">Food Packs</th>
                <th className="py-2 pr-4">Soup Packs</th>
                <th className="py-2 pr-4">Pickup At</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data || []).map(d => (
                <tr key={d.id} className="border-b border-slate-100 dark:border-slate-900/40">
                  <td className="py-2 pr-4 font-medium">{d.donorName || `Donor #${d.donorId}`}</td>
                  <td className="py-2 pr-4">{d.packsFood}</td>
                  <td className="py-2 pr-4">{d.packsSoup}</td>
                  <td className="py-2 pr-4">{new Date(d.pickupAt).toLocaleString()}</td>
                  <td className="py-2 pr-4">{d.status}</td>
                  <td className="py-2">
                    <AssignDriverButton donationId={d.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BasePanel>
  )
}

function AssignDriverButton({ donationId }) {
  const [open, setOpen] = React.useState(false)
  const [driverId, setDriverId] = React.useState('')
  const [scheduledAt, setScheduledAt] = React.useState('')
  const assign = useAssignDonationDriver(donationId)

  const submit = async () => {
    if (!driverId) return
    await assign.mutateAsync({ driverId: Number(driverId), scheduledAt })
    setOpen(false)
    setDriverId('')
    setScheduledAt('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        Assign Driver
      </button>

      {open && (
        <div className="mt-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Driver ID"
              value={driverId}
              onChange={(e)=>setDriverId(e.target.value)}
              className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent"
            />
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e)=>setScheduledAt(e.target.value)}
              className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent"
            />
            <button onClick={submit} className="px-3 py-1.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              Save
            </button>
            <button onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function AddDonationButton() {
  const [open, setOpen] = React.useState(false)
  const [donorId, setDonorId] = React.useState('')
  const [packsFood, setPacksFood] = React.useState(0)
  const [packsSoup, setPacksSoup] = React.useState(0)
  const [pickupAt, setPickupAt] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const createDonation = useCreateDonation()

  const canSubmit = (Number(packsFood) > 0 || Number(packsSoup) > 0) && donorId && pickupAt

  const submit = async () => {
    if (!canSubmit) return
    await createDonation.mutateAsync({
      donorId,
      packsFood: Number(packsFood || 0),
      packsSoup: Number(packsSoup || 0),
      pickupAt,
      notes,
    })
    // reset
    setOpen(false)
    setDonorId('')
    setPacksFood(0)
    setPacksSoup(0)
    setPickupAt('')
    setNotes('')
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
          + Add Donation
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <Dialog.Title className="text-lg font-semibold">Add Donation (Call-in)</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
            </Dialog.Close>
          </div>

          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm">Donor ID (approved)</span>
              <input
                type="number"
                value={donorId}
                onChange={(e)=>setDonorId(e.target.value)}
                placeholder="e.g., 10"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-sm">Food Packs (25/pack)</span>
                <input
                  type="number" min="0"
                  value={packsFood}
                  onChange={(e)=>setPacksFood(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">Soup Packs (18/pack)</span>
                <input
                  type="number" min="0"
                  value={packsSoup}
                  onChange={(e)=>setPacksSoup(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-sm">Pickup at</span>
              <input
                type="datetime-local"
                value={pickupAt}
                onChange={(e)=>setPickupAt(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Notes</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e)=>setNotes(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                placeholder="Any special instructions from the call"
              />
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">Cancel</button>
            </Dialog.Close>
            <button
              disabled={!canSubmit || createDonation.isPending}
              onClick={submit}
              className="px-4 py-2 rounded-xl disabled:opacity-60 bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            >
              {createDonation.isPending ? 'Saving…' : 'Save Donation'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
