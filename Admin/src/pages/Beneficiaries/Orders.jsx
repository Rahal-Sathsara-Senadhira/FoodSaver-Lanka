import React from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import BasePanel from '../../components/common/BasePanel'
import { useShelterOrders } from '../../hooks/useBeneficiaries.js'
import { Search } from 'lucide-react'

function StatusBadge({ status }) {
  const map = {
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    PREPARING: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    ASSIGNED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    DELIVERED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    CANCELLED: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
      {status}
    </span>
  )
}

export default function BeneficiaryOrders() {
  const nav = useNavigate()
  const [q, setQ] = React.useState('')
  const [status, setStatus] = React.useState('')

  const { data, isLoading } = useShelterOrders({ q, status, page: 1 })
  const rows = data?.data || []
  const statuses = data?.meta?.statuses || []

  const goDetail = (id) => nav(`/beneficiaries/orders/${id}`)

  return (
    <div className="max-w-none w-full">
      <Breadcrumbs items={[{ label: 'Beneficiaries', to: '/beneficiaries/shelters' }, { label: 'Orders' }]} />
      <BasePanel title="Orders" description="Requests placed by NGO shelters.">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 w-full sm:w-96">
            <Search size={16} className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search NGO or shelter…"
              className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <option value="">All status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">NGO</th>
                <th className="text-left px-4 py-3 font-medium">Shelter</th>
                <th className="text-right px-4 py-3 font-medium">Food Packs</th>
                <th className="text-right px-4 py-3 font-medium">Soup Packs</th>
                <th className="text-left px-4 py-3 font-medium">Requested</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-slate-500">Loading orders…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-slate-500">No orders found.</td></tr>
              ) : rows.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                  onClick={() => goDetail(o.id)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goDetail(o.id) }}
                  title="Open order details"
                >
                  <td className="px-4 py-3 text-slate-900 dark:text-white">{o.ngoName}</td>
                  <td className="px-4 py-3">{o.shelterName}</td>
                  <td className="px-4 py-3 text-right">{o.foodPacks}</td>
                  <td className="px-4 py-3 text-right">{o.soupPacks}</td>
                  <td className="px-4 py-3">{o.requestedAt ? new Date(o.requestedAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BasePanel>
    </div>
  )
}
