'use client'

import React, { useState, useEffect } from 'react'
import { useFinancialContext } from '@/context/FinancialContext'
import { Scenario } from '@/utils/types'
import {
  getAllScenarios,
  saveScenario,
  updateScenario,
  deleteScenario,
  exportScenarioAsJSON,
  importScenarioFromJSON
} from '@/utils/localStorage'
import {
  GitBranch,
  Save,
  Upload,
  Download,
  Trash2,
  Play,
  Edit3,
  Plus,
  FileJson,
  AlertTriangle,
  Check
} from 'lucide-react'

export default function ScenariosPage() {
  const { inputs, updateInputs } = useFinancialContext()
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveDescription, setSaveDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    setScenarios(getAllScenarios())
  }, [])

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSave = () => {
    if (!saveName.trim()) return
    if (isEditing && selectedId) {
      const result = updateScenario(selectedId, saveName, saveDescription, inputs)
      if (result) showNotif('success', 'Scenario updated')
    } else {
      const result = saveScenario(saveName, saveDescription, inputs)
      if (result) {
        setSelectedId(result.id)
        showNotif('success', 'Scenario saved')
      }
    }
    setScenarios(getAllScenarios())
    setShowSaveDialog(false)
    setSaveName('')
    setSaveDescription('')
    setIsEditing(false)
  }

  const handleLoad = () => {
    const scenario = scenarios.find(s => s.id === selectedId)
    if (scenario) {
      updateInputs(JSON.parse(JSON.stringify(scenario.inputs)))
      showNotif('success', `Loaded: ${scenario.name}`)
    }
  }

  const handleDelete = () => {
    if (!selectedId) return
    const scenario = scenarios.find(s => s.id === selectedId)
    if (scenario && confirm(`Delete "${scenario.name}"?`)) {
      deleteScenario(selectedId)
      setSelectedId('')
      setScenarios(getAllScenarios())
      showNotif('success', 'Scenario deleted')
    }
  }

  const handleExport = () => {
    const scenario = scenarios.find(s => s.id === selectedId)
    if (scenario) exportScenarioAsJSON(scenario)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importScenarioFromJSON(file)
      setScenarios(getAllScenarios())
      showNotif('success', 'Scenario imported')
    } catch (err) {
      showNotif('error', 'Failed to import scenario')
    }
    e.target.value = ''
  }

  const selectedScenario = scenarios.find(s => s.id === selectedId)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario List */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">
                <GitBranch className="w-4 h-4 text-primary-600" />
                Saved Scenarios
              </h3>
              <span className="badge-blue">{scenarios.length}</span>
            </div>

            {scenarios.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No saved scenarios</p>
                <p className="text-xs mt-1">Save your current config as a scenario</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedId(scenario.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedId === scenario.id
                        ? 'border-primary-300 bg-primary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-900 truncate">{scenario.name}</p>
                    {scenario.description && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{scenario.description}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(scenario.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => { setShowSaveDialog(true); setIsEditing(false); setSaveName(''); setSaveDescription('') }}
                className="btn-primary w-full"
              >
                <Plus className="w-4 h-4" /> Save New Scenario
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleLoad}
                  disabled={!selectedId}
                  className="btn-secondary btn-sm"
                >
                  <Play className="w-3 h-3" /> Load
                </button>
                <button
                  onClick={() => {
                    if (selectedScenario) {
                      setSaveName(selectedScenario.name)
                      setSaveDescription(selectedScenario.description)
                      setIsEditing(true)
                      setShowSaveDialog(true)
                    }
                  }}
                  disabled={!selectedId}
                  className="btn-secondary btn-sm"
                >
                  <Edit3 className="w-3 h-3" /> Update
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleExport} disabled={!selectedId} className="btn-secondary btn-sm">
                  <Download className="w-3 h-3" /> Export
                </button>
                <label className="btn-secondary btn-sm cursor-pointer text-center">
                  <Upload className="w-3 h-3" /> Import
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>

              <button
                onClick={handleDelete}
                disabled={!selectedId}
                className="btn-danger btn-sm w-full"
              >
                <Trash2 className="w-3 h-3" /> Delete Selected
              </button>
            </div>
          </div>
        </div>

        {/* Scenario Detail */}
        <div className="lg:col-span-2">
          <div className="card p-5">
            {selectedScenario ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedScenario.name}</h3>
                {selectedScenario.description && (
                  <p className="text-sm text-gray-500 mb-4">{selectedScenario.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-medium">{new Date(selectedScenario.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(selectedScenario.updatedAt).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-500">Treatment Beds</p>
                    <p className="font-bold text-blue-700">{selectedScenario.inputs.treatment.capacity.totalBeds}</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <p className="text-xs text-cyan-500">Thermal Capacity</p>
                    <p className="font-bold text-cyan-700">{selectedScenario.inputs.thermal.maxCapacity}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-500">Retail %</p>
                    <p className="font-bold text-purple-700">{selectedScenario.inputs.retail.revenuePercentage}%</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-amber-500">Rent Tiers</p>
                    <p className="font-bold text-amber-700">{selectedScenario.inputs.costs.rentTiers.length}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <FileJson className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">Select a scenario to view details</p>
                <p className="text-xs mt-1">Or save your current configuration as a new scenario</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditing ? 'Update Scenario' : 'Save New Scenario'}
            </h3>
            <div className="space-y-4">
              <div className="input-group">
                <label>Scenario Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g., Base Configuration 2025"
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label>Description (optional)</label>
                <textarea
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  placeholder="Brief description of this scenario..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSaveDialog(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!saveName.trim()} className="btn-primary flex-1">
                <Save className="w-4 h-4" />
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
