import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function PickupsList() {
  const rows = [
    { id: 1, ref: 'PU-001', location: 'Colombo 03', scheduled: '2025-09-01 10:00', status: 'Scheduled' },
    { id: 2, ref: 'PU-002', location: 'Dehiwala',   scheduled: '2025-09-02 14:00', status: 'Pending' },
  ]
  return (
    <BasePanel title="Pickup Requests" description="Coordinate drivers and timetables">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-4">Ref</th>
              <th className="py-2 pr-4">Location</th>
              <th className="py-2 pr-4">Scheduled</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-900/40">
                <td className="py-2 pr-4 font-medium">{r.ref}</td>
                <td className="py-2 pr-4">{r.location}</td>
                <td className="py-2 pr-4">{r.scheduled}</td>
                <td className="py-2 pr-4">{r.status}</td>
                <td className="py-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BasePanel>
  )
}
