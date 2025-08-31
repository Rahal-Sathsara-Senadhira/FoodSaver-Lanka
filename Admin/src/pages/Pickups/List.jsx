//Pickups\List.jsx
import React from 'react'
import BasePanel from '../../components/common/BasePanel'
import DriverPickerModal from '../../components/common/DriverPickerModal'
import {
  usePickupsList,
  useAssignPickupDriver,
  useUpdatePickupStatus,
} from '../../hooks/usePickups'
import { DONATION_STATUS } from '../../lib/enums'
import { toast } from 'sonner'

export default function PickupsList() {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('')

  const { data, isLoading, error } = usePickupsList({ q: query, status })

  return (
    <BasePanel
      title="Pickup Requests"
      description="Coordinate drivers and timetables for donor pickups"
      actions={
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by donor, ref, or location…"
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <option value="">All Status</option>
            <option value={DONATION_STATUS.DRAFT}>DRAFT</option>
            <option value={DONATION_STATUS.SCHEDULED_PICKUP}>SCHEDULED_PICKUP</option>
            <option value={DONATION_STATUS.PICKED_UP}>PICKED_UP</option>
            <option value={DONATION_STATUS.RECEIVED_WAREHOUSE}>RECEIVED_WAREHOUSE</option>
            <option value={DONATION_STATUS.CANCELLED}>CANCELLED</option>
          </select>
        </div>
      }
    >
      {isLoading && <div className="text-slate-500">Loading…</div>}
      {error && (
        <div className="text-red-600">
          Failed to load: {String(error.message || error)}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 pr-4">Ref</th>
                <th className="py-2 pr-4">Donor</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Pickup At</th>
                <th className="py-2 pr-4">Driver</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data || []).map((pu) => (
                <PickupRow key={pu.id} pickup={pu} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BasePanel>
  )
}

function PickupRow({ pickup }) {
  const [showPicker, setShowPicker] = React.useState(false)
  const assign = useAssignPickupDriver(pickup.id)
  const updateStatus = useUpdatePickupStatus(pickup.id)

  const handlePickDriver = async (driver) => {
    await assign.mutateAsync({ driverId: driver.id }) // assign instantly
    toast.success(`Assigned to ${driver.firstName} ${driver.lastName}`)
    setShowPicker(false)
  }

  const markPickedUp = () => updateStatus.mutate(DONATION_STATUS.PICKED_UP)
  const markReceived = () =>
    updateStatus.mutate(DONATION_STATUS.RECEIVED_WAREHOUSE)
  const cancelPickup = () => updateStatus.mutate(DONATION_STATUS.CANCELLED)

  return (
    <tr className="border-b border-slate-100 dark:border-slate-900/40">
      <td className="py-2 pr-4 font-medium">{pickup.ref}</td>
      <td className="py-2 pr-4">{pickup.donorName}</td>
      <td className="py-2 pr-4">{pickup.location}</td>
      <td className="py-2 pr-4">
        {pickup.pickupAt ? new Date(pickup.pickupAt).toLocaleString() : '-'}
      </td>
      <td className="py-2 pr-4">
        {pickup.assignedDriverId ? `#${pickup.assignedDriverId}` : '-'}
      </td>
      <td className="py-2 pr-4">{pickup.status}</td>
      <td className="py-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowPicker(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {pickup.assignedDriverId ? 'Reassign' : 'Assign Driver'}
          </button>

          <button
            onClick={markPickedUp}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            disabled={pickup.status !== DONATION_STATUS.SCHEDULED_PICKUP}
          >
            Mark Picked Up
          </button>

          <button
            onClick={markReceived}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            disabled={pickup.status !== DONATION_STATUS.PICKED_UP}
          >
            Mark Received
          </button>

          <button
            onClick={cancelPickup}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            disabled={
              [
                DONATION_STATUS.RECEIVED_WAREHOUSE,
                DONATION_STATUS.CANCELLED,
              ].includes(pickup.status)
            }
          >
            Cancel
          </button>
        </div>

        {/* Modal to pick from available drivers */}
        <DriverPickerModal
          open={showPicker}
          onOpenChange={setShowPicker}
          onPick={handlePickDriver}
        />
      </td>
    </tr>
  )
}
