'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  GitBranch,
  FileText,
  Settings,
  HelpCircle,
  Waves,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Revenue', href: '/revenue', icon: DollarSign },
  { name: 'Costs', href: '/costs', icon: Receipt },
  { name: 'Scenarios', href: '/scenarios', icon: GitBranch },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 shadow-sidebar ${
        collapsed ? 'w-16' : 'w-[260px]'
      }`}
      style={{ backgroundColor: '#1E40AF' }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-blue-700/50">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Waves className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold text-base leading-tight truncate">
                Aires
              </span>
              <span className="text-blue-200 text-[10px] leading-tight truncate">
                Financial Model
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon
                className={`flex-shrink-0 w-5 h-5 ${
                  isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'
                }`}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-blue-700/50">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-colors duration-150 text-sm"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
