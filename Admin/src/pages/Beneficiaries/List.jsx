import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function BeneficiariesList() {
  const rows = [
    { id: 1, name: 'Hope Shelter', type: 'NGO', contact: 'info@hopeshelter.lk' },
    { id: 2, name: 'A. Fernando', type: 'Individual', contact: '077-123-4567' },
  ]
  return (
    <BasePanel title="Beneficiaries" description="Organizations & individuals receiving food">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Contact</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-900/40">
                <td className="py-2 pr-4 font-medium">{r.name}</td>
                <td className="py-2 pr-4">{r.type}</td>
                <td className="py-2 pr-4">{r.contact}</td>
                <td className="py-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Details
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
