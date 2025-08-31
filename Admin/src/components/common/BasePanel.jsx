import React from 'react'

export default function BasePanel({ title, description, actions, children }) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft border border-slate-200/60 dark:border-slate-800 p-5">
      {(title || description || actions) && (
        <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex-1">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div>{children}</div>
    </section>
  )
}
