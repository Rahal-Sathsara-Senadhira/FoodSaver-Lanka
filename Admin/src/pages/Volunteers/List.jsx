import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function VolunteersList() {
  const rows = [
    { id: 1, name: 'Ishan Perera', skills: 'Driver', availability: 'Weekends' },
    { id: 2, name: 'Ayesha Jayasuriya', skills: 'Coordination', availability: 'Weekdays' },
  ]
  return (
    <BasePanel title="Volunteers" description="Roster and availability">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Skills</th>
              <th className="py-2 pr-4">Availability</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-900/40">
                <td className="py-2 pr-4 font-medium">{r.name}</td>
                <td className="py-2 pr-4">{r.skills}</td>
                <td className="py-2 pr-4">{r.availability}</td>
                <td className="py-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Schedule
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
