import React from 'react'
import { NavLink } from 'react-router-dom'
import { nav } from '../../lib/navigation'
import { ChevronDown, Menu } from 'lucide-react'

export default function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
  const [openGroups, setOpenGroups] = React.useState({})

  const toggleGroup = (label) => {
    setOpenGroups((s) => ({ ...s, [label]: !s[label] }))
  }

  return (
    <aside
      className={[
        // Sizing & positioning
        'fixed z-30 inset-y-0 left-0 transition-[width,transform] duration-300 shadow-soft',
        collapsed ? 'w-16' : 'w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',

        // THEMING:
        // Light mode: white panel + borders; Dark mode: custom dark color
        'bg-white dark:bg-sidebar',
        'border-r border-slate-200 dark:border-white/10',
      ].join(' ')}
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-white/10">
        <button className="md:hidden mr-2" onClick={() => setIsOpen(false)} title="Close">
          <Menu size={20} className="text-slate-700 dark:text-slate-200" />
        </button>

        {!collapsed && (
          <span className="font-semibold text-slate-800 dark:text-slate-100">Admin</span>
        )}

        <button
          className="ml-auto p-2 rounded hover:bg-slate-100 dark:hover:bg-sidebar.hover"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span className="sr-only">Toggle collapse</span>
          <div className="w-4 h-4 border border-slate-400 dark:border-slate-300" />
        </button>
      </div>

      {/* Nav */}
      <nav className="px-2 py-3 overflow-y-auto h-[calc(100%-4rem)]">
        {nav.map((item) => {
          const Icon = item.icon
          const hasChildren = Array.isArray(item.children)

          if (!hasChildren) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-3 py-2 my-1',
                    // Base text color for light/dark
                    'text-slate-700 dark:text-slate-300',
                    // Hover
                    'hover:bg-slate-100 dark:hover:bg-sidebar.hover',
                    // Active state: stronger contrast (light vs dark)
                    isActive
                      ? 'bg-slate-200/70 text-slate-900 dark:bg-sidebar.active dark:text-white'
                      : '',
                  ].join(' ')
                }
              >
                {Icon && <Icon size={18} className="shrink-0" />}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          }

          const expanded = openGroups[item.label]
          return (
            <div key={item.label} className="my-1">
              <button
                onClick={() => toggleGroup(item.label)}
                className={[
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2',
                  'text-slate-700 dark:text-slate-300',
                  'hover:bg-slate-100 dark:hover:bg-sidebar.hover',
                ].join(' ')}
              >
                {Icon && <Icon size={18} className="shrink-0" />}
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={[
                        'transition-transform text-slate-600 dark:text-slate-400',
                        expanded ? 'rotate-180' : '',
                      ].join(' ')}
                    />
                  </>
                )}
              </button>

              {/* Children */}
              {!collapsed && expanded && (
                <div className="ml-8 mt-1">
                  {item.children.map((c) => (
                    <NavLink
                      key={c.label}
                      to={c.to}
                      className={({ isActive }) =>
                        [
                          'block rounded-lg px-3 py-2 my-1 text-sm',
                          'text-slate-600 dark:text-slate-300',
                          'hover:bg-slate-100 dark:hover:bg-sidebar.hover',
                          isActive
                            ? 'bg-slate-200/70 text-slate-900 dark:bg-sidebar.active dark:text-white'
                            : '',
                        ].join(' ')
                      }
                    >
                      {c.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
