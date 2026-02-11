import { useMemo } from 'react'
import { SpaInputs, FinancialCalculations } from './types'
import { calculateFinancials } from './calculations'

// Custom hook for financial calculations with memoization
export const useFinancialCalculations = (inputs: SpaInputs): FinancialCalculations => {
  return useMemo(() => {
    return calculateFinancials(inputs)
  }, [inputs])
}

// Hook for formatting and displaying calculations
export const useFormattedCalculations = (calculations: FinancialCalculations) => {
  return useMemo(() => {
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }

    const formatPercentage = (percentage: number, decimals: number = 1): string => {
      return `${percentage.toFixed(decimals)}%`
    }

    return {
      // Weekly KPIs
      weeklyRevenue: formatCurrency(calculations.profit.weekly.revenue),
      weeklyCosts: formatCurrency(calculations.profit.weekly.costs),
      weeklyProfit: formatCurrency(calculations.profit.weekly.profit),
      weeklyMargin: formatPercentage(calculations.profit.weekly.margin),
      
      // Revenue breakdown
      revenueBreakdown: {
        treatment: formatCurrency(calculations.revenue.totals.treatment),
        thermal: formatCurrency(calculations.revenue.totals.thermal),
        retail: formatCurrency(calculations.revenue.totals.retail),
        total: formatCurrency(calculations.revenue.totals.total)
      },
      
      // Cost breakdown
      costBreakdown: {
        fixed: formatCurrency(calculations.costs.totals.fixed),
        variable: formatCurrency(calculations.costs.totals.variable),
        labor: formatCurrency(calculations.costs.totals.labor),
        total: formatCurrency(calculations.costs.totals.total)
      },
      
      // Detailed cost breakdown
      detailedCosts: {
        rent: formatCurrency(calculations.costs.breakdown.rent),
        management: formatCurrency(calculations.costs.breakdown.management),
        overhead: formatCurrency(calculations.costs.breakdown.overhead),
        backBar: formatCurrency(calculations.costs.breakdown.backBar),
        amenities: formatCurrency(calculations.costs.breakdown.amenities),
        retailCOGS: formatCurrency(calculations.costs.breakdown.retailCOGS),
        treatmentLabor: formatCurrency(calculations.costs.breakdown.treatmentLabor),
        attendantLabor: formatCurrency(calculations.costs.breakdown.attendantLabor),
        receptionistLabor: formatCurrency(calculations.costs.breakdown.receptionistLabor),
        supervisorLabor: formatCurrency(calculations.costs.breakdown.supervisorLabor)
      },
      
      // Capacity metrics
      capacity: {
        dailyTreatmentCapacity: calculations.capacity.dailyTreatmentCapacity.toString(),
        weeklyTreatmentCapacity: calculations.capacity.weeklyTreatmentCapacity.toString(),
        dailyThermalCapacity: calculations.capacity.dailyThermalCapacity.toString(),
        weeklyThermalCapacity: calculations.capacity.weeklyThermalCapacity.toString()
      },
      
      // Daily data for charts
      dailyData: calculations.revenue.daily.map((day, index) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
        treatmentRevenue: day.treatment,
        thermalRevenue: day.thermal,
        retailRevenue: day.retail,
        totalRevenue: day.total,
        totalCosts: calculations.costs.daily[index].total,
        profit: calculations.profit.daily[index].profit,
        margin: calculations.profit.daily[index].margin,
        treatmentCount: calculations.utilization.treatmentCount[index],
        thermalCount: calculations.utilization.thermalCount[index]
      })),
      
      // Chart data for revenue pie chart
      revenueChartData: [
        {
          name: 'Treatments',
          value: calculations.revenue.totals.treatment,
          color: '#3b82f6'
        },
        {
          name: 'Thermal Circuit',
          value: calculations.revenue.totals.thermal,
          color: '#06b6d4'
        },
        {
          name: 'Retail',
          value: calculations.revenue.totals.retail,
          color: '#8b5cf6'
        }
      ],
      
      // Chart data for cost breakdown
      costChartData: [
        {
          name: 'Fixed Costs',
          value: calculations.costs.totals.fixed,
          color: '#f59e0b'
        },
        {
          name: 'Variable Costs',
          value: calculations.costs.totals.variable,
          color: '#ef4444'
        },
        {
          name: 'Labor Costs',
          value: calculations.costs.totals.labor,
          color: '#10b981'
        }
      ],
      
      // Labor breakdown chart data
      laborChartData: [
        {
          name: 'Treatment Contractors',
          value: calculations.costs.breakdown.treatmentLabor,
          color: '#10b981'
        },
        {
          name: 'Attendants',
          value: calculations.costs.breakdown.attendantLabor,
          color: '#22c55e'
        },
        {
          name: 'Receptionists',
          value: calculations.costs.breakdown.receptionistLabor,
          color: '#16a34a'
        },
        {
          name: 'Supervisors',
          value: calculations.costs.breakdown.supervisorLabor,
          color: '#059669'
        }
      ],
      
      // Utilization metrics
      utilizationMetrics: {
        avgTreatmentUtilization: (calculations.utilization.treatmentCount.reduce((sum, count) => 
          sum + (count / calculations.capacity.dailyTreatmentCapacity * 100), 0) / 7).toFixed(1),
        avgThermalUtilization: (calculations.utilization.thermalCount.reduce((sum, count) => 
          sum + (count / calculations.capacity.dailyThermalCapacity * 100), 0) / 7).toFixed(1),
        weeklyTreatmentCount: calculations.utilization.treatmentCount.reduce((sum, count) => sum + count, 0),
        weeklyThermalCount: calculations.utilization.thermalCount.reduce((sum, count) => sum + count, 0)
      }
    }
  }, [calculations])
}
