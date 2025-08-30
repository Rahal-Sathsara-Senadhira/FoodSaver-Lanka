import React from 'react'
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'

export default function Topbar({ setSidebarOpen }) {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    setDark(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  React.useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') document.documentElement.classList.add('dark')
  }, [])

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="h-full px-4 flex items-center gap-3">
        <button className="md:hidden p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} />
        </button>

        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Notifications">
            <Bell size={18} />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" title="Account" />
        </div>
      </div>
    </header>
  )
}
