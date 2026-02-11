'use client'

import React, { useState, useRef } from 'react'
import { useFinancialContext } from '@/context/FinancialContext'
import { exportDataAsJSON, importDataFromJSON, clearLocalStorage } from '@/utils/localStorage'
import {
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Shield,
  Database,
  AlertTriangle,
  CheckCircle,
  Info,
  HardDrive,
  FileJson,
  Settings2,
  Palette,
  Bell,
  Globe
} from 'lucide-react'

export default function SettingsPage() {
  const { inputs, updateInputs, resetToDefaults, isLoaded } = useFinancialContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleExportData = () => {
    try {
      exportDataAsJSON(inputs)
      showNotification('success', 'Data exported successfully as JSON file')
    } catch {
      showNotification('error', 'Failed to export data')
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imported = await importDataFromJSON(file)
      updateInputs(imported)
      showNotification('success', 'Data imported successfully! All inputs have been updated.')
    } catch (error) {
      showNotification('error', `Import failed: ${error instanceof Error ? error.message : 'Invalid file format'}`)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleResetToDefaults = () => {
    resetToDefaults()
    setShowResetConfirm(false)
    showNotification('success', 'All inputs have been reset to default values')
  }

  const handleClearAllData = () => {
    clearLocalStorage()
    resetToDefaults()
    setShowClearConfirm(false)
    showNotification('success', 'All local storage data has been cleared')
  }

  // Estimate storage size
  const getStorageSize = () => {
    try {
      const data = JSON.stringify(inputs)
      const bytes = new Blob([data]).size
      if (bytes < 1024) return `${bytes} B`
      return `${(bytes / 1024).toFixed(1)} KB`
    } catch {
      return 'Unknown'
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg animate-fade-in ${
          notification.type === 'success' ? 'bg-green-600 text-white' :
          notification.type === 'error' ? 'bg-red-600 text-white' :
          'bg-blue-600 text-white'
        }`}>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
          {notification.type === 'info' && <Info className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your data, preferences, and application settings</p>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Data Management</h3>
              <p className="text-sm text-gray-500">Export, import, and manage your financial model data</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Storage Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Local Storage</div>
                <div className="text-xs text-gray-500">Current model data size</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-info">{getStorageSize()}</span>
            </div>
          </div>

          {/* Export */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Download className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Export Data</div>
                <div className="text-xs text-gray-500">Download all current inputs as a JSON file</div>
              </div>
            </div>
            <button onClick={handleExportData} className="btn-primary text-sm">
              <FileJson className="w-4 h-4 mr-1.5" /> Export JSON
            </button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Import Data</div>
                <div className="text-xs text-gray-500">Load inputs from a previously exported JSON file</div>
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-sm">
                <Upload className="w-4 h-4 mr-1.5" /> Import JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Preferences (placeholder for future) */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Preferences</h3>
              <p className="text-sm text-gray-500">Application display and behavior settings</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Currency */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Currency Format</div>
                <div className="text-xs text-gray-500">Display format for monetary values</div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">CAD ($)</span>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Theme</div>
                <div className="text-xs text-gray-500">Visual appearance of the application</div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">Corporate Blue</span>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Auto-save</div>
                <div className="text-xs text-gray-500">Automatically save changes to browser storage</div>
              </div>
            </div>
            <span className="badge badge-success">Enabled</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <div className="p-5 border-b border-red-100 bg-red-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-700" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-600">Irreversible actions that affect your data</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Reset to Defaults */}
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Reset to Defaults</div>
                <div className="text-xs text-gray-500">Restore all inputs to their original default values</div>
              </div>
            </div>
            {!showResetConfirm ? (
              <button onClick={() => setShowResetConfirm(true)} className="btn-outline text-sm text-red-600 border-red-300 hover:bg-red-50">
                <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleResetToDefaults} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Confirm Reset
                </button>
                <button onClick={() => setShowResetConfirm(false)} className="btn-ghost text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Clear All Data */}
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Clear All Data</div>
                <div className="text-xs text-gray-500">Remove all saved data including scenarios from browser storage</div>
              </div>
            </div>
            {!showClearConfirm ? (
              <button onClick={() => setShowClearConfirm(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                <Trash2 className="w-4 h-4 mr-1.5 inline" /> Clear All
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleClearAllData} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors">
                  ⚠️ Confirm Clear
                </button>
                <button onClick={() => setShowClearConfirm(false)} className="btn-ghost text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">About</h3>
              <p className="text-sm text-gray-500">Aires Financial Model</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">Version</div>
              <div className="font-medium text-gray-900">1.0.0</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">Framework</div>
              <div className="font-medium text-gray-900">Next.js 14</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">Data Storage</div>
              <div className="font-medium text-gray-900">Browser localStorage</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">Calculation Engine</div>
              <div className="font-medium text-gray-900">Client-side</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
