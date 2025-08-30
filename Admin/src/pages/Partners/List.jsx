import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function PartnersList() {
  const rows = [
    { id: 1, name: 'ABC Bakery', role: 'Donor', contact: 'contact@abcbakery.lk' },
    { id: 2, name: 'City Logistics', role: 'Transport', contact: 'ops@citylog.lk' },
  ]
  return (
    <BasePanel title="Partners" description="Donor & logistics partners">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Contact</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-900/40">
                <td className="py-2 pr-4 font-medium">{r.name}</td>
                <td className="py-2 pr-4">{r.role}</td>
                <td className="py-2 pr-4">{r.contact}</td>
                <td className="py-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Contact
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
