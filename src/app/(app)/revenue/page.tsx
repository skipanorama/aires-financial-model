'use client'

import React, { useState } from 'react'
import { useFinancialContext } from '@/context/FinancialContext'
import { useFormattedCalculations } from '@/utils/useFinancialCalculations'
import { NumberInput } from '@/components/ui/NumberInput'
import { DAYS_SHORT, DAYS_OF_WEEK } from '@/utils/localStorage'
import {
  Sparkles,
  Thermometer,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Zap,
  Info,
  Users
} from 'lucide-react'

type Tab = 'treatment' | 'thermal' | 'retail'

export default function RevenuePage() {
  const { inputs, calculations, updateTreatment, updateThermal, updateRetail } = useFinancialContext()
  const formatted = useFormattedCalculations(calculations)
  const [activeTab, setActiveTab] = useState<Tab>('treatment')

  const tabs = [
    { id: 'treatment' as Tab, label: 'Treatment', icon: Sparkles, color: 'text-blue-600 bg-blue-50' },
    { id: 'thermal' as Tab, label: 'Thermal Circuit', icon: Thermometer, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'retail' as Tab, label: 'Retail', icon: ShoppingBag, color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Revenue Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Treatment Revenue</p>
            <p className="text-lg font-bold text-gray-900">{formatted.revenueBreakdown.treatment}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Thermal Revenue</p>
            <p className="text-lg font-bold text-gray-900">{formatted.revenueBreakdown.thermal}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Retail Revenue</p>
            <p className="text-lg font-bold text-gray-900">{formatted.revenueBreakdown.retail}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Treatment Tab */}
          {activeTab === 'treatment' && (
            <div className="space-y-6 animate-fade-in">
              {/* Capacity Settings */}
              <div>
                <h3 className="section-title mb-4">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Capacity Settings
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <NumberInput
                    label="Total Beds"
                    value={inputs.treatment.capacity.totalBeds}
                    onChange={(v) => updateTreatment(prev => ({
                      ...prev,
                      capacity: { ...prev.capacity, totalBeds: v }
                    }))}
                    min={1}
                    max={50}
                  />
                  <NumberInput
                    label="Operating Hours"
                    value={inputs.treatment.capacity.operatingHours}
                    onChange={(v) => updateTreatment(prev => ({
                      ...prev,
                      capacity: { ...prev.capacity, operatingHours: v }
                    }))}
                    min={1}
                    max={24}
                    step={0.25}
                    suffix="hrs"
                  />
                  <NumberInput
                    label="Treatment (min)"
                    value={inputs.treatment.capacity.treatmentDuration}
                    onChange={(v) => updateTreatment(prev => ({
                      ...prev,
                      capacity: { ...prev.capacity, treatmentDuration: v }
                    }))}
                    min={15}
                    max={180}
                    step={5}
                  />
                  <NumberInput
                    label="Cleaning (min)"
                    value={inputs.treatment.capacity.cleaningTime}
                    onChange={(v) => updateTreatment(prev => ({
                      ...prev,
                      capacity: { ...prev.capacity, cleaningTime: v }
                    }))}
                    min={0}
                    max={60}
                    step={5}
                  />
                  <NumberInput
                    label="Stagger (min)"
                    value={inputs.treatment.capacity.staggerInterval}
                    onChange={(v) => updateTreatment(prev => ({
                      ...prev,
                      capacity: { ...prev.capacity, staggerInterval: v }
                    }))}
                    min={0}
                    max={60}
                    step={5}
                  />
                  <div className="input-group">
                    <label>Daily Capacity</label>
                    <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
                      <span className="text-xl font-bold text-blue-700">
                        {calculations.capacity.dailyTreatmentCapacity}
                      </span>
                      <span className="text-xs text-blue-500 block">treatments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Mix */}
              <div>
                <h3 className="section-title mb-4">
                  <Users className="w-4 h-4 text-blue-600" />
                  Guest Mix
                </h3>
                <div className="flex items-center gap-4 max-w-md">
                  <NumberInput
                    label="Hotel Guest %"
                    value={inputs.treatment.hotelGuestPercentage}
                    onChange={(v) => updateTreatment(prev => ({
                      ...prev,
                      hotelGuestPercentage: v
                    }))}
                    min={0}
                    max={100}
                    suffix="%"
                  />
                  <div className="input-group">
                    <label>Non-Hotel Guest %</label>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-700">
                      {100 - inputs.treatment.hotelGuestPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Utilization & Pricing Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">Daily Configuration</h3>
                  <div className="flex gap-2">
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        const avg = Math.round(inputs.treatment.utilization.reduce((s, u) => s + u, 0) / 7)
                        updateTreatment(prev => ({ ...prev, utilization: Array(7).fill(avg) }))
                      }}
                    >
                      Set All to Average
                    </button>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => updateTreatment(prev => ({ ...prev, utilization: [70, 75, 80, 85, 90, 95, 85] }))}
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        {DAYS_SHORT.map(day => (
                          <th key={day} className="text-center">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-medium text-gray-700">Utilization %</td>
                        {inputs.treatment.utilization.map((val, i) => (
                          <td key={i} className="text-center">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newVal = parseInt(e.target.value) || 0
                                updateTreatment(prev => {
                                  const newUtil = [...prev.utilization]
                                  newUtil[i] = Math.min(100, Math.max(0, newVal))
                                  return { ...prev, utilization: newUtil }
                                })
                              }}
                              className="input-compact"
                              min={0}
                              max={100}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-700">Hotel Price $</td>
                        {inputs.treatment.hotelPrices.map((val, i) => (
                          <td key={i} className="text-center">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newVal = parseInt(e.target.value) || 0
                                updateTreatment(prev => {
                                  const newPrices = [...prev.hotelPrices]
                                  newPrices[i] = newVal
                                  return { ...prev, hotelPrices: newPrices }
                                })
                              }}
                              className="input-compact"
                              min={0}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-700">Non-Hotel Price $</td>
                        {inputs.treatment.nonHotelPrices.map((val, i) => (
                          <td key={i} className="text-center">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newVal = parseInt(e.target.value) || 0
                                updateTreatment(prev => {
                                  const newPrices = [...prev.nonHotelPrices]
                                  newPrices[i] = newVal
                                  return { ...prev, nonHotelPrices: newPrices }
                                })
                              }}
                              className="input-compact"
                              min={0}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-blue-50/50">
                        <td className="font-medium text-blue-700">Treatments</td>
                        {calculations.utilization.treatmentCount.map((count, i) => (
                          <td key={i} className="text-center font-semibold text-blue-700">{count}</td>
                        ))}
                      </tr>
                      <tr className="bg-green-50/50">
                        <td className="font-medium text-green-700">Revenue $</td>
                        {calculations.revenue.daily.map((day, i) => (
                          <td key={i} className="text-center font-semibold text-green-700">
                            ${day.treatment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Thermal Tab */}
          {activeTab === 'thermal' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="section-title mb-4">
                  <Zap className="w-4 h-4 text-cyan-600" />
                  Capacity Settings
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <NumberInput
                    label="Max Capacity"
                    value={inputs.thermal.maxCapacity}
                    onChange={(v) => updateThermal(prev => ({ ...prev, maxCapacity: v }))}
                    min={1}
                    max={200}
                    suffix="guests"
                  />
                  <NumberInput
                    label="Operating Hours"
                    value={inputs.thermal.operatingHours}
                    onChange={(v) => updateThermal(prev => ({ ...prev, operatingHours: v }))}
                    min={1}
                    max={24}
                    step={0.5}
                    suffix="hrs"
                  />
                  <NumberInput
                    label="Session Duration"
                    value={inputs.thermal.sessionDuration}
                    onChange={(v) => updateThermal(prev => ({ ...prev, sessionDuration: v }))}
                    min={0.5}
                    max={12}
                    step={0.5}
                    suffix="hrs"
                  />
                  <div className="input-group">
                    <label>Daily Capacity</label>
                    <div className="bg-cyan-50 rounded-lg px-3 py-2 text-center">
                      <span className="text-xl font-bold text-cyan-700">
                        {calculations.capacity.dailyThermalCapacity}
                      </span>
                      <span className="text-xs text-cyan-500 block">visits</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Mix & Combo */}
              <div>
                <h3 className="section-title mb-4">
                  <Users className="w-4 h-4 text-cyan-600" />
                  Guest Mix & Combo Discounts
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <NumberInput
                    label="Hotel Guest %"
                    value={inputs.thermal.hotelGuestPercentage}
                    onChange={(v) => updateThermal(prev => ({ ...prev, hotelGuestPercentage: v }))}
                    min={0}
                    max={100}
                    suffix="%"
                  />
                  <div className="input-group">
                    <label>Non-Hotel Guest %</label>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-700">
                      {100 - inputs.thermal.hotelGuestPercentage}%
                    </div>
                  </div>
                  <NumberInput
                    label="Hotel Combo Disc."
                    value={inputs.thermal.hotelComboDiscount}
                    onChange={(v) => updateThermal(prev => ({ ...prev, hotelComboDiscount: v }))}
                    min={0}
                    prefix="$"
                  />
                  <NumberInput
                    label="Non-Hotel Combo Disc."
                    value={inputs.thermal.nonHotelComboDiscount}
                    onChange={(v) => updateThermal(prev => ({ ...prev, nonHotelComboDiscount: v }))}
                    min={0}
                    prefix="$"
                  />
                </div>
              </div>

              {/* Daily Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">Daily Configuration</h3>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => updateThermal(prev => ({
                      ...prev,
                      utilization: [60, 65, 70, 75, 85, 90, 80]
                    }))}
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        {DAYS_SHORT.map(day => (
                          <th key={day} className="text-center">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-medium text-gray-700">Utilization %</td>
                        {inputs.thermal.utilization.map((val, i) => (
                          <td key={i} className="text-center">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newVal = parseInt(e.target.value) || 0
                                updateThermal(prev => {
                                  const newUtil = [...prev.utilization]
                                  newUtil[i] = Math.min(100, Math.max(0, newVal))
                                  return { ...prev, utilization: newUtil }
                                })
                              }}
                              className="input-compact"
                              min={0}
                              max={100}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-700">Hotel Price $</td>
                        {inputs.thermal.hotelPrices.map((val, i) => (
                          <td key={i} className="text-center">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newVal = parseInt(e.target.value) || 0
                                updateThermal(prev => {
                                  const newPrices = [...prev.hotelPrices]
                                  newPrices[i] = newVal
                                  return { ...prev, hotelPrices: newPrices }
                                })
                              }}
                              className="input-compact"
                              min={0}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-700">Non-Hotel Price $</td>
                        {inputs.thermal.nonHotelPrices.map((val, i) => (
                          <td key={i} className="text-center">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newVal = parseInt(e.target.value) || 0
                                updateThermal(prev => {
                                  const newPrices = [...prev.nonHotelPrices]
                                  newPrices[i] = newVal
                                  return { ...prev, nonHotelPrices: newPrices }
                                })
                              }}
                              className="input-compact"
                              min={0}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-700">Combo %</td>
                        {inputs.thermal.comboPercentages.map((val, i) => (
                          <td key={i} className="text-center">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newVal = parseInt(e.target.value) || 0
                                updateThermal(prev => {
                                  const newCombo = [...prev.comboPercentages]
                                  newCombo[i] = Math.min(100, Math.max(0, newVal))
                                  return { ...prev, comboPercentages: newCombo }
                                })
                              }}
                              className="input-compact"
                              min={0}
                              max={100}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-cyan-50/50">
                        <td className="font-medium text-cyan-700">Visits</td>
                        {calculations.utilization.thermalCount.map((count, i) => (
                          <td key={i} className="text-center font-semibold text-cyan-700">{count}</td>
                        ))}
                      </tr>
                      <tr className="bg-green-50/50">
                        <td className="font-medium text-green-700">Revenue $</td>
                        {calculations.revenue.daily.map((day, i) => (
                          <td key={i} className="text-center font-semibold text-green-700">
                            ${day.thermal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Retail Tab */}
          {activeTab === 'retail' && (
            <div className="space-y-6 animate-fade-in">
              <div className="max-w-lg">
                <h3 className="section-title mb-4">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                  Retail Revenue Configuration
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Retail revenue is calculated as a percentage of combined treatment and thermal revenue.
                </p>

                <NumberInput
                  label="Revenue Percentage"
                  value={inputs.retail.revenuePercentage}
                  onChange={(v) => updateRetail(prev => ({ ...prev, revenuePercentage: v }))}
                  min={0}
                  max={100}
                  step={0.5}
                  suffix="%"
                />

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs text-purple-500 mb-1">Weekly Retail Revenue</p>
                    <p className="text-xl font-bold text-purple-700">{formatted.revenueBreakdown.retail}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Base Revenue</p>
                    <p className="text-lg font-bold text-gray-700">
                      ${(calculations.revenue.totals.treatment + calculations.revenue.totals.thermal).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                {/* Quick presets */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Industry Benchmarks</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: 'Basic 8%', value: 8 },
                      { label: 'Standard 12%', value: 12 },
                      { label: 'Premium 20%', value: 20 },
                      { label: 'Luxury 30%', value: 30 },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => updateRetail(() => ({ revenuePercentage: preset.value }))}
                        className={`btn-sm ${
                          inputs.retail.revenuePercentage === preset.value
                            ? 'btn-primary'
                            : 'btn-secondary'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Tips for Retail Strategy</p>
                      <ul className="text-xs space-y-1 text-blue-600">
                        <li>• 8-12% is typical for basic retail offerings</li>
                        <li>• 15-20% for dedicated retail with curated brands</li>
                        <li>• 25-30% for premium spas with exclusive products</li>
                        <li>• Combine with treatment upselling for best results</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
