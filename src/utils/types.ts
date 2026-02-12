// Treatment Revenue Types
export interface TreatmentInputs {
  capacity: {
    totalBeds: number
    operatingHours: number
    treatmentDuration: number
    cleaningTime: number
    staggerInterval: number
  }
  utilization: number[] // 7 days, percentage 0-100
  hotelPrices: number[] // 7 days, price per treatment for hotel guests
  nonHotelPrices: number[] // 7 days, price per treatment for non-hotel guests
  hotelGuestPercentage: number // percentage of guests who are hotel guests
}

// Thermal Circuit Types
export interface ThermalInputs {
  maxCapacity: number // number of guests at one time
  operatingHours: number // hours per day (10 hours)
  sessionDuration: number // hours per session (3 hours)
  utilization: number[] // 7 days, percentage 0-100
  hotelPrices: number[] // 7 days, price per thermal visit for hotel guests
  nonHotelPrices: number[] // 7 days, price per thermal visit for non-hotel guests
  hotelGuestPercentage: number // percentage of guests who are hotel guests
  hotelComboDiscount: number // dollar amount discount for hotel guest treatment + thermal combo
  nonHotelComboDiscount: number // dollar amount discount for non-hotel guest treatment + thermal combo
  comboPercentages: number[] // 7 days, percentage of guests using combo discount
}

// Retail Types
export interface RetailInputs {
  revenuePercentage: number // percentage of treatment + thermal revenue
}

// Rent Tier Interface
export interface RentTier {
  minRevenue: number // minimum annual revenue for this tier (inclusive)
  maxRevenue: number | null // maximum annual revenue for this tier (null for unlimited)
  percentage: number // rent percentage for this tier
}

// Cost Types
export interface CostInputs {
  // Fixed Costs
  baseRent: number // minimum annual rent regardless of revenue
  rentTiers: RentTier[] // tiered rent percentages based on annual revenue
  annualManagementSalary: number // annual salary
  weeklyOverhead: number // weekly overhead costs
  
  // Variable Costs
  backBarCostPerTreatment: number // cost per treatment for products/supplies
  amenityCostPerGuest: number // cost per guest for towels, robes, slippers
  retailCOGSPercentage: number // percentage of retail revenue
  treatmentLaborCost: number // labor cost per treatment for contractors
  
  // Labor Costs
  attendants: {
    dailyCount: number[] // 7 days, number of attendants per day
    hourlyRate: number
    hoursPerShift: number // 13.25 hours
  }
  receptionists: {
    dailyCount: number[] // 7 days, number of receptionists per day
    hourlyRate: number
    hoursPerShift: number // 13.25 hours
  }
  supervisors: {
    dailyCount: number[] // 7 days, number of supervisors per day
    hourlyRate: number
    hoursPerShift: number // 13.25 hours
  }
}

// Main Input Interface
export interface SpaInputs {
  treatment: TreatmentInputs
  thermal: ThermalInputs
  retail: RetailInputs
  costs: CostInputs
}

// Calculation Results Types
export interface DailyRevenue {
  treatment: number
  thermal: number
  retail: number
  total: number
}

export interface WeeklyRevenue {
  daily: DailyRevenue[]
  totals: {
    treatment: number
    thermal: number
    retail: number
    total: number
  }
}

export interface DailyCosts {
  rent: number
  management: number
  backBar: number
  amenities: number
  overhead: number
  retailCOGS: number
  treatmentLabor: number
  attendantLabor: number
  receptionistLabor: number
  supervisorLabor: number
  total: number
}

export interface WeeklyCosts {
  daily: DailyCosts[]
  totals: {
    fixed: number
    variable: number
    labor: number
    total: number
  }
  breakdown: {
    rent: number
    management: number
    backBar: number
    amenities: number
    overhead: number
    retailCOGS: number
    treatmentLabor: number
    attendantLabor: number
    receptionistLabor: number
    supervisorLabor: number
  }
}

export interface DailyProfit {
  revenue: number
  costs: number
  profit: number
  margin: number
}

export interface FinancialCalculations {
  revenue: WeeklyRevenue
  costs: WeeklyCosts
  profit: {
    daily: DailyProfit[]
    weekly: {
      revenue: number
      costs: number
      profit: number
      margin: number
    }
  }
  capacity: {
    dailyTreatmentCapacity: number
    weeklyTreatmentCapacity: number
    dailyThermalCapacity: number
    weeklyThermalCapacity: number
  }
  utilization: {
    treatmentCount: number[]
    thermalCount: number[]
  }
}

// Scenario Management Types
export interface Scenario {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  inputs: SpaInputs
}
