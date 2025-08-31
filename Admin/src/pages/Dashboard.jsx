import React from 'react'
import BasePanel from '../components/common/BasePanel'

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <BasePanel title="Revenue" description="Last 30 days">
        <div className="h-40 grid place-items-center text-slate-400">(Chart placeholder)</div>
      </BasePanel>
      <BasePanel title="Users" description="New signups">
        <div className="h-40 grid place-items-center text-slate-400">(Chart placeholder)</div>
      </BasePanel>
      <BasePanel title="Latency" description="API p95">
        <div className="h-40 grid place-items-center text-slate-400">(Chart placeholder)</div>
      </BasePanel>
      <BasePanel title="Recent Activity">
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Deployed v1.0.3</li>
          <li>Invited 3 new admins</li>
          <li>Rotated access tokens</li>
        </ul>
      </BasePanel>
    </div>
  )
}
