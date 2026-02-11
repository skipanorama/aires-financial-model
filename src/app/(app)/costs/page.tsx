'use client'

import React, { useState } from 'react'
import { useFinancialContext } from '@/context/FinancialContext'
import { useFormattedCalculations } from '@/utils/useFinancialCalculations'
import { NumberInput } from '@/components/ui/NumberInput'
import { DAYS_SHORT } from '@/utils/localStorage'
import { RentTier } from '@/utils/types'
import {
  Building2,
  TrendingUp,
  Users2,
  Plus,
  Trash2,
  DollarSign,
  Info
} from 'lucide-react'

type Section = 'fixed' | 'variable' | 'labor'

export default function CostsPage() {
  const { inputs, calculations, updateCosts } = useFinancialContext()
  const formatted = useFormattedCalculations(calculations)
  const [activeSection, setActiveSection] = useState<Section>('fixed')

  const sections = [
    { id: 'fixed' as Section, label: 'Fixed Costs', icon: Building2, color: 'text-amber-600 bg-amber-50' },
    { id: 'variable' as Section, label: 'Variable Costs', icon: TrendingUp, color: 'text-red-600 bg-red-50' },
    { id: 'labor' as Section, label: 'Labor Costs', icon: Users2, color: 'text-green-600 bg-green-50' },
  ]

  const addRentTier = () => {
    updateCosts(prev => {
      const lastTier = prev.rentTiers[prev.rentTiers.length - 1]
      const newTier: RentTier = {
        minRevenue: lastTier?.maxRevenue ?? 0,
        maxRevenue: null,
        percentage: (lastTier?.percentage ?? 5) + 1
      }
      return { ...prev, rentTiers: [...prev.rentTiers, newTier] }
    })
  }

  const removeRentTier = (index: number) => {
    if (inputs.costs.rentTiers.length <= 1) return
    updateCosts(prev => ({
      ...prev,
      rentTiers: prev.rentTiers.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cost Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Fixed Costs</p>
            <p className="text-lg font-bold text-gray-900">{formatted.costBreakdown.fixed}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Variable Costs</p>
            <p className="text-lg font-bold text-gray-900">{formatted.costBreakdown.variable}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Users2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Labor Costs</p>
            <p className="text-lg font-bold text-gray-900">{formatted.costBreakdown.labor}</p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-200">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-all ${
                activeSection === section.id
                  ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Fixed Costs */}
          {activeSection === 'fixed' && (
            <div className="space-y-6 animate-fade-in">
              {/* Tiered Rent */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    Progressive Tiered Rent
                  </h3>
                  <button onClick={addRentTier} className="btn-secondary btn-sm">
                    <Plus className="w-3 h-3" /> Add Tier
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tier</th>
                        <th>Min Revenue</th>
                        <th>Max Revenue</th>
                        <th>Rate %</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {inputs.costs.rentTiers.map((tier, index) => {
                        const annualRevenue = calculations.revenue.totals.total * 52
                        const isActive = annualRevenue >= tier.minRevenue &&
                          (tier.maxRevenue === null || annualRevenue <= tier.maxRevenue)
                        return (
                          <tr key={index} className={isActive ? 'bg-amber-50/50' : ''}>
                            <td className="font-medium">Tier {index + 1}</td>
                            <td>
                              <input
                                type="number"
                                value={tier.minRevenue}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  updateCosts(prev => {
                                    const newTiers = [...prev.rentTiers]
                                    newTiers[index] = { ...newTiers[index], minRevenue: val }
                                    return { ...prev, rentTiers: newTiers }
                                  })
                                }}
                                className="input-compact-wide"
                              />
                            </td>
                            <td>
                              {tier.maxRevenue === null ? (
                                <span className="text-gray-400 text-sm">Unlimited</span>
                              ) : (
                                <input
                                  type="number"
                                  value={tier.maxRevenue}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    updateCosts(prev => {
                                      const newTiers = [...prev.rentTiers]
                                      newTiers[index] = { ...newTiers[index], maxRevenue: val || null }
                                      return { ...prev, rentTiers: newTiers }
                                    })
                                  }}
                                  className="input-compact-wide"
                                />
                              )}
                            </td>
                            <td>
                              <input
                                type="number"
                                value={tier.percentage}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0
                                  updateCosts(prev => {
                                    const newTiers = [...prev.rentTiers]
                                    newTiers[index] = { ...newTiers[index], percentage: val }
                                    return { ...prev, rentTiers: newTiers }
                                  })
                                }}
                                className="input-compact"
                                step={0.5}
                              />
                            </td>
                            <td>
                              {isActive && <span className="badge-amber">Active</span>}
                            </td>
                            <td>
                              <button
                                onClick={() => removeRentTier(index)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                disabled={inputs.costs.rentTiers.length <= 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 max-w-md">
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-amber-500">Weekly Rent</p>
                    <p className="text-lg font-bold text-amber-700">{formatted.detailedCosts.rent}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Annual Revenue</p>
                    <p className="text-lg font-bold text-gray-700">
                      ${(calculations.revenue.totals.total * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Other Fixed Costs */}
              <div>
                <h3 className="section-title mb-4">Other Fixed Costs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                  <NumberInput
                    label="Annual Management Salary"
                    value={inputs.costs.annualManagementSalary}
                    onChange={(v) => updateCosts(prev => ({ ...prev, annualManagementSalary: v }))}
                    min={0}
                    step={1000}
                    prefix="$"
                  />
                  <NumberInput
                    label="Weekly Overhead"
                    value={inputs.costs.weeklyOverhead}
                    onChange={(v) => updateCosts(prev => ({ ...prev, weeklyOverhead: v }))}
                    min={0}
                    step={100}
                    prefix="$"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Variable Costs */}
          {activeSection === 'variable' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="section-title mb-4">
                <TrendingUp className="w-4 h-4 text-red-600" />
                Per-Unit Variable Costs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
                <NumberInput
                  label="Back Bar / Treatment"
                  value={inputs.costs.backBarCostPerTreatment}
                  onChange={(v) => updateCosts(prev => ({ ...prev, backBarCostPerTreatment: v }))}
                  min={0}
                  prefix="$"
                />
                <NumberInput
                  label="Amenity / Guest"
                  value={inputs.costs.amenityCostPerGuest}
                  onChange={(v) => updateCosts(prev => ({ ...prev, amenityCostPerGuest: v }))}
                  min={0}
                  prefix="$"
                />
                <NumberInput
                  label="Treatment Labor"
                  value={inputs.costs.treatmentLaborCost}
                  onChange={(v) => updateCosts(prev => ({ ...prev, treatmentLaborCost: v }))}
                  min={0}
                  prefix="$"
                />
                <NumberInput
                  label="Retail COGS %"
                  value={inputs.costs.retailCOGSPercentage}
                  onChange={(v) => updateCosts(prev => ({ ...prev, retailCOGSPercentage: v }))}
                  min={0}
                  max={100}
                  suffix="%"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-3xl">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Variable Cost Breakdown</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                      <p>Back Bar: {formatted.detailedCosts.backBar}/week</p>
                      <p>Amenities: {formatted.detailedCosts.amenities}/week</p>
                      <p>Treatment Labor: {formatted.detailedCosts.treatmentLabor}/week</p>
                      <p>Retail COGS: {formatted.detailedCosts.retailCOGS}/week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Labor Costs */}
          {activeSection === 'labor' && (
            <div className="space-y-8 animate-fade-in">
              {/* Attendants */}
              <div>
                <h3 className="section-title mb-4">
                  <Users2 className="w-4 h-4 text-green-600" />
                  Attendants
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <NumberInput
                    label="Hourly Rate"
                    value={inputs.costs.attendants.hourlyRate}
                    onChange={(v) => updateCosts(prev => ({
                      ...prev,
                      attendants: { ...prev.attendants, hourlyRate: v }
                    }))}
                    min={0}
                    prefix="$"
                    compact
                  />
                  <NumberInput
                    label="Hours/Shift"
                    value={inputs.costs.attendants.hoursPerShift}
                    onChange={(v) => updateCosts(prev => ({
                      ...prev,
                      attendants: { ...prev.attendants, hoursPerShift: v }
                    }))}
                    min={0}
                    step={0.25}
                    compact
                  />
                </div>
                <div className="day-grid">
                  {DAYS_SHORT.map((day, i) => (
                    <div key={day} className="day-cell">
                      <span className="day-label">{day}</span>
                      <input
                        type="number"
                        value={inputs.costs.attendants.dailyCount[i]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          updateCosts(prev => {
                            const newCounts = [...prev.attendants.dailyCount]
                            newCounts[i] = val
                            return { ...prev, attendants: { ...prev.attendants, dailyCount: newCounts } }
                          })
                        }}
                        className="input-compact"
                        min={0}
                        step={0.5}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Weekly: {formatted.detailedCosts.attendantLabor}</p>
              </div>

              {/* Receptionists */}
              <div>
                <h3 className="section-title mb-4">Receptionists</h3>
                <div className="flex items-center gap-4 mb-3">
                  <NumberInput
                    label="Hourly Rate"
                    value={inputs.costs.receptionists.hourlyRate}
                    onChange={(v) => updateCosts(prev => ({
                      ...prev,
                      receptionists: { ...prev.receptionists, hourlyRate: v }
                    }))}
                    min={0}
                    prefix="$"
                    compact
                  />
                  <NumberInput
                    label="Hours/Shift"
                    value={inputs.costs.receptionists.hoursPerShift}
                    onChange={(v) => updateCosts(prev => ({
                      ...prev,
                      receptionists: { ...prev.receptionists, hoursPerShift: v }
                    }))}
                    min={0}
                    step={0.25}
                    compact
                  />
                </div>
                <div className="day-grid">
                  {DAYS_SHORT.map((day, i) => (
                    <div key={day} className="day-cell">
                      <span className="day-label">{day}</span>
                      <input
                        type="number"
                        value={inputs.costs.receptionists.dailyCount[i]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          updateCosts(prev => {
                            const newCounts = [...prev.receptionists.dailyCount]
                            newCounts[i] = val
                            return { ...prev, receptionists: { ...prev.receptionists, dailyCount: newCounts } }
                          })
                        }}
                        className="input-compact"
                        min={0}
                        step={0.5}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Weekly: {formatted.detailedCosts.receptionistLabor}</p>
              </div>

              {/* Supervisors */}
              <div>
                <h3 className="section-title mb-4">Supervisors</h3>
                <div className="flex items-center gap-4 mb-3">
                  <NumberInput
                    label="Hourly Rate"
                    value={inputs.costs.supervisors.hourlyRate}
                    onChange={(v) => updateCosts(prev => ({
                      ...prev,
                      supervisors: { ...prev.supervisors, hourlyRate: v }
                    }))}
                    min={0}
                    prefix="$"
                    compact
                  />
                  <NumberInput
                    label="Hours/Shift"
                    value={inputs.costs.supervisors.hoursPerShift}
                    onChange={(v) => updateCosts(prev => ({
                      ...prev,
                      supervisors: { ...prev.supervisors, hoursPerShift: v }
                    }))}
                    min={0}
                    step={0.25}
                    compact
                  />
                </div>
                <div className="day-grid">
                  {DAYS_SHORT.map((day, i) => (
                    <div key={day} className="day-cell">
                      <span className="day-label">{day}</span>
                      <input
                        type="number"
                        value={inputs.costs.supervisors.dailyCount[i]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          updateCosts(prev => {
                            const newCounts = [...prev.supervisors.dailyCount]
                            newCounts[i] = val
                            return { ...prev, supervisors: { ...prev.supervisors, dailyCount: newCounts } }
                          })
                        }}
                        className="input-compact"
                        min={0}
                        step={0.5}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Weekly: {formatted.detailedCosts.supervisorLabor}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
