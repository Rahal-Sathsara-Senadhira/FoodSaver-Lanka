import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function ReportsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <BasePanel title="Monthly Donations" description="Totals by category">
        <div className="h-40 grid place-items-center text-slate-400">(Chart placeholder)</div>
      </BasePanel>
      <BasePanel title="Pickup Efficiency" description="On-time vs delayed">
        <div className="h-40 grid place-items-center text-slate-400">(Chart placeholder)</div>
      </BasePanel>
      <BasePanel title="Distribution Coverage" description="Beneficiaries reached">
        <div className="h-40 grid place-items-center text-slate-400">(Chart placeholder)</div>
      </BasePanel>
    </div>
  )
}
