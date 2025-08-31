import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import BasePanel from '../../components/common/BasePanel'
import { useDrivers } from '../../hooks/useVolunteers.js'
import { Search, Truck, CheckCircle2 } from 'lucide-react'

/**
 * Vehicle capacity rules
 */
const VEHICLE_CAPACITY = {
  Bike: 8,
  Tuk: 25,
  Car: 50,
  Van: 75,
  Lorry: 250,
}

/**
 * ---- MOCK: replace with your real order fetch ----
 * Shape:
 * {
 *   id, ngoName, shelterName, requestedAt,
 *   items: [{type:'FOOD'|'SOUP', category:'Fried Rice', packs:25}, ...]
 * }
 */
const MOCK_ORDERS = [
  {
    id: 'O-1001',
    ngoName: 'Helping Hands',
    shelterName: 'Shelter Alpha',
    requestedAt: new Date().toISOString(),
    items: [
      { type: 'FOOD', category: 'Fried Rice', packs: 25 },
      { type: 'FOOD', category: 'Pasta', packs: 18 },
      { type: 'SOUP', category: 'Chicken Soup', packs: 30 },
      { type: 'SOUP', category: 'Pumpkin Soup', packs: 15 },
    ],
  },
]

function useOrder(orderId) {
  // mock fetch
  const [state, setState] = React.useState({ data: null, isLoading: true })
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setState({ data: MOCK_ORDERS.find(o => o.id === orderId) || MOCK_ORDERS[0], isLoading: false })
    }, 150)
    return () => clearTimeout(timer)
  }, [orderId])
  return state
}

/**
 * Format helpers
 */
function fmtDateTime(iso) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}

function sumContainers(items) {
  // every pack is one container for delivery purposes
  return items.reduce((n, it) => n + Number(it.packs || 0), 0)
}

/**
 * Main page
 */
export default function OrderDetail() {
  const { orderId = 'O-1001' } = useParams() // route: /beneficiaries/orders/:orderId
  const { data: order, isLoading } = useOrder(orderId)

  // drivers (AVAILABLE only by default)
  const [q, setQ] = React.useState('')
  const [vehicleFilter, setVehicleFilter] = React.useState('')
  const driversQuery = useDrivers({ q, status: 'AVAILABLE', vehicle: vehicleFilter, page: 1 })
  const allDrivers = driversQuery.data?.data || []
  const vehicleTypes = driversQuery.data?.meta?.vehicles || []

  // allocation state: [{id, name, vehicleType, capacity, assigned}]
  const [allocation, setAllocation] = React.useState([])

  if (isLoading || !order) {
    return <div className="p-6 text-slate-500">Loading order…</div>
  }

  const totalContainers = sumContainers(order.items)
  const assignedTotal = allocation.reduce((n, d) => n + Number(d.assigned || 0), 0)
  const remaining = Math.max(0, totalContainers - assignedTotal)
  const over = Math.max(0, assignedTotal - totalContainers)
  const canConfirm = remaining === 0 && over === 0 && allocation.length > 0

  const addDriver = (d) => {
    if (allocation.find(a => a.id === d.id)) return
    const cap = VEHICLE_CAPACITY[d.vehicleType] || 0
    setAllocation(prev => [...prev, {
      id: d.id,
      name: `${d.firstName} ${d.lastName}`,
      vehicleType: d.vehicleType,
      vehicleNo: d.vehicleNo,
      capacity: cap,
      assigned: Math.min(cap, remaining || cap),
    }])
  }

  const removeDriver = (id) => setAllocation(prev => prev.filter(x => x.id !== id))
  const setAssigned = (id, v) => {
    setAllocation(prev => prev.map(x => x.id === id ? { ...x, assigned: clamp(0, Number(v || 0), x.capacity) } : x))
  }

  function clamp(min, v, max) { return Math.max(min, Math.min(v, max)) }

  // Auto-suggest (greedy by largest capacity first)
  const autoFill = () => {
    if (!totalContainers) return
    const pool = [...allDrivers]
      .filter(d => !allocation.find(a => a.id === d.id))
      .map(d => ({ d, cap: VEHICLE_CAPACITY[d.vehicleType] || 0 }))
      .sort((a, b) => b.cap - a.cap)

    let need = totalContainers - assignedTotal
    const picks = []

    for (const { d, cap } of pool) {
      if (need <= 0) break
      const take = Math.min(cap, need)
      need -= take
      picks.push({
        id: d.id,
        name: `${d.firstName} ${d.lastName}`,
        vehicleType: d.vehicleType,
        vehicleNo: d.vehicleNo,
        capacity: cap,
        assigned: take,
      })
    }

    setAllocation(prev => [...prev, ...picks])
  }

  const confirmAssign = () => {
    // TODO: POST to backend
    // payload example:
    // {
    //   orderId: order.id,
    //   allocations: allocation.map(a => ({ driverId: a.id, containers: a.assigned }))
    // }
    console.log('CONFIRM ASSIGN', { orderId: order.id, allocations: allocation })
    alert('Drivers assigned! (mock)')
  }

  return (
    <div className="max-w-none w-full">
      <Breadcrumbs
        items={[
          { label: 'Beneficiaries' },
          { label: 'Orders', to: '/beneficiaries/orders' },
          { label: `Order ${order.id}` },
        ]}
      />

      <BasePanel
        title={`Order ${order.id}`}
        description={`${order.ngoName} • ${order.shelterName} • Requested ${fmtDateTime(order.requestedAt)}`}
      >
        {/* Items */}
        <section className="mb-6">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Requested Items</h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Food Category</th>
                  <th className="px-4 py-2 text-left font-medium">Packs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {order.items.map((it, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{it.type === 'FOOD' ? 'Food' : 'Soup'}</td>
                    <td className="px-4 py-2 text-slate-900 dark:text-white">{it.category}</td>
                    <td className="px-4 py-2 font-semibold">{it.packs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-sm">
            <span className="text-slate-600 dark:text-slate-300">Total containers to deliver:</span>{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{totalContainers}</span>
          </div>
        </section>

        {/* Driver allocation */}
        <section className="mb-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Assign Drivers</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                Remaining: <strong className="text-slate-900 dark:text-white">{remaining}</strong>
              </span>
              {over > 0 && (
                <span className="px-2 py-1 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
                  Over by {over}
                </span>
              )}
              <button
                type="button"
                onClick={autoFill}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Auto fill
              </button>
            </div>
          </div>

          {/* Pick list */}
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">Available drivers</div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 mb-2">
                <Search size={16} className="text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name or vehicle…"
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="w-full mb-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              >
                <option value="">All vehicles</option>
                {vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              <div className="max-h-80 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
                {driversQuery.isLoading ? (
                  <div className="p-3 text-sm text-slate-500">Loading…</div>
                ) : allDrivers.length === 0 ? (
                  <div className="p-3 text-sm text-slate-500">No drivers match.</div>
                ) : (
                  <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                    {allDrivers.map(d => {
                      const cap = VEHICLE_CAPACITY[d.vehicleType] || 0
                      const disabled = !!allocation.find(a => a.id === d.id)
                      return (
                        <li key={d.id} className="p-3 flex items-center justify-between gap-2">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {d.firstName} {d.lastName}
                            </div>
                            <div className="text-xs text-slate-500">{d.vehicleType} • {d.vehicleNo} • cap {cap}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addDriver(d)}
                            disabled={disabled}
                            className="px-2.5 py-1.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-50"
                          >
                            Add
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Allocation editor */}
            <div className="md:col-span-2">
              <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">Selected drivers & allocation</div>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Driver</th>
                      <th className="px-4 py-2 text-left font-medium">Vehicle</th>
                      <th className="px-4 py-2 text-left font-medium">Capacity</th>
                      <th className="px-4 py-2 text-left font-medium">Assign containers</th>
                      <th className="px-4 py-2 text-left font-medium">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {allocation.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-6 text-slate-500">No drivers added yet.</td></tr>
                    ) : allocation.map(a => (
                      <tr key={a.id}>
                        <td className="px-4 py-2 text-slate-900 dark:text-white font-medium">{a.name}</td>
                        <td className="px-4 py-2">{a.vehicleType} • {a.vehicleNo}</td>
                        <td className="px-4 py-2">{a.capacity}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={0}
                            max={a.capacity}
                            value={a.assigned}
                            onChange={(e) => setAssigned(a.id, e.target.value)}
                            className="w-32 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeDriver(a.id)}
                            className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {allocation.length > 0 && (
                    <tfoot>
                      <tr className="bg-slate-50/60 dark:bg-slate-800/40">
                        <td className="px-4 py-2 font-medium" colSpan={2}>Total assigned</td>
                        <td className="px-4 py-2 font-medium" colSpan={3}>{assignedTotal}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/beneficiaries/orders"
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            Back
          </Link>

          <button
            type="button"
            onClick={confirmAssign}
            disabled={!canConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-60"
          >
            <CheckCircle2 size={18} />
            Confirm Assignment
          </button>

          <div className="ml-auto text-sm flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Truck className="h-4 w-4" /> Capacity rules:
            </span>
            {Object.entries(VEHICLE_CAPACITY).map(([k, v]) => (
              <span key={k} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">{k}: {v}</span>
            ))}
          </div>
        </div>
      </BasePanel>
    </div>
  )
}
