import React from 'react'
import BasePanel from '../../components/common/BasePanel'

export default function SettingsGeneral() {
  return (
    <div className="max-w-3xl">
      <BasePanel title="General Settings" description="Update app metadata">
        <form className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm">App Name</span>
            <input className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" defaultValue="Admin Panel" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Support Email</span>
            <input className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" defaultValue="support@example.com" />
          </label>
          <div>
            <button className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">Save</button>
          </div>
        </form>
      </BasePanel>
    </div>
  )
}
