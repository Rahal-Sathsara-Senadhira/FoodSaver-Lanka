import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function UserList() {
  const [query, setQuery] = React.useState('')
  const users = [
    { id: 1, name: 'Ayesha Jayasuriya', email: 'ayesha@example.com', role: 'Admin' },
    { id: 2, name: 'Ishan Perera', email: 'ishan@example.com', role: 'Editor' },
  ]
  const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <BasePanel title="Users" description="Manage platform users" actions={
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none" />
    }>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-slate-100 dark:border-slate-900/40">
                <td className="py-2 pr-4 font-medium">{u.name}</td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.role}</td>
                <td className="py-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BasePanel>
  )
}
