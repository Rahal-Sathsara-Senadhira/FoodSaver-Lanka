// src/pages/Inventory/List.jsx
import React from 'react'
import BasePanel from '../../components/common/BasePanel'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { useAdjustStock, useStock } from '../../hooks/useStock.js'
import { Search, RefreshCw, PackagePlus } from 'lucide-react'
import StockAdjustModal from '../../components/inventory/StockAdjustModal.jsx'

export default function InventoryStock() {
  const [q, setQ] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [page] = React.useState(1)

  const { data, isLoading, isFetching, refetch } = useStock({ page, q, category })
  const rows = data?.data ?? []               // expected: [{ id, name, category, type, packs, updatedAt }]
  const categories = data?.meta?.categories ?? []

  const adjust = useAdjustStock()

  const [sel, setSel] = React.useState(null)
  const [open, setOpen] = React.useState(false)
  const openAdjust = (item) => { setSel(item); setOpen(true) }

  const onConfirmAdjust = async ({ delta, reason }) => {
    await adjust.mutateAsync({ itemId: sel.id, delta, reason })
    setOpen(false)
  }

  return (
    <div className="max-w-none w-full">
      <Breadcrumbs items={[{ label: 'Inventory' }, { label: 'Stock' }]} />
      <BasePanel
        title="Stock"
        description="Warehouse stock for food & soup containers by category."
        headerRight={
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      >
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 w-full sm:w-80">
            <Search size={16} className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search category or item…"
              className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-[800px] w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Item</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-right px-4 py-3 font-medium">Packs</th>
                <th className="text-right px-4 py-3 font-medium">Portions</th>
                <th className="text-right px-4 py-3 font-medium">Updated</th>
                {/* <th className="text-right px-4 py-3 font-medium">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-6 text-slate-500">Loading stock…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-slate-500">No stock found.</td></tr>
              ) : rows.map((r) => {
                  const perPack = r.type === 'FOOD' ? 25 : 18
                  const portions = (r.packs || 0) * perPack
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="px-4 py-3 text-slate-900 dark:text-white">{r.name || r.category}</td>
                      <td className="px-4 py-3">{r.category}</td>
                      <td className="px-4 py-3">{r.type === 'FOOD' ? 'Food' : 'Soup'}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">{r.packs}</td>
                      <td className="px-4 py-3 text-right">{portions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{r.updatedAt ? new Date(r.updatedAt).toLocaleString() : '—'}</td>
                      {/* <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => openAdjust(r)}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          >
                            <PackagePlus size={16} />
                            Adjust
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {/* Adjust modal */}
        <StockAdjustModal
          open={open}
          onOpenChange={setOpen}
          item={sel}
          onConfirm={onConfirmAdjust}
          isLoading={adjust.isPending}
        />
      </BasePanel>
    </div>
  )
}
