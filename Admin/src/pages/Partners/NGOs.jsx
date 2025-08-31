import React from 'react'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import BasePanel from '../../components/common/BasePanel'
import { useNGOs, useApprovePartner, useRejectPartner } from '../../hooks/usePartners.js'
import { Search, CheckCircle2, XCircle } from 'lucide-react'

function StatusBadge({ status }) {
  const map = {
    APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>{status}</span>
}

export default function PartnersNGOs() {
  const [q, setQ] = React.useState('')
  const [status, setStatus] = React.useState('')

  const { data, isLoading } = useNGOs({ q, status, page: 1 })
  const rows = data?.data || []
  const statuses = data?.meta?.statuses || []

  const approve = useApprovePartner('NGO')
  const reject = useRejectPartner('NGO')

  return (
    <div className="max-w-none w-full">
      <Breadcrumbs items={[{ label: 'Partners' }, { label: 'NGOs' }]} />
      <BasePanel title="NGOs" description="Registered NGOs that can request food orders.">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 w-full sm:w-96">
            <Search size={16} className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search NGO…"
              className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <option value="">All status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">NGO</th>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Address</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-6 text-slate-500">Loading NGOs…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-slate-500">No NGOs found.</td></tr>
              ) : rows.map(n => (
                <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-slate-900 dark:text-white">{n.name}</td>
                  <td className="px-4 py-3">{n.contactName}</td>
                  <td className="px-4 py-3">{n.address}</td>
                  <td className="px-4 py-3">{n.email}</td>
                  <td className="px-4 py-3">{n.phone}</td>
                  <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve.mutate(n.id)}
                        disabled={approve.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        <CheckCircle2 size={16} /> Approve
                      </button>
                      <button
                        onClick={() => reject.mutate(n.id)}
                        disabled={reject.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BasePanel>
    </div>
  )
}
