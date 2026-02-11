import {
  SpaInputs,
  FinancialCalculations,
  WeeklyRevenue,
  WeeklyCosts,
  DailyRevenue,
  DailyCosts,
  DailyProfit,
  RentTier
} from './types'

// Calculate daily treatment capacity based on spa configuration
// Formula: (total operating hours × beds) / treatment length (including cleaning)
// Staggering and partial treatments at end of day do not count
export const calculateTreatmentCapacity = (inputs: SpaInputs): number => {
  const { totalBeds, operatingHours, treatmentDuration, cleaningTime } = inputs.treatment.capacity
  
  // Convert operating hours to minutes
  const operatingMinutes = operatingHours * 60
  
  // Each treatment cycle = treatment duration + cleaning time
  const treatmentCycle = treatmentDuration + cleaningTime
  
  // Calculate number of complete treatments per bed
  // Floor ensures we don't count partial treatments at end of day
  const treatmentsPerBed = Math.floor(operatingMinutes / treatmentCycle)
  
  // Total daily capacity = beds × treatments per bed
  return totalBeds * treatmentsPerBed
}

// Calculate daily thermal circuit capacity
export const calculateThermalCapacity = (inputs: SpaInputs): number => {
  const { maxCapacity, operatingHours, sessionDuration } = inputs.thermal
  
  // Number of sessions per day = operating hours / session duration
  const sessionsPerDay = operatingHours / sessionDuration
  
  // Total daily capacity = max capacity × sessions per day
  return Math.floor(maxCapacity * sessionsPerDay)
}

// Calculate treatment revenue for a specific day
export const calculateDailyTreatmentRevenue = (
  inputs: SpaInputs, 
  dayIndex: number, 
  dailyCapacity: number
): number => {
  const { utilization, hotelPrices, nonHotelPrices, hotelGuestPercentage } = inputs.treatment
  
  // Calculate actual treatments for this day
  const actualTreatments = Math.floor(dailyCapacity * (utilization[dayIndex] / 100))
  
  // Split between hotel and non-hotel guests
  const hotelTreatments = Math.floor(actualTreatments * (hotelGuestPercentage / 100))
  const nonHotelTreatments = actualTreatments - hotelTreatments
  
  // Calculate revenue
  const hotelRevenue = hotelTreatments * hotelPrices[dayIndex]
  const nonHotelRevenue = nonHotelTreatments * nonHotelPrices[dayIndex]
  
  return hotelRevenue + nonHotelRevenue
}

// Calculate thermal circuit revenue for a specific day
export const calculateDailyThermalRevenue = (
  inputs: SpaInputs,
  dayIndex: number,
  dailyCapacity: number
): number => {
  const {
    utilization,
    hotelPrices,
    nonHotelPrices,
    hotelGuestPercentage,
    hotelComboDiscount,
    nonHotelComboDiscount,
    comboPercentages
  } = inputs.thermal
  
  // Calculate actual thermal visits for this day
  const actualVisits = Math.floor(dailyCapacity * (utilization[dayIndex] / 100))
  
  // Split between hotel and non-hotel guests
  const hotelVisits = Math.floor(actualVisits * (hotelGuestPercentage / 100))
  const nonHotelVisits = actualVisits - hotelVisits
  
  // Calculate base revenue
  const hotelRevenue = hotelVisits * hotelPrices[dayIndex]
  const nonHotelRevenue = nonHotelVisits * nonHotelPrices[dayIndex]
  const baseRevenue = hotelRevenue + nonHotelRevenue
  
  // Apply combo discounts separately for hotel and non-hotel guests
  const comboVisits = Math.floor(actualVisits * (comboPercentages[dayIndex] / 100))
  const hotelComboVisits = Math.floor(comboVisits * (hotelGuestPercentage / 100))
  const nonHotelComboVisits = comboVisits - hotelComboVisits
  
  const hotelDiscountApplied = hotelComboVisits * hotelComboDiscount
  const nonHotelDiscountApplied = nonHotelComboVisits * nonHotelComboDiscount
  const totalDiscountApplied = hotelDiscountApplied + nonHotelDiscountApplied
  
  return Math.max(0, baseRevenue - totalDiscountApplied)
}

// Calculate tiered rent based on annual revenue
// Each tier's percentage applies only to revenue within that tier's range (progressive)
export const calculateTieredRent = (annualRevenue: number, rentTiers: RentTier[]): number => {
  // Sort tiers by minRevenue to ensure proper order
  const sortedTiers = [...rentTiers].sort((a, b) => a.minRevenue - b.minRevenue)
  
  let totalRent = 0
  let remainingRevenue = annualRevenue
  
  for (let i = 0; i < sortedTiers.length; i++) {
    const tier = sortedTiers[i]
    const tierMin = tier.minRevenue
    const tierMax = tier.maxRevenue ?? Infinity
    
    // Skip if we haven't reached this tier yet
    if (remainingRevenue <= 0) break
    
    // Calculate the revenue that falls within this tier
    // For the first tier (minRevenue = 0), the bracket size is tierMax
    // For subsequent tiers, the bracket size is tierMax - tierMin
    const tierStart = tierMin
    const tierEnd = tierMax
    
    // Calculate how much revenue is taxable in this tier
    let revenueInTier: number
    
    if (i === 0) {
      // First tier: tax from 0 to min(annualRevenue, tierMax)
      revenueInTier = Math.min(annualRevenue, tierEnd)
    } else {
      // Subsequent tiers: tax only the portion above tierMin up to tierMax
      const previousTierMax = sortedTiers[i - 1].maxRevenue ?? 0
      if (annualRevenue <= tierStart) {
        revenueInTier = 0
      } else {
        revenueInTier = Math.min(annualRevenue - tierStart, tierEnd - tierStart)
      }
    }
    
    // Add rent for this tier
    if (revenueInTier > 0) {
      totalRent += revenueInTier * (tier.percentage / 100)
    }
  }
  
  return totalRent
}

// Calculate weekly revenue breakdown
export const calculateWeeklyRevenue = (inputs: SpaInputs): WeeklyRevenue => {
  const dailyTreatmentCapacity = calculateTreatmentCapacity(inputs)
  const dailyThermalCapacity = calculateThermalCapacity(inputs)
  
  const daily: DailyRevenue[] = []
  let totalTreatment = 0
  let totalThermal = 0
  
  // Calculate for each day of the week
  for (let day = 0; day < 7; day++) {
    const treatmentRevenue = calculateDailyTreatmentRevenue(inputs, day, dailyTreatmentCapacity)
    const thermalRevenue = calculateDailyThermalRevenue(inputs, day, dailyThermalCapacity)
    
    totalTreatment += treatmentRevenue
    totalThermal += thermalRevenue
    
    daily.push({
      treatment: treatmentRevenue,
      thermal: thermalRevenue,
      retail: 0, // Will be calculated after we have treatment + thermal totals
      total: 0   // Will be calculated after retail
    })
  }
  
  // Calculate retail revenue as percentage of treatment + thermal
  const retailRevenue = (totalTreatment + totalThermal) * (inputs.retail.revenuePercentage / 100)
  const dailyRetailRevenue = retailRevenue / 7 // Distribute evenly across days
  
  // Update daily retail and totals
  daily.forEach(day => {
    day.retail = dailyRetailRevenue
    day.total = day.treatment + day.thermal + day.retail
  })
  
  return {
    daily,
    totals: {
      treatment: totalTreatment,
      thermal: totalThermal,
      retail: retailRevenue,
      total: totalTreatment + totalThermal + retailRevenue
    }
  }
}

// Calculate daily costs
export const calculateDailyCosts = (
  inputs: SpaInputs,
  dayIndex: number,
  totalWeeklyRevenue: number,
  dailyTreatmentCount: number,
  dailyThermalCount: number,
  dailyRetailRevenue: number
): DailyCosts => {
  const { costs } = inputs
  
  // Fixed costs (distributed daily)
  // Calculate annual revenue from weekly revenue for tiered rent calculation
  const annualRevenue = totalWeeklyRevenue * 52
  const annualRent = calculateTieredRent(annualRevenue, costs.rentTiers)
  const dailyRent = annualRent / 52 / 7 // Divide annual rent by weeks and days
  const dailyManagement = (costs.annualManagementSalary / 52) / 7
  const dailyOverhead = costs.weeklyOverhead / 7
  
  // Variable costs
  const dailyBackBar = dailyTreatmentCount * costs.backBarCostPerTreatment
  const dailyAmenities = (dailyTreatmentCount + dailyThermalCount) * costs.amenityCostPerGuest
  const dailyRetailCOGS = dailyRetailRevenue * (costs.retailCOGSPercentage / 100)
  const dailyTreatmentLabor = dailyTreatmentCount * costs.treatmentLaborCost
  
  // Labor costs
  const dailyAttendantLabor = costs.attendants.dailyCount[dayIndex] * 
    costs.attendants.hourlyRate * costs.attendants.hoursPerShift
  const dailyReceptionistLabor = costs.receptionists.dailyCount[dayIndex] * 
    costs.receptionists.hourlyRate * costs.receptionists.hoursPerShift
  const dailySupervisorLabor = costs.supervisors.dailyCount[dayIndex] * 
    costs.supervisors.hourlyRate * costs.supervisors.hoursPerShift
  
  const totalDailyCosts = dailyRent + dailyManagement + dailyBackBar + dailyAmenities + 
    dailyOverhead + dailyRetailCOGS + dailyTreatmentLabor + dailyAttendantLabor + 
    dailyReceptionistLabor + dailySupervisorLabor
  
  return {
    rent: dailyRent,
    management: dailyManagement,
    backBar: dailyBackBar,
    amenities: dailyAmenities,
    overhead: dailyOverhead,
    retailCOGS: dailyRetailCOGS,
    treatmentLabor: dailyTreatmentLabor,
    attendantLabor: dailyAttendantLabor,
    receptionistLabor: dailyReceptionistLabor,
    supervisorLabor: dailySupervisorLabor,
    total: totalDailyCosts
  }
}

// Calculate weekly costs breakdown
export const calculateWeeklyCosts = (
  inputs: SpaInputs, 
  revenue: WeeklyRevenue,
  treatmentCounts: number[],
  thermalCounts: number[]
): WeeklyCosts => {
  const daily: DailyCosts[] = []
  const breakdown = {
    rent: 0,
    management: 0,
    backBar: 0,
    amenities: 0,
    overhead: 0,
    retailCOGS: 0,
    treatmentLabor: 0,
    attendantLabor: 0,
    receptionistLabor: 0,
    supervisorLabor: 0
  }
  
  // Calculate costs for each day
  for (let day = 0; day < 7; day++) {
    const dayCosts = calculateDailyCosts(
      inputs,
      day,
      revenue.totals.total,
      treatmentCounts[day],
      thermalCounts[day],
      revenue.daily[day].retail
    )
    
    daily.push(dayCosts)
    
    // Add to breakdown totals
    breakdown.rent += dayCosts.rent
    breakdown.management += dayCosts.management
    breakdown.backBar += dayCosts.backBar
    breakdown.amenities += dayCosts.amenities
    breakdown.overhead += dayCosts.overhead
    breakdown.retailCOGS += dayCosts.retailCOGS
    breakdown.treatmentLabor += dayCosts.treatmentLabor
    breakdown.attendantLabor += dayCosts.attendantLabor
    breakdown.receptionistLabor += dayCosts.receptionistLabor
    breakdown.supervisorLabor += dayCosts.supervisorLabor
  }
  
  // Calculate category totals
  const fixedCosts = breakdown.rent + breakdown.management + breakdown.overhead
  const variableCosts = breakdown.backBar + breakdown.amenities + breakdown.retailCOGS + breakdown.treatmentLabor
  const laborCosts = breakdown.attendantLabor + breakdown.receptionistLabor + breakdown.supervisorLabor
  const totalCosts = fixedCosts + variableCosts + laborCosts
  
  return {
    daily,
    totals: {
      fixed: fixedCosts,
      variable: variableCosts,
      labor: laborCosts,
      total: totalCosts
    },
    breakdown
  }
}

// Main calculation function
export const calculateFinancials = (inputs: SpaInputs): FinancialCalculations => {
  // Calculate capacities
  const dailyTreatmentCapacity = calculateTreatmentCapacity(inputs)
  const dailyThermalCapacity = calculateThermalCapacity(inputs)
  
  // Calculate revenue
  const revenue = calculateWeeklyRevenue(inputs)
  
  // Calculate actual treatment and thermal counts for each day
  const treatmentCounts = inputs.treatment.utilization.map(util => 
    Math.floor(dailyTreatmentCapacity * (util / 100))
  )
  const thermalCounts = inputs.thermal.utilization.map(util => 
    Math.floor(dailyThermalCapacity * (util / 100))
  )
  
  // Calculate costs
  const costs = calculateWeeklyCosts(inputs, revenue, treatmentCounts, thermalCounts)
  
  // Calculate daily profit
  const dailyProfit: DailyProfit[] = revenue.daily.map((dayRevenue, index) => {
    const dayCosts = costs.daily[index]
    const profit = dayRevenue.total - dayCosts.total
    const margin = dayRevenue.total > 0 ? (profit / dayRevenue.total) * 100 : 0
    
    return {
      revenue: dayRevenue.total,
      costs: dayCosts.total,
      profit,
      margin
    }
  })
  
  // Calculate weekly profit
  const weeklyProfit = revenue.totals.total - costs.totals.total
  const weeklyMargin = revenue.totals.total > 0 ? (weeklyProfit / revenue.totals.total) * 100 : 0
  
  return {
    revenue,
    costs,
    profit: {
      daily: dailyProfit,
      weekly: {
        revenue: revenue.totals.total,
        costs: costs.totals.total,
        profit: weeklyProfit,
        margin: weeklyMargin
      }
    },
    capacity: {
      dailyTreatmentCapacity,
      weeklyTreatmentCapacity: dailyTreatmentCapacity * 7,
      dailyThermalCapacity,
      weeklyThermalCapacity: dailyThermalCapacity * 7
    },
    utilization: {
      treatmentCount: treatmentCounts,
      thermalCount: thermalCounts
    }
  }
}
