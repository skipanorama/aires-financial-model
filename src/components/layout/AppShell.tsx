'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { FinancialProvider } from '@/context/FinancialContext'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <FinancialProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content area */}
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'
          }`}
        >
          <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          
          <main className="p-6 max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </FinancialProvider>
  )
}
