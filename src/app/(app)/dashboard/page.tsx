'use client'

import React from 'react'
import { useFinancialContext } from '@/context/FinancialContext'
import { useFormattedCalculations } from '@/utils/useFinancialCalculations'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Percent,
  Activity,
  Users,
  Thermometer
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'

export default function DashboardPage() {
  const { calculations, isLoaded } = useFinancialContext()
  const formatted = useFormattedCalculations(calculations)

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 animate-pulse">Loading financial data...</div>
      </div>
    )
  }

  const isProfit = calculations.profit.weekly.profit >= 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <span className="kpi-label">Weekly Revenue</span>
            <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <span className="kpi-value text-primary-700">{formatted.weeklyRevenue}</span>
          <span className="kpi-sublabel">
            Annual: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(calculations.profit.weekly.revenue * 52)}
          </span>
        </div>

        <div className="kpi-card border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <span className="kpi-label">Weekly Costs</span>
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <span className="kpi-value text-red-600">{formatted.weeklyCosts}</span>
          <span className="kpi-sublabel">
            Annual: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(calculations.profit.weekly.costs * 52)}
          </span>
        </div>

        <div className={`kpi-card border-l-4 ${isProfit ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <div className="flex items-center justify-between">
            <span className="kpi-label">Weekly Profit</span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
          <span className={`kpi-value ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {formatted.weeklyProfit}
          </span>
          <span className="kpi-sublabel">
            Annual: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(calculations.profit.weekly.profit * 52)}
          </span>
        </div>

        <div className="kpi-card border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="kpi-label">Profit Margin</span>
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <span className={`kpi-value ${calculations.profit.weekly.margin >= 20 ? 'text-green-600' : calculations.profit.weekly.margin >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
            {formatted.weeklyMargin}
          </span>
          <span className="kpi-sublabel">Target: 20%+</span>
        </div>
      </div>

      {/* Charts Row 1 - Revenue and Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown Pie Chart */}
        <div className="card p-5">
          <h3 className="section-title mb-4">Revenue Breakdown</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatted.revenueChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {formatted.revenueChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {formatted.revenueChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown Pie Chart */}
        <div className="card p-5">
          <h3 className="section-title mb-4">Cost Breakdown</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatted.costChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {formatted.costChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {formatted.costChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Revenue Bar Chart */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Daily Revenue by Category</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted.dailyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="treatmentRevenue" name="Treatment" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="thermalRevenue" name="Thermal" fill="#06b6d4" radius={[2, 2, 0, 0]} />
              <Bar dataKey="retailRevenue" name="Retail" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Trend & Revenue vs Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="section-title mb-4">Daily Profit Trend</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatted.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">Revenue vs Costs</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formatted.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Area type="monotone" dataKey="totalRevenue" name="Revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="totalCosts" name="Costs" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Capacity & Utilization Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Treatment Capacity</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatted.capacity.dailyTreatmentCapacity}/day</p>
          <p className="text-xs text-gray-400 mt-1">{formatted.capacity.weeklyTreatmentCapacity}/week</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-cyan-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Thermal Capacity</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatted.capacity.dailyThermalCapacity}/day</p>
          <p className="text-xs text-gray-400 mt-1">{formatted.capacity.weeklyThermalCapacity}/week</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Avg Treatment Util.</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatted.utilizationMetrics.avgTreatmentUtilization}%</p>
          <p className="text-xs text-gray-400 mt-1">{formatted.utilizationMetrics.weeklyTreatmentCount} treatments/week</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Avg Thermal Util.</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatted.utilizationMetrics.avgThermalUtilization}%</p>
          <p className="text-xs text-gray-400 mt-1">{formatted.utilizationMetrics.weeklyThermalCount} visits/week</p>
        </div>
      </div>

      {/* Weekly Financial Summary Table */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Weekly Financial Summary</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                {formatted.dailyData.map(day => (
                  <th key={day.day} className="text-right">{day.day}</th>
                ))}
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue row */}
              <tr className="bg-green-50/50">
                <td className="font-semibold text-green-700">Revenue</td>
                {formatted.dailyData.map(day => (
                  <td key={day.day} className="text-right font-medium text-green-700">
                    ${day.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                ))}
                <td className="text-right font-bold text-green-700">
                  {formatted.revenueBreakdown.total}
                </td>
              </tr>
              {/* Costs row */}
              <tr className="bg-red-50/50">
                <td className="font-semibold text-red-700">Costs</td>
                {formatted.dailyData.map(day => (
                  <td key={day.day} className="text-right font-medium text-red-700">
                    ${day.totalCosts.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                ))}
                <td className="text-right font-bold text-red-700">
                  {formatted.costBreakdown.total}
                </td>
              </tr>
              {/* Profit row */}
              <tr className={`${isProfit ? 'bg-blue-50/50' : 'bg-red-100/50'}`}>
                <td className={`font-bold ${isProfit ? 'text-blue-800' : 'text-red-800'}`}>Profit</td>
                {formatted.dailyData.map(day => (
                  <td key={day.day} className={`text-right font-bold ${day.profit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    ${day.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                ))}
                <td className={`text-right font-black text-lg ${isProfit ? 'text-blue-800' : 'text-red-800'}`}>
                  {formatted.weeklyProfit}
                </td>
              </tr>
              {/* Margin row */}
              <tr>
                <td className="text-gray-500 text-xs">Margin</td>
                {formatted.dailyData.map(day => (
                  <td key={day.day} className="text-right text-xs text-gray-500">
                    {day.margin.toFixed(1)}%
                  </td>
                ))}
                <td className="text-right text-xs font-medium text-gray-600">
                  {formatted.weeklyMargin}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
