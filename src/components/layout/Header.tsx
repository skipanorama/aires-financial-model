'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Search, Menu } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/revenue': 'Revenue Configuration',
  '/costs': 'Cost Management',
  '/scenarios': 'Scenario Manager',
  '/reports': 'Reports & Export',
  '/settings': 'Settings',
  '/help': 'Help & Documentation',
}

interface HeaderProps {
  onMobileMenuToggle?: () => void
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname()
  
  const title = pageTitles[pathname || ''] || 'Aeris Financial Model'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 w-64">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search settings..."
            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin</p>
            <p className="text-xs text-gray-400">aeris@model.io</p>
          </div>
        </div>
      </div>
    </header>
  )
}
