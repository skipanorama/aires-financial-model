'use client'

import React, { useState, useMemo } from 'react'
import { useFinancialContext } from '@/context/FinancialContext'
import { useFormattedCalculations } from '@/utils/useFinancialCalculations'
import { NumberInput } from '@/components/ui/NumberInput'
import { DAYS_SHORT } from '@/utils/localStorage'
import { RentTier, RentConfig } from '@/utils/types'
import { calculateFullRent, calculateEscalatedAmount } from '@/utils/calculations'
import {
  Building2,
  TrendingUp,
  Users2,
  Plus,
  Trash2,
  DollarSign,
  Info,
  Calendar,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react'

type Section = 'fixed' | 'variable' | 'labor'

export default function CostsPage() {
  const { inputs, calculations, updateCosts } = useFinancialContext()
  const formatted = useFormattedCalculations(calculations)
  const [activeSection, setActiveSection] = useState<Section>('fixed')

  const rentConfig = inputs.costs.rentConfig
  const annualRevenue = calculations.revenue.totals.total * 52

  const rentCalc = useMemo(() =>
    calculateFullRent(annualRevenue, rentConfig),
    [annualRevenue, rentConfig]
  )

  const sections = [
    { id: 'fixed' as Section, label: 'Fixed Costs', icon: Building2, color: 'text-amber-600 bg-amber-50' },
    { id: 'variable' as Section, label: 'Variable Costs', icon: TrendingUp, color: 'text-red-600 bg-red-50' },
    { id: 'labor' as Section, label: 'Labor Costs', icon: Users2, color: 'text-green-600 bg-green-50' },
  ]

  const updateRentConfig = (updates: Partial<RentConfig>) => {
    updateCosts(prev => ({
      ...prev,
      rentConfig: { ...prev.rentConfig, ...updates }
    }))
  }

  const updateRentTier = (index: number, field: keyof RentTier, value: number | null) => {
    updateCosts(prev => {
      const newTiers = [...prev.rentConfig.percentageRentTiers]
      newTiers[index] = { ...newTiers[index], [field]: value }
      return { ...prev, rentConfig: { ...prev.rentConfig, percentageRentTiers: newTiers } }
    })
  }

  const addRentTier = () => {
    updateCosts(prev => {
      const tiers = prev.rentConfig.percentageRentTiers
      const lastTier = tiers[tiers.length - 1]
      const newTier: RentTier = {
        minRevenue: lastTier?.maxRevenue ?? 0,
        maxRevenue: null,
        percentage: (lastTier?.percentage ?? 5) + 1
      }
      return {
        ...prev,
        rentConfig: { ...prev.rentConfig, percentageRentTiers: [...tiers, newTier] }
      }
    })
  }

  const removeRentTier = (index: number) => {
    if (rentConfig.percentageRentTiers.length <= 1) return
    updateCosts(prev => ({
      ...prev,
      rentConfig: {
        ...prev.rentConfig,
        percentageRentTiers: prev.rentConfig.percentageRentTiers.filter((_, i) => i !== index)
      }
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
            <p className="text-xs text-gray-500">Fixed Costs (Weekly)</p>
            <p className="text-lg font-bold text-gray-900">{formatted.costBreakdown.fixed}</p>
            <p className="text-xs text-gray-400">${(calculations.costs.totals.fixed * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Variable Costs (Weekly)</p>
            <p className="text-lg font-bold text-gray-900">{formatted.costBreakdown.variable}</p>
            <p className="text-xs text-gray-400">${(calculations.costs.totals.variable * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Users2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Labor Costs (Weekly)</p>
            <p className="text-lg font-bold text-gray-900">{formatted.costBreakdown.labor}</p>
            <p className="text-xs text-gray-400">${(calculations.costs.totals.labor * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</p>
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
              {/* Lease Year */}
              <div>
                <h3 className="section-title mb-4">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Lease Year
                </h3>
                <div className="max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Lease Year</span>
                    <span className="text-lg font-bold text-amber-700">Year {rentConfig.currentLeaseYear}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    value={rentConfig.currentLeaseYear}
                    onChange={(e) => updateRentConfig({ currentLeaseYear: parseInt(e.target.value) })}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Year 1</span>
                    <span>Year {rentConfig.cpiStartYear} (CPI starts)</span>
                    <span>Year 25</span>
                  </div>
                  {rentConfig.currentLeaseYear >= rentConfig.cpiStartYear && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      CPI escalation active — {rentConfig.currentLeaseYear - rentConfig.cpiStartYear + 1} year(s) of {rentConfig.cpiRate}% compound growth applied
                    </p>
                  )}
                </div>
              </div>

              {/* Base Rent & Additional Rent with CPI */}
              <div>
                <h3 className="section-title mb-4">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  Fixed Rent (Base + Additional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <div>
                    <NumberInput
                      label="Annual Base Rent"
                      value={rentConfig.baseRentAnnual}
                      onChange={(v) => updateRentConfig({ baseRentAnnual: v })}
                      min={0}
                      step={5000}
                      prefix="$"
                    />
                    <p className="text-xs text-gray-500 mt-1">Base annual rent before CPI escalation</p>
                  </div>
                  <div>
                    <NumberInput
                      label="Annual Additional Rent"
                      value={rentConfig.additionalRentAnnual}
                      onChange={(v) => updateRentConfig({ additionalRentAnnual: v })}
                      min={0}
                      step={1000}
                      prefix="$"
                    />
                    <p className="text-xs text-gray-500 mt-1">Utilities, CAM, ops costs, etc.</p>
                  </div>
                  <div>
                    <NumberInput
                      label="CPI Escalation Rate"
                      value={rentConfig.cpiRate}
                      onChange={(v) => updateRentConfig({ cpiRate: v })}
                      min={0}
                      max={10}
                      step={0.25}
                      suffix="%"
                    />
                    <p className="text-xs text-gray-500 mt-1">Annual compound escalation rate</p>
                  </div>
                  <div>
                    <NumberInput
                      label="CPI Start Year"
                      value={rentConfig.cpiStartYear}
                      onChange={(v) => updateRentConfig({ cpiStartYear: v })}
                      min={1}
                      max={25}
                    />
                    <p className="text-xs text-gray-500 mt-1">Lease year when CPI escalation begins</p>
                  </div>
                </div>

                {/* Escalation Preview */}
                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-4 max-w-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">CPI Escalation Preview (Year {rentConfig.currentLeaseYear})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-amber-600">Base Rent (Escalated)</p>
                      <p className="font-bold text-amber-900">
                        ${rentCalc.baseRentEscalated.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-600">Additional Rent (Escalated)</p>
                      <p className="font-bold text-amber-900">
                        ${rentCalc.additionalRentEscalated.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-600">Total Fixed Rent</p>
                      <p className="font-bold text-amber-900">
                        ${rentCalc.fixedRentTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Percentage Rent Tiers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    Percentage Rent Tiers
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
                      {rentConfig.percentageRentTiers.map((tier, index) => {
                        const isActive = annualRevenue >= tier.minRevenue &&
                          (tier.maxRevenue === null || annualRevenue <= tier.maxRevenue)
                        return (
                          <tr key={index} className={isActive ? 'bg-amber-50/50' : ''}>
                            <td className="font-medium">Tier {index + 1}</td>
                            <td>
                              <input
                                type="number"
                                value={tier.minRevenue}
                                onChange={(e) => updateRentTier(index, 'minRevenue', parseInt(e.target.value) || 0)}
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
                                  onChange={(e) => updateRentTier(index, 'maxRevenue', parseInt(e.target.value) || null)}
                                  className="input-compact-wide"
                                />
                              )}
                            </td>
                            <td>
                              <input
                                type="number"
                                value={tier.percentage}
                                onChange={(e) => updateRentTier(index, 'percentage', parseFloat(e.target.value) || 0)}
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
                                disabled={rentConfig.percentageRentTiers.length <= 1}
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

                <div className="mt-3 bg-gray-50 rounded-lg p-3 max-w-md">
                  <p className="text-xs text-gray-500">Total Percentage Rent</p>
                  <p className="text-lg font-bold text-gray-800">
                    ${rentCalc.percentageRentTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* Rent Determination */}
              <div>
                <h3 className="section-title mb-4">
                  <ArrowUpDown className="w-4 h-4 text-amber-600" />
                  Rent Determination (Greater Of)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                  <div className={`rounded-lg p-4 border-2 ${rentCalc.rentType === 'fixed' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-600">Fixed Rent</p>
                      {rentCalc.rentType === 'fixed' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      ${rentCalc.fixedRentTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-gray-500">(Base + Additional w/ CPI)</p>
                    {rentCalc.rentType === 'fixed' && <p className="text-xs text-green-600 font-semibold mt-1">✓ APPLIES</p>}
                  </div>
                  <div className={`rounded-lg p-4 border-2 ${rentCalc.rentType === 'percentage' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-600">Percentage Rent</p>
                      {rentCalc.rentType === 'percentage' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      ${rentCalc.percentageRentTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-gray-500">(Progressive tiered)</p>
                    {rentCalc.rentType === 'percentage' && <p className="text-xs text-green-600 font-semibold mt-1">✓ APPLIES</p>}
                  </div>
                  <div className="rounded-lg p-4 border-2 border-amber-400 bg-amber-50">
                    <p className="text-xs font-medium text-amber-700 mb-1">Effective Annual Rent</p>
                    <p className="text-xl font-bold text-amber-900">
                      ${rentCalc.effectiveRentAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-amber-600">
                      ${(rentCalc.effectiveRentAnnual / 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/week
                    </p>
                    <p className="text-xs text-amber-600">
                      {annualRevenue > 0 ? ((rentCalc.effectiveRentAnnual / annualRevenue) * 100).toFixed(2) : '0.00'}% of revenue
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
                      <p>Back Bar: {formatted.detailedCosts.backBar}/wk <span className="text-blue-400">(${(calculations.costs.breakdown.backBar * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr)</span></p>
                      <p>Amenities: {formatted.detailedCosts.amenities}/wk <span className="text-blue-400">(${(calculations.costs.breakdown.amenities * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr)</span></p>
                      <p>Treatment Labor: {formatted.detailedCosts.treatmentLabor}/wk <span className="text-blue-400">(${(calculations.costs.breakdown.treatmentLabor * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr)</span></p>
                      <p>Retail COGS: {formatted.detailedCosts.retailCOGS}/wk <span className="text-blue-400">(${(calculations.costs.breakdown.retailCOGS * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr)</span></p>
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
                <p className="text-xs text-gray-400 mt-2">Weekly: {formatted.detailedCosts.attendantLabor} <span className="text-gray-300">(${(calculations.costs.breakdown.attendantLabor * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr)</span></p>
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
                <p className="text-xs text-gray-400 mt-2">Weekly: {formatted.detailedCosts.receptionistLabor} <span className="text-gray-300">(${(calculations.costs.breakdown.receptionistLabor * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr)</span></p>
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
                <p className="text-xs text-gray-400 mt-2">Weekly: {formatted.detailedCosts.supervisorLabor} <span className="text-gray-300">(${(calculations.costs.breakdown.supervisorLabor * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr)</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
