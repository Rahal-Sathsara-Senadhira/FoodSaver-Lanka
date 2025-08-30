import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function BaseLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
