'use client'

import React, { useState, useRef } from 'react'
import { useFinancialContext } from '@/context/FinancialContext'
import { useFormattedCalculations } from '@/utils/useFinancialCalculations'
import { exportRevenueToExcel, exportFinancialToExcel } from '@/utils/excelExport'
import { formatCurrency, formatPercentage, DAYS_OF_WEEK } from '@/utils/localStorage'
import { calculateTieredRent } from '@/utils/calculations'
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Download,
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Building2,
  Waves,
  ShoppingBag,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react'

export default function ReportsPage() {
  const { inputs, calculations, isLoaded } = useFinancialContext()
  const formatted = useFormattedCalculations(calculations)
  const printRef = useRef<HTMLDivElement>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    executive: true,
    revenue: true,
    costs: true,
    profit: true,
    capacity: true,
    rent: false,
    config: false
  })

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  const annualRevenue = calculations.revenue.totals.total * 52
  const annualCosts = calculations.costs.totals.total * 52
  const annualProfit = calculations.profit.weekly.profit * 52
  const tieredRent = calculateTieredRent(annualRevenue, inputs.costs.rentTiers)
  const annualRent = Math.max(tieredRent, inputs.costs.baseRent ?? 0)
  const effectiveRentRate = annualRevenue > 0 ? (annualRent / annualRevenue) * 100 : 0

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const expandAll = () => {
    const all: Record<string, boolean> = {}
    Object.keys(expandedSections).forEach(k => { all[k] = true })
    setExpandedSections(all)
  }

  const collapseAll = () => {
    const all: Record<string, boolean> = {}
    Object.keys(expandedSections).forEach(k => { all[k] = false })
    setExpandedSections(all)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportRevenue = () => {
    exportRevenueToExcel(calculations, inputs)
  }

  const handleExportFinancial = () => {
    exportFinancialToExcel(calculations, inputs)
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Financial Reports</h2>
          <p className="text-sm text-gray-500 mt-1">View, print, and export detailed financial analysis</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={expandAll} className="btn-ghost text-xs">
            <Eye className="w-3.5 h-3.5 mr-1" /> Expand All
          </button>
          <button onClick={collapseAll} className="btn-ghost text-xs">
            <EyeOff className="w-3.5 h-3.5 mr-1" /> Collapse All
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={handleExportRevenue}
          className="card hover:shadow-lg transition-all duration-200 p-5 flex items-center gap-4 group cursor-pointer border-2 border-transparent hover:border-green-300"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-green-700" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">Revenue Report</div>
            <div className="text-xs text-gray-500">Excel (.xlsx)</div>
          </div>
          <Download className="w-4 h-4 text-gray-400 ml-auto group-hover:text-green-600" />
        </button>

        <button
          onClick={handleExportFinancial}
          className="card hover:shadow-lg transition-all duration-200 p-5 flex items-center gap-4 group cursor-pointer border-2 border-transparent hover:border-blue-300"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-blue-700" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">Financial Report</div>
            <div className="text-xs text-gray-500">Excel (.xlsx)</div>
          </div>
          <Download className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600" />
        </button>

        <button
          onClick={handlePrint}
          className="card hover:shadow-lg transition-all duration-200 p-5 flex items-center gap-4 group cursor-pointer border-2 border-transparent hover:border-purple-300"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Printer className="w-6 h-6 text-purple-700" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">Print Report</div>
            <div className="text-xs text-gray-500">Browser print</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-purple-600" />
        </button>
      </div>

      {/* Printable Report Content */}
      <div ref={printRef} className="space-y-4 print-report">
        {/* Report Header (print only) */}
        <div className="hidden print:block text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Aires Financial Model</h1>
          <p className="text-gray-500">Comprehensive Financial Report</p>
          <p className="text-sm text-gray-400 mt-1">Generated: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Executive Summary */}
        <ReportSection
          title="Executive Summary"
          icon={<BarChart3 className="w-5 h-5" />}
          isExpanded={expandedSections.executive}
          onToggle={() => toggleSection('executive')}
          accentColor="blue"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              label="Weekly Revenue"
              value={formatCurrency(calculations.revenue.totals.total)}
              subValue={`${formatCurrency(annualRevenue)}/yr`}
              trend="up"
              color="blue"
            />
            <SummaryCard
              label="Weekly Costs"
              value={formatCurrency(calculations.costs.totals.total)}
              subValue={`${formatCurrency(annualCosts)}/yr`}
              trend="down"
              color="red"
            />
            <SummaryCard
              label="Weekly Profit"
              value={formatCurrency(calculations.profit.weekly.profit)}
              subValue={`${formatCurrency(annualProfit)}/yr`}
              trend={calculations.profit.weekly.profit >= 0 ? 'up' : 'down'}
              color={calculations.profit.weekly.profit >= 0 ? 'green' : 'red'}
            />
            <SummaryCard
              label="Profit Margin"
              value={`${calculations.profit.weekly.margin.toFixed(1)}%`}
              subValue={calculations.profit.weekly.margin >= 20 ? 'Healthy' : 'Below target'}
              trend={calculations.profit.weekly.margin >= 20 ? 'up' : 'down'}
              color={calculations.profit.weekly.margin >= 20 ? 'green' : 'amber'}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Metric</th>
                  <th className="text-right">Weekly</th>
                  <th className="text-right">Annual</th>
                  <th className="text-right">% of Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-semibold bg-blue-50">
                  <td>Total Revenue</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.total)}</td>
                  <td className="text-right">{formatCurrency(annualRevenue)}</td>
                  <td className="text-right">100.0%</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Treatment Revenue</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.treatment)}</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.treatment * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.revenue.totals.treatment / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Thermal Revenue</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.thermal)}</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.thermal * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.revenue.totals.thermal / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Retail Revenue</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.retail)}</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.retail * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.revenue.totals.retail / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr className="font-semibold bg-red-50">
                  <td>Total Costs</td>
                  <td className="text-right">{formatCurrency(calculations.costs.totals.total)}</td>
                  <td className="text-right">{formatCurrency(annualCosts)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.totals.total / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr className={`font-bold ${calculations.profit.weekly.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <td>Net Profit</td>
                  <td className="text-right">{formatCurrency(calculations.profit.weekly.profit)}</td>
                  <td className="text-right">{formatCurrency(annualProfit)}</td>
                  <td className="text-right">{calculations.profit.weekly.margin.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ReportSection>

        {/* Daily Revenue Breakdown */}
        <ReportSection
          title="Daily Revenue Analysis"
          icon={<Calendar className="w-5 h-5" />}
          isExpanded={expandedSections.revenue}
          onToggle={() => toggleSection('revenue')}
          accentColor="green"
        >
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Day</th>
                  <th className="text-right">Treatments</th>
                  <th className="text-right">Treatment $</th>
                  <th className="text-right">Thermal Visits</th>
                  <th className="text-right">Thermal $</th>
                  <th className="text-right">Retail $</th>
                  <th className="text-right font-bold">Total</th>
                  <th className="text-right">% of Week</th>
                </tr>
              </thead>
              <tbody>
                {calculations.revenue.daily.map((day, index) => (
                  <tr key={DAYS_OF_WEEK[index]}>
                    <td className="font-medium">{DAYS_OF_WEEK[index]}</td>
                    <td className="text-right">{calculations.utilization.treatmentCount[index]}</td>
                    <td className="text-right">{formatCurrency(day.treatment)}</td>
                    <td className="text-right">{calculations.utilization.thermalCount[index]}</td>
                    <td className="text-right">{formatCurrency(day.thermal)}</td>
                    <td className="text-right">{formatCurrency(day.retail)}</td>
                    <td className="text-right font-semibold">{formatCurrency(day.total)}</td>
                    <td className="text-right text-gray-500">
                      {((day.total / calculations.revenue.totals.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-green-50 border-t-2">
                  <td>TOTAL</td>
                  <td className="text-right">{calculations.utilization.treatmentCount.reduce((s, c) => s + c, 0)}</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.treatment)}</td>
                  <td className="text-right">{calculations.utilization.thermalCount.reduce((s, c) => s + c, 0)}</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.thermal)}</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.retail)}</td>
                  <td className="text-right">{formatCurrency(calculations.revenue.totals.total)}</td>
                  <td className="text-right">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ReportSection>

        {/* Cost Breakdown */}
        <ReportSection
          title="Cost Breakdown"
          icon={<DollarSign className="w-5 h-5" />}
          isExpanded={expandedSections.costs}
          onToggle={() => toggleSection('costs')}
          accentColor="red"
        >
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Cost Category</th>
                  <th className="text-right">Weekly</th>
                  <th className="text-right">Annual</th>
                  <th className="text-right">% of Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-semibold bg-red-50">
                  <td>Total Costs</td>
                  <td className="text-right">{formatCurrency(calculations.costs.totals.total)}</td>
                  <td className="text-right">{formatCurrency(annualCosts)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.totals.total / calculations.revenue.totals.total * 100)}</td>
                </tr>
                {/* Fixed Costs */}
                <tr className="bg-amber-50/50">
                  <td className="font-medium">Fixed Costs</td>
                  <td className="text-right font-medium">{formatCurrency(calculations.costs.totals.fixed)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.totals.fixed * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.totals.fixed / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Rent (Tiered)</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.rent)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.rent * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.rent / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Management Salary</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.management)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.management * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.management / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Overhead</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.overhead)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.overhead * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.overhead / calculations.revenue.totals.total * 100)}</td>
                </tr>
                {/* Variable Costs */}
                <tr className="bg-orange-50/50">
                  <td className="font-medium">Variable Costs</td>
                  <td className="text-right font-medium">{formatCurrency(calculations.costs.totals.variable)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.totals.variable * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.totals.variable / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Back Bar (per treatment)</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.backBar)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.backBar * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.backBar / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Amenities (per guest)</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.amenities)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.amenities * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.amenities / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Retail COGS</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.retailCOGS)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.retailCOGS * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.retailCOGS / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Treatment Labor</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.treatmentLabor)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.treatmentLabor * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.treatmentLabor / calculations.revenue.totals.total * 100)}</td>
                </tr>
                {/* Labor Costs */}
                <tr className="bg-rose-50/50">
                  <td className="font-medium">Labor Costs</td>
                  <td className="text-right font-medium">{formatCurrency(calculations.costs.totals.labor)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.totals.labor * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.totals.labor / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Attendants</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.attendantLabor)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.attendantLabor * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.attendantLabor / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Receptionists</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.receptionistLabor)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.receptionistLabor * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.receptionistLabor / calculations.revenue.totals.total * 100)}</td>
                </tr>
                <tr>
                  <td className="pl-6 text-gray-600">Supervisors</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.supervisorLabor)}</td>
                  <td className="text-right">{formatCurrency(calculations.costs.breakdown.supervisorLabor * 52)}</td>
                  <td className="text-right">{formatPercentage(calculations.costs.breakdown.supervisorLabor / calculations.revenue.totals.total * 100)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ReportSection>

        {/* Daily Profit */}
        <ReportSection
          title="Daily Profit & Loss"
          icon={<TrendingUp className="w-5 h-5" />}
          isExpanded={expandedSections.profit}
          onToggle={() => toggleSection('profit')}
          accentColor="emerald"
        >
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Day</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Costs</th>
                  <th className="text-right">Profit</th>
                  <th className="text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {calculations.profit.daily.map((day, index) => (
                  <tr key={DAYS_OF_WEEK[index]}>
                    <td className="font-medium">{DAYS_OF_WEEK[index]}</td>
                    <td className="text-right">{formatCurrency(day.revenue)}</td>
                    <td className="text-right">{formatCurrency(day.costs)}</td>
                    <td className={`text-right font-semibold ${day.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatCurrency(day.profit)}
                    </td>
                    <td className={`text-right ${day.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {day.margin.toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className={`font-bold border-t-2 ${calculations.profit.weekly.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <td>TOTAL</td>
                  <td className="text-right">{formatCurrency(calculations.profit.weekly.revenue)}</td>
                  <td className="text-right">{formatCurrency(calculations.profit.weekly.costs)}</td>
                  <td className={`text-right ${calculations.profit.weekly.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(calculations.profit.weekly.profit)}
                  </td>
                  <td className="text-right">{calculations.profit.weekly.margin.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ReportSection>

        {/* Capacity & Utilization */}
        <ReportSection
          title="Capacity & Utilization"
          icon={<Users className="w-5 h-5" />}
          isExpanded={expandedSections.capacity}
          onToggle={() => toggleSection('capacity')}
          accentColor="indigo"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Treatment Capacity */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-600" /> Treatment Capacity
              </h4>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Daily Capacity</span>
                  <span className="font-medium">{calculations.capacity.dailyTreatmentCapacity} treatments</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Weekly Capacity</span>
                  <span className="font-medium">{calculations.capacity.weeklyTreatmentCapacity} treatments</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Avg. Utilization</span>
                  <span className="font-medium">{(inputs.treatment.utilization.reduce((s, u) => s + u, 0) / 7).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Weekly Treatments</span>
                  <span className="font-medium">{calculations.utilization.treatmentCount.reduce((s, c) => s + c, 0)}</span>
                </div>
              </div>

              <table className="data-table w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left">Day</th>
                    <th className="text-right">Util %</th>
                    <th className="text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS_OF_WEEK.map((day, i) => (
                    <tr key={day}>
                      <td>{day}</td>
                      <td className="text-right">{inputs.treatment.utilization[i]}%</td>
                      <td className="text-right">{calculations.utilization.treatmentCount[i]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Thermal Capacity */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" /> Thermal Capacity
              </h4>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Daily Capacity</span>
                  <span className="font-medium">{calculations.capacity.dailyThermalCapacity} visits</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Weekly Capacity</span>
                  <span className="font-medium">{calculations.capacity.weeklyThermalCapacity} visits</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Avg. Utilization</span>
                  <span className="font-medium">{(inputs.thermal.utilization.reduce((s, u) => s + u, 0) / 7).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Weekly Visits</span>
                  <span className="font-medium">{calculations.utilization.thermalCount.reduce((s, c) => s + c, 0)}</span>
                </div>
              </div>

              <table className="data-table w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left">Day</th>
                    <th className="text-right">Util %</th>
                    <th className="text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS_OF_WEEK.map((day, i) => (
                    <tr key={day}>
                      <td>{day}</td>
                      <td className="text-right">{inputs.thermal.utilization[i]}%</td>
                      <td className="text-right">{calculations.utilization.thermalCount[i]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ReportSection>

        {/* Tiered Rent Structure */}
        <ReportSection
          title="Tiered Rent Structure"
          icon={<Building2 className="w-5 h-5" />}
          isExpanded={expandedSections.rent}
          onToggle={() => toggleSection('rent')}
          accentColor="amber"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Annual Revenue</div>
              <div className="font-semibold text-gray-900">{formatCurrency(annualRevenue)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Annual Rent</div>
              <div className="font-semibold text-gray-900">{formatCurrency(annualRent)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Weekly Rent</div>
              <div className="font-semibold text-gray-900">{formatCurrency(calculations.costs.breakdown.rent)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Effective Rate</div>
              <div className="font-semibold text-gray-900">{effectiveRentRate.toFixed(2)}%</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Tier</th>
                  <th className="text-right">Min Revenue</th>
                  <th className="text-right">Max Revenue</th>
                  <th className="text-right">Rate</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {inputs.costs.rentTiers.map((tier, index) => {
                  const isActive = annualRevenue >= tier.minRevenue && 
                    (tier.maxRevenue === null || annualRevenue <= tier.maxRevenue)
                  return (
                    <tr key={index} className={isActive ? 'bg-amber-50' : ''}>
                      <td className="font-medium">Tier {index + 1}</td>
                      <td className="text-right">{formatCurrency(tier.minRevenue)}</td>
                      <td className="text-right">{tier.maxRevenue !== null ? formatCurrency(tier.maxRevenue) : 'Unlimited'}</td>
                      <td className="text-right">{tier.percentage}%</td>
                      <td className="text-center">
                        {isActive && <span className="badge badge-success">ACTIVE</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">
            Note: Each tier&apos;s percentage applies only to revenue within that tier&apos;s range (progressive calculation).
          </p>
        </ReportSection>

        {/* Model Configuration */}
        <ReportSection
          title="Model Configuration"
          icon={<FileText className="w-5 h-5" />}
          isExpanded={expandedSections.config}
          onToggle={() => toggleSection('config')}
          accentColor="gray"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Treatment Config */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <Waves className="w-4 h-4 text-blue-600" /> Treatment
              </h4>
              <div className="space-y-1.5 text-sm">
                <ConfigRow label="Beds" value={inputs.treatment.capacity.totalBeds.toString()} />
                <ConfigRow label="Operating Hours" value={`${inputs.treatment.capacity.operatingHours}h`} />
                <ConfigRow label="Treatment Duration" value={`${inputs.treatment.capacity.treatmentDuration} min`} />
                <ConfigRow label="Cleaning Time" value={`${inputs.treatment.capacity.cleaningTime} min`} />
                <ConfigRow label="Stagger Interval" value={`${inputs.treatment.capacity.staggerInterval} min`} />
                <ConfigRow label="Hotel Guest %" value={`${inputs.treatment.hotelGuestPercentage}%`} />
              </div>
            </div>

            {/* Thermal Config */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-purple-600" /> Thermal
              </h4>
              <div className="space-y-1.5 text-sm">
                <ConfigRow label="Max Capacity" value={`${inputs.thermal.maxCapacity} guests`} />
                <ConfigRow label="Operating Hours" value={`${inputs.thermal.operatingHours}h`} />
                <ConfigRow label="Session Duration" value={`${inputs.thermal.sessionDuration}h`} />
                <ConfigRow label="Hotel Guest %" value={`${inputs.thermal.hotelGuestPercentage}%`} />
                <ConfigRow label="Hotel Combo Disc." value={formatCurrency(inputs.thermal.hotelComboDiscount)} />
                <ConfigRow label="Non-Hotel Combo Disc." value={formatCurrency(inputs.thermal.nonHotelComboDiscount)} />
              </div>
            </div>

            {/* Cost Config */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-red-600" /> Costs
              </h4>
              <div className="space-y-1.5 text-sm">
                <ConfigRow label="Mgmt Salary" value={`${formatCurrency(inputs.costs.annualManagementSalary)}/yr`} />
                <ConfigRow label="Weekly Overhead" value={formatCurrency(inputs.costs.weeklyOverhead)} />
                <ConfigRow label="Back Bar Cost" value={`${formatCurrency(inputs.costs.backBarCostPerTreatment)}/tx`} />
                <ConfigRow label="Amenity Cost" value={`${formatCurrency(inputs.costs.amenityCostPerGuest)}/guest`} />
                <ConfigRow label="Treatment Labor" value={`${formatCurrency(inputs.costs.treatmentLaborCost)}/tx`} />
                <ConfigRow label="Retail COGS" value={`${inputs.costs.retailCOGSPercentage}%`} />
                <ConfigRow label="Retail %" value={`${inputs.retail.revenuePercentage}%`} />
              </div>
            </div>
          </div>
        </ReportSection>
      </div>
    </div>
  )
}

// Sub-components

function ReportSection({ 
  title, icon, isExpanded, onToggle, accentColor, children 
}: { 
  title: string
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  accentColor: string
  children: React.ReactNode
}) {
  const colorMap: Record<string, string> = {
    blue: 'border-l-blue-500 bg-blue-50/30',
    green: 'border-l-green-500 bg-green-50/30',
    red: 'border-l-red-500 bg-red-50/30',
    emerald: 'border-l-emerald-500 bg-emerald-50/30',
    indigo: 'border-l-indigo-500 bg-indigo-50/30',
    amber: 'border-l-amber-500 bg-amber-50/30',
    gray: 'border-l-gray-500 bg-gray-50/30'
  }

  const headerColor = colorMap[accentColor] || colorMap.gray

  return (
    <div className="card overflow-hidden print:break-inside-avoid">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 border-l-4 ${headerColor} hover:opacity-80 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-700">{icon}</span>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <span className="text-gray-400 print:hidden">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      {isExpanded && (
        <div className="p-5 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  )
}

function SummaryCard({ 
  label, value, subValue, trend, color 
}: { 
  label: string
  value: string
  subValue: string
  trend: 'up' | 'down'
  color: string
}) {
  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-500' },
    red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' }
  }
  const colors = colorMap[color] || colorMap.blue

  return (
    <div className={`${colors.bg} rounded-xl p-4`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-lg font-bold ${colors.text}`}>{value}</div>
      <div className="flex items-center gap-1 mt-1">
        {trend === 'up' ? (
          <ArrowUpRight className={`w-3 h-3 ${colors.icon}`} />
        ) : (
          <ArrowDownRight className={`w-3 h-3 ${colors.icon}`} />
        )}
        <span className="text-xs text-gray-500">{subValue}</span>
      </div>
    </div>
  )
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}
