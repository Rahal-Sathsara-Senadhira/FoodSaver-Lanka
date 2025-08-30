import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function InventoryList() {
  const rows = [
    { id: 1, sku: 'BRD-100', name: 'Bread Loaf', qty: 240, unit: 'pcs' },
    { id: 2, sku: 'VEG-050', name: 'Mixed Vegetables', qty: 50, unit: 'kg' },
  ]
  return (
    <BasePanel title="Inventory" description="Current stock at warehouses">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-4">SKU</th>
              <th className="py-2 pr-4">Item</th>
              <th className="py-2 pr-4">Quantity</th>
              <th className="py-2 pr-4">Unit</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-900/40">
                <td className="py-2 pr-4 font-medium">{r.sku}</td>
                <td className="py-2 pr-4">{r.name}</td>
                <td className="py-2 pr-4">{r.qty}</td>
                <td className="py-2 pr-4">{r.unit}</td>
                <td className="py-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Adjust
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
