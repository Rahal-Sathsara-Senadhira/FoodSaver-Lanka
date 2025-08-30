import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function DonationsList() {
  const [query, setQuery] = React.useState('')
  const rows = [
    { id: 1, donor: 'ABC Bakery', item: 'Bread (100 loaves)', status: 'Received' },
    { id: 2, donor: 'Fresh Farm', item: 'Vegetables (50kg)', status: 'Incoming' },
  ]
  const filtered = rows.filter(r =>
    [r.donor, r.item, r.status].join(' ').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <BasePanel title="Donations" description="Track incoming and received donations" actions={
      <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search donations…"
        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none" />
    }>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-4">Donor</th>
              <th className="py-2 pr-4">Item</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-900/40">
                <td className="py-2 pr-4 font-medium">{r.donor}</td>
                <td className="py-2 pr-4">{r.item}</td>
                <td className="py-2 pr-4">{r.status}</td>
                <td className="py-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    View
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
