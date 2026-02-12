import * as XLSX from 'xlsx'
import { FinancialCalculations, SpaInputs } from './types'
import { DAYS_OF_WEEK } from './localStorage'
import { calculateTieredRent } from './calculations'

export const exportRevenueToExcel = (calculations: FinancialCalculations, inputs: SpaInputs) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new()
  
  // Calculate annual revenue
  const annualRevenue = calculations.revenue.totals.total * 52

  // Sheet 1: Executive Summary
  const summaryData = [
    ['═══════════════════════════════════════════════════════════════'],
    ['                  REVENUE SIMULATION REPORT                    '],
    ['═══════════════════════════════════════════════════════════════'],
    ['Generated:', new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                      REVENUE SUMMARY                          '],
    ['───────────────────────────────────────────────────────────────'],
    [''],
    ['Category', 'Weekly Amount', 'Annual Amount', '% of Total'],
    ['Total Revenue', calculations.revenue.totals.total, annualRevenue, '100.0%'],
    [''],
    ['Revenue Breakdown:'],
    ['  Treatment Revenue', calculations.revenue.totals.treatment, calculations.revenue.totals.treatment * 52, `${((calculations.revenue.totals.treatment / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Thermal Revenue', calculations.revenue.totals.thermal, calculations.revenue.totals.thermal * 52, `${((calculations.revenue.totals.thermal / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Retail Revenue', calculations.revenue.totals.retail, calculations.revenue.totals.retail * 52, `${((calculations.revenue.totals.retail / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                   CAPACITY METRICS                            '],
    ['───────────────────────────────────────────────────────────────'],
    [''],
    ['Treatment Capacity'],
    ['  Daily Capacity', calculations.capacity.dailyTreatmentCapacity, 'treatments'],
    ['  Weekly Capacity', calculations.capacity.weeklyTreatmentCapacity, 'treatments'],
    ['  Avg Utilization', `${(inputs.treatment.utilization.reduce((s, u) => s + u, 0) / 7).toFixed(1)}%`],
    ['  Weekly Treatments', calculations.utilization.treatmentCount.reduce((s, c) => s + c, 0)],
    [''],
    ['Thermal Capacity'],
    ['  Daily Capacity', calculations.capacity.dailyThermalCapacity, 'visits'],
    ['  Weekly Capacity', calculations.capacity.weeklyThermalCapacity, 'visits'],
    ['  Avg Utilization', `${(inputs.thermal.utilization.reduce((s, u) => s + u, 0) / 7).toFixed(1)}%`],
    ['  Weekly Visits', calculations.utilization.thermalCount.reduce((s, c) => s + c, 0)],
  ]

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
  summaryWS['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Executive Summary')

  // Sheet 2: Daily Revenue Analysis
  const dailyRevenueData = [
    ['═══════════════════════════════════════════════════════════════════════════════════════'],
    ['                              DAILY REVENUE ANALYSIS                                    '],
    ['═══════════════════════════════════════════════════════════════════════════════════════'],
    [''],
    ['Day', 'Treatments', 'Treatment $', 'Thermal Visits', 'Thermal $', 'Retail $', 'Total Revenue', '% of Week'],
    ...calculations.revenue.daily.map((day, index) => [
      DAYS_OF_WEEK[index],
      calculations.utilization.treatmentCount[index],
      day.treatment,
      calculations.utilization.thermalCount[index],
      day.thermal,
      day.retail,
      day.total,
      `${((day.total / calculations.revenue.totals.total) * 100).toFixed(1)}%`
    ]),
    [''],
    ['WEEKLY TOTAL', 
     calculations.utilization.treatmentCount.reduce((sum, count) => sum + count, 0),
     calculations.revenue.totals.treatment,
     calculations.utilization.thermalCount.reduce((sum, count) => sum + count, 0),
     calculations.revenue.totals.thermal,
     calculations.revenue.totals.retail,
     calculations.revenue.totals.total,
     '100.0%'
    ]
  ]

  const dailyRevenueWS = XLSX.utils.aoa_to_sheet(dailyRevenueData)
  dailyRevenueWS['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 10 }]
  XLSX.utils.book_append_sheet(wb, dailyRevenueWS, 'Daily Revenue')

  // Sheet 3: Treatment Configuration
  const treatmentConfigData = [
    ['═══════════════════════════════════════════════════════════════'],
    ['                   TREATMENT CONFIGURATION                      '],
    ['═══════════════════════════════════════════════════════════════'],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                     CAPACITY SETTINGS                          '],
    ['───────────────────────────────────────────────────────────────'],
    ['Total Treatment Beds', inputs.treatment.capacity.totalBeds],
    ['Operating Hours per Day', inputs.treatment.capacity.operatingHours],
    ['Treatment Duration (min)', inputs.treatment.capacity.treatmentDuration],
    ['Cleaning Time (min)', inputs.treatment.capacity.cleaningTime],
    ['Stagger Interval (min)', inputs.treatment.capacity.staggerInterval],
    [''],
    ['Calculated Daily Capacity', calculations.capacity.dailyTreatmentCapacity, 'treatments'],
    ['Calculated Weekly Capacity', calculations.capacity.weeklyTreatmentCapacity, 'treatments'],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                     PRICING & GUEST MIX                        '],
    ['───────────────────────────────────────────────────────────────'],
    ['Hotel Guest Percentage', `${inputs.treatment.hotelGuestPercentage}%`],
    [''],
    ['Average Hotel Price', inputs.treatment.hotelPrices.reduce((sum, p) => sum + p, 0) / 7],
    ['Average Non-Hotel Price', inputs.treatment.nonHotelPrices.reduce((sum, p) => sum + p, 0) / 7],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                   DAILY UTILIZATION & PRICING                  '],
    ['───────────────────────────────────────────────────────────────'],
    ['Day', 'Utilization %', 'Hotel Price', 'Non-Hotel Price', 'Treatments'],
    ...DAYS_OF_WEEK.map((day, index) => [
      day,
      `${inputs.treatment.utilization[index]}%`,
      inputs.treatment.hotelPrices[index],
      inputs.treatment.nonHotelPrices[index],
      calculations.utilization.treatmentCount[index]
    ]),
  ]

  const treatmentConfigWS = XLSX.utils.aoa_to_sheet(treatmentConfigData)
  treatmentConfigWS['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(wb, treatmentConfigWS, 'Treatment Config')

  // Sheet 4: Thermal Configuration
  const thermalConfigData = [
    ['═══════════════════════════════════════════════════════════════'],
    ['                    THERMAL CONFIGURATION                       '],
    ['═══════════════════════════════════════════════════════════════'],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                     CAPACITY SETTINGS                          '],
    ['───────────────────────────────────────────────────────────────'],
    ['Max Concurrent Capacity', inputs.thermal.maxCapacity, 'guests'],
    ['Operating Hours per Day', inputs.thermal.operatingHours],
    ['Session Duration (hours)', inputs.thermal.sessionDuration],
    [''],
    ['Calculated Daily Capacity', calculations.capacity.dailyThermalCapacity, 'visits'],
    ['Calculated Weekly Capacity', calculations.capacity.weeklyThermalCapacity, 'visits'],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                     PRICING & GUEST MIX                        '],
    ['───────────────────────────────────────────────────────────────'],
    ['Hotel Guest Percentage', `${inputs.thermal.hotelGuestPercentage}%`],
    ['Hotel Combo Discount', inputs.thermal.hotelComboDiscount],
    ['Non-Hotel Combo Discount', inputs.thermal.nonHotelComboDiscount],
    [''],
    ['Average Hotel Price', inputs.thermal.hotelPrices.reduce((sum, p) => sum + p, 0) / 7],
    ['Average Non-Hotel Price', inputs.thermal.nonHotelPrices.reduce((sum, p) => sum + p, 0) / 7],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                   DAILY UTILIZATION & PRICING                  '],
    ['───────────────────────────────────────────────────────────────'],
    ['Day', 'Utilization %', 'Hotel Price', 'Non-Hotel Price', 'Combo %', 'Visits'],
    ...DAYS_OF_WEEK.map((day, index) => [
      day,
      `${inputs.thermal.utilization[index]}%`,
      inputs.thermal.hotelPrices[index],
      inputs.thermal.nonHotelPrices[index],
      `${inputs.thermal.comboPercentages[index]}%`,
      calculations.utilization.thermalCount[index]
    ]),
  ]

  const thermalConfigWS = XLSX.utils.aoa_to_sheet(thermalConfigData)
  thermalConfigWS['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 10 }, { wch: 10 }]
  XLSX.utils.book_append_sheet(wb, thermalConfigWS, 'Thermal Config')

  // Sheet 5: Retail Configuration
  const retailConfigData = [
    ['═══════════════════════════════════════════════════════════════'],
    ['                     RETAIL CONFIGURATION                       '],
    ['═══════════════════════════════════════════════════════════════'],
    [''],
    ['Revenue Percentage (of Treatment + Thermal)', `${inputs.retail.revenuePercentage}%`],
    [''],
    ['───────────────────────────────────────────────────────────────'],
    ['                     CALCULATED REVENUE                         '],
    ['───────────────────────────────────────────────────────────────'],
    ['Base Revenue (Treatment + Thermal)', calculations.revenue.totals.treatment + calculations.revenue.totals.thermal],
    ['Weekly Retail Revenue', calculations.revenue.totals.retail],
    ['Annual Retail Revenue', calculations.revenue.totals.retail * 52],
  ]

  const retailConfigWS = XLSX.utils.aoa_to_sheet(retailConfigData)
  retailConfigWS['!cols'] = [{ wch: 45 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, retailConfigWS, 'Retail Config')

  // Download the file
  XLSX.writeFile(wb, `Aires_Revenue_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export const exportFinancialToExcel = (calculations: FinancialCalculations, inputs: SpaInputs) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new()
  
  // Calculate annual figures
  const annualRevenue = calculations.revenue.totals.total * 52
  const annualCosts = calculations.costs.totals.total * 52
  const annualProfit = calculations.profit.weekly.profit * 52
  const tieredRent = calculateTieredRent(annualRevenue, inputs.costs.rentTiers)
  const annualRent = Math.max(tieredRent, inputs.costs.baseRent ?? 0)
  const effectiveRentRate = (annualRent / annualRevenue) * 100

  // Sheet 1: Executive Summary
  const summaryData = [
    ['═══════════════════════════════════════════════════════════════════════════'],
    ['                     FINANCIAL SIMULATION REPORT                            '],
    ['═══════════════════════════════════════════════════════════════════════════'],
    ['Generated:', new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                         EXECUTIVE SUMMARY                                  '],
    ['───────────────────────────────────────────────────────────────────────────'],
    [''],
    ['Key Metric', 'Weekly', 'Annual', '% of Revenue'],
    ['Total Revenue', calculations.revenue.totals.total, annualRevenue, '100.0%'],
    ['Total Costs', calculations.costs.totals.total, annualCosts, `${((calculations.costs.totals.total / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['Net Profit', calculations.profit.weekly.profit, annualProfit, `${calculations.profit.weekly.margin.toFixed(1)}%`],
    [''],
    ['Profit Margin', `${calculations.profit.weekly.margin.toFixed(1)}%`, '', 'Target: 20%+'],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                         REVENUE BREAKDOWN                                  '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Revenue Stream', 'Weekly', 'Annual', '% of Total'],
    ['Treatment Revenue', calculations.revenue.totals.treatment, calculations.revenue.totals.treatment * 52, `${((calculations.revenue.totals.treatment / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['Thermal Revenue', calculations.revenue.totals.thermal, calculations.revenue.totals.thermal * 52, `${((calculations.revenue.totals.thermal / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['Retail Revenue', calculations.revenue.totals.retail, calculations.revenue.totals.retail * 52, `${((calculations.revenue.totals.retail / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
  ]

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
  summaryWS['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Executive Summary')

  // Sheet 2: Detailed Cost Breakdown
  const costBreakdownData = [
    ['═══════════════════════════════════════════════════════════════════════════'],
    ['                        DETAILED COST BREAKDOWN                             '],
    ['═══════════════════════════════════════════════════════════════════════════'],
    [''],
    ['Cost Category', 'Weekly', 'Annual', '% of Revenue'],
    [''],
    ['TOTAL COSTS', calculations.costs.totals.total, annualCosts, `${((calculations.costs.totals.total / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                           FIXED COSTS                                      '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Fixed Costs Subtotal', calculations.costs.totals.fixed, calculations.costs.totals.fixed * 52, `${((calculations.costs.totals.fixed / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    [''],
    ['  Rent (Tiered)', calculations.costs.breakdown.rent, calculations.costs.breakdown.rent * 52, `${((calculations.costs.breakdown.rent / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Management Salary', calculations.costs.breakdown.management, calculations.costs.breakdown.management * 52, `${((calculations.costs.breakdown.management / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Overhead', calculations.costs.breakdown.overhead, calculations.costs.breakdown.overhead * 52, `${((calculations.costs.breakdown.overhead / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                          VARIABLE COSTS                                    '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Variable Costs Subtotal', calculations.costs.totals.variable, calculations.costs.totals.variable * 52, `${((calculations.costs.totals.variable / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    [''],
    ['  Back Bar (per treatment)', calculations.costs.breakdown.backBar, calculations.costs.breakdown.backBar * 52, `${((calculations.costs.breakdown.backBar / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Amenities (per guest)', calculations.costs.breakdown.amenities, calculations.costs.breakdown.amenities * 52, `${((calculations.costs.breakdown.amenities / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Retail COGS', calculations.costs.breakdown.retailCOGS, calculations.costs.breakdown.retailCOGS * 52, `${((calculations.costs.breakdown.retailCOGS / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Treatment Labor', calculations.costs.breakdown.treatmentLabor, calculations.costs.breakdown.treatmentLabor * 52, `${((calculations.costs.breakdown.treatmentLabor / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                           LABOR COSTS                                      '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Labor Costs Subtotal', calculations.costs.totals.labor, calculations.costs.totals.labor * 52, `${((calculations.costs.totals.labor / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    [''],
    ['  Attendants', calculations.costs.breakdown.attendantLabor, calculations.costs.breakdown.attendantLabor * 52, `${((calculations.costs.breakdown.attendantLabor / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Receptionists', calculations.costs.breakdown.receptionistLabor, calculations.costs.breakdown.receptionistLabor * 52, `${((calculations.costs.breakdown.receptionistLabor / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
    ['  Supervisors', calculations.costs.breakdown.supervisorLabor, calculations.costs.breakdown.supervisorLabor * 52, `${((calculations.costs.breakdown.supervisorLabor / calculations.revenue.totals.total) * 100).toFixed(1)}%`],
  ]

  const costBreakdownWS = XLSX.utils.aoa_to_sheet(costBreakdownData)
  costBreakdownWS['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, costBreakdownWS, 'Cost Breakdown')

  // Sheet 3: Tiered Rent Structure
  const rentData = [
    ['═══════════════════════════════════════════════════════════════════════════'],
    ['                        TIERED RENT STRUCTURE                               '],
    ['═══════════════════════════════════════════════════════════════════════════'],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                         RENT SUMMARY                                       '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Annual Revenue', annualRevenue],
    ['Annual Rent (Calculated)', annualRent],
    ['Weekly Rent', calculations.costs.breakdown.rent],
    ['Effective Rent Rate', `${effectiveRentRate.toFixed(2)}%`],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                         RENT TIERS                                         '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Tier', 'Min Revenue', 'Max Revenue', 'Rate', 'Status'],
    ...inputs.costs.rentTiers.map((tier, index) => {
      const isActive = annualRevenue >= tier.minRevenue && 
        (tier.maxRevenue === null || annualRevenue <= tier.maxRevenue)
      return [
        `Tier ${index + 1}`,
        tier.minRevenue,
        tier.maxRevenue ?? 'Unlimited',
        `${tier.percentage}%`,
        isActive ? 'ACTIVE' : ''
      ]
    }),
    [''],
    ['Note: Each tier\'s percentage applies only to revenue within that tier\'s range (progressive)'],
  ]

  const rentWS = XLSX.utils.aoa_to_sheet(rentData)
  rentWS['!cols'] = [{ wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(wb, rentWS, 'Tiered Rent')

  // Sheet 4: Daily Financial Breakdown
  const dailyFinancialData = [
    ['═══════════════════════════════════════════════════════════════════════════════════════'],
    ['                            DAILY FINANCIAL BREAKDOWN                                   '],
    ['═══════════════════════════════════════════════════════════════════════════════════════'],
    [''],
    ['Day', 'Revenue', 'Costs', 'Profit', 'Margin %', 'Treatments', 'Thermal Visits'],
    ...calculations.profit.daily.map((day, index) => [
      DAYS_OF_WEEK[index],
      day.revenue,
      day.costs,
      day.profit,
      `${day.margin.toFixed(1)}%`,
      calculations.utilization.treatmentCount[index],
      calculations.utilization.thermalCount[index]
    ]),
    [''],
    ['WEEKLY TOTAL',
     calculations.profit.weekly.revenue,
     calculations.profit.weekly.costs,
     calculations.profit.weekly.profit,
     `${calculations.profit.weekly.margin.toFixed(1)}%`,
     calculations.utilization.treatmentCount.reduce((sum, count) => sum + count, 0),
     calculations.utilization.thermalCount.reduce((sum, count) => sum + count, 0)
    ]
  ]

  const dailyFinancialWS = XLSX.utils.aoa_to_sheet(dailyFinancialData)
  dailyFinancialWS['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 14 }]
  XLSX.utils.book_append_sheet(wb, dailyFinancialWS, 'Daily Financial')

  // Sheet 5: Complete Model Configuration
  const configData = [
    ['═══════════════════════════════════════════════════════════════════════════'],
    ['                      COMPLETE MODEL CONFIGURATION                          '],
    ['═══════════════════════════════════════════════════════════════════════════'],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                     TREATMENT CONFIGURATION                                '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Total Beds', inputs.treatment.capacity.totalBeds],
    ['Operating Hours', inputs.treatment.capacity.operatingHours, 'hours/day'],
    ['Treatment Duration', inputs.treatment.capacity.treatmentDuration, 'minutes'],
    ['Cleaning Time', inputs.treatment.capacity.cleaningTime, 'minutes'],
    ['Stagger Interval', inputs.treatment.capacity.staggerInterval, 'minutes'],
    ['Daily Capacity', calculations.capacity.dailyTreatmentCapacity, 'treatments'],
    ['Hotel Guest %', `${inputs.treatment.hotelGuestPercentage}%`],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                      THERMAL CONFIGURATION                                 '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Max Capacity', inputs.thermal.maxCapacity, 'guests'],
    ['Operating Hours', inputs.thermal.operatingHours, 'hours/day'],
    ['Session Duration', inputs.thermal.sessionDuration, 'hours'],
    ['Daily Capacity', calculations.capacity.dailyThermalCapacity, 'visits'],
    ['Hotel Guest %', `${inputs.thermal.hotelGuestPercentage}%`],
    ['Hotel Combo Discount', inputs.thermal.hotelComboDiscount],
    ['Non-Hotel Combo Discount', inputs.thermal.nonHotelComboDiscount],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                       RETAIL CONFIGURATION                                 '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Revenue %', `${inputs.retail.revenuePercentage}%`, '(of Treatment + Thermal)'],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                        COST CONFIGURATION                                  '],
    ['───────────────────────────────────────────────────────────────────────────'],
    [''],
    ['Fixed Costs:'],
    ['  Management Salary', inputs.costs.annualManagementSalary, '/year'],
    ['  Weekly Overhead', inputs.costs.weeklyOverhead, '/week'],
    [''],
    ['Variable Costs:'],
    ['  Back Bar Cost', inputs.costs.backBarCostPerTreatment, '/treatment'],
    ['  Amenity Cost', inputs.costs.amenityCostPerGuest, '/guest'],
    ['  Treatment Labor', inputs.costs.treatmentLaborCost, '/treatment'],
    ['  Retail COGS', `${inputs.costs.retailCOGSPercentage}%`, 'of retail revenue'],
    [''],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['                        LABOR CONFIGURATION                                 '],
    ['───────────────────────────────────────────────────────────────────────────'],
    ['Shift Length', inputs.costs.attendants.hoursPerShift, 'hours'],
    [''],
    ['Attendants:'],
    ['  Hourly Rate', inputs.costs.attendants.hourlyRate],
    ['  Daily Staffing', inputs.costs.attendants.dailyCount.join(', '), '(Mon-Sun)'],
    ['  Avg per Day', (inputs.costs.attendants.dailyCount.reduce((s, c) => s + c, 0) / 7).toFixed(1)],
    [''],
    ['Receptionists:'],
    ['  Hourly Rate', inputs.costs.receptionists.hourlyRate],
    ['  Daily Staffing', inputs.costs.receptionists.dailyCount.join(', '), '(Mon-Sun)'],
    ['  Avg per Day', (inputs.costs.receptionists.dailyCount.reduce((s, c) => s + c, 0) / 7).toFixed(1)],
    [''],
    ['Supervisors:'],
    ['  Hourly Rate', inputs.costs.supervisors.hourlyRate],
    ['  Daily Staffing', inputs.costs.supervisors.dailyCount.join(', '), '(Mon-Sun)'],
    ['  Avg per Day', (inputs.costs.supervisors.dailyCount.reduce((s, c) => s + c, 0) / 7).toFixed(1)],
  ]

  const configWS = XLSX.utils.aoa_to_sheet(configData)
  configWS['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 25 }]
  XLSX.utils.book_append_sheet(wb, configWS, 'Model Configuration')

  // Sheet 6: Daily Utilization & Pricing
  const utilizationData = [
    ['═══════════════════════════════════════════════════════════════════════════════════════════════════════'],
    ['                                    DAILY UTILIZATION & PRICING                                         '],
    ['═══════════════════════════════════════════════════════════════════════════════════════════════════════'],
    [''],
    ['Day', 'Treat Util %', 'Treat Hotel $', 'Treat Non-Hotel $', 'Therm Util %', 'Therm Hotel $', 'Therm Non-Hotel $', 'Combo %'],
    ...DAYS_OF_WEEK.map((day, index) => [
      day,
      `${inputs.treatment.utilization[index]}%`,
      inputs.treatment.hotelPrices[index],
      inputs.treatment.nonHotelPrices[index],
      `${inputs.thermal.utilization[index]}%`,
      inputs.thermal.hotelPrices[index],
      inputs.thermal.nonHotelPrices[index],
      `${inputs.thermal.comboPercentages[index]}%`
    ]),
    [''],
    ['AVERAGES',
      `${(inputs.treatment.utilization.reduce((s, u) => s + u, 0) / 7).toFixed(1)}%`,
      (inputs.treatment.hotelPrices.reduce((s, p) => s + p, 0) / 7).toFixed(2),
      (inputs.treatment.nonHotelPrices.reduce((s, p) => s + p, 0) / 7).toFixed(2),
      `${(inputs.thermal.utilization.reduce((s, u) => s + u, 0) / 7).toFixed(1)}%`,
      (inputs.thermal.hotelPrices.reduce((s, p) => s + p, 0) / 7).toFixed(2),
      (inputs.thermal.nonHotelPrices.reduce((s, p) => s + p, 0) / 7).toFixed(2),
      `${(inputs.thermal.comboPercentages.reduce((s, c) => s + c, 0) / 7).toFixed(1)}%`
    ]
  ]

  const utilizationWS = XLSX.utils.aoa_to_sheet(utilizationData)
  utilizationWS['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 18 }, { wch: 10 }]
  XLSX.utils.book_append_sheet(wb, utilizationWS, 'Utilization & Pricing')

  // Download the file
  XLSX.writeFile(wb, `Aires_Financial_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
}
