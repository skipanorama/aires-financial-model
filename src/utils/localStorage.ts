import { SpaInputs, Scenario } from './types'

const STORAGE_KEY = 'aires-financial-model-inputs'
const SCENARIOS_KEY = 'aires-financial-model-scenarios'

// Deep merge imported data with defaults to fill in any missing fields
// This ensures backward compatibility when importing data from older versions
const mergeWithDefaults = (imported: any): SpaInputs => {
  const defaults = getDefaultInputs()
  return {
    treatment: { ...defaults.treatment, ...imported.treatment },
    thermal: { ...defaults.thermal, ...imported.thermal },
    retail: { ...defaults.retail, ...imported.retail },
    costs: {
      ...defaults.costs,
      ...imported.costs,
      attendants: { ...defaults.costs.attendants, ...(imported.costs?.attendants || {}) },
      receptionists: { ...defaults.costs.receptionists, ...(imported.costs?.receptionists || {}) },
      supervisors: { ...defaults.costs.supervisors, ...(imported.costs?.supervisors || {}) },
    },
  }
}

// Default values for testing and initial setup
export const getDefaultInputs = (): SpaInputs => ({
  treatment: {
    capacity: {
      totalBeds: 9, // 5 single rooms + 2 couples rooms × 2 beds
      operatingHours: 12.25, // 8:00 AM to 8:15 PM
      treatmentDuration: 60, // minutes
      cleaningTime: 15, // minutes
      staggerInterval: 15 // minutes between treatment starts
    },
    utilization: [70, 75, 80, 85, 90, 95, 85], // Mon-Sun utilization percentages
    hotelPrices: [160, 160, 160, 160, 180, 180, 180], // Mon-Thu: $160, Fri-Sun: $180
    nonHotelPrices: [160, 160, 160, 160, 180, 180, 180], // Mon-Thu: $160, Fri-Sun: $180
    hotelGuestPercentage: 50 // 50% hotel guests, 50% non-hotel
  },
  thermal: {
    maxCapacity: 25, // guests at one time
    operatingHours: 10, // 9:00 AM to 7:00 PM
    sessionDuration: 3, // hours per session
    utilization: [60, 65, 70, 75, 85, 90, 80], // Mon-Sun utilization percentages
    hotelPrices: [95, 95, 95, 95, 105, 105, 105], // Mon-Thu: $95, Fri-Sun: $105
    nonHotelPrices: [125, 125, 125, 125, 135, 135, 135], // Mon-Thu: $125, Fri-Sun: $135
    hotelGuestPercentage: 50, // 50% hotel guests
    hotelComboDiscount: 25, // $25 discount for hotel guest treatment + thermal combo
    nonHotelComboDiscount: 25, // $25 discount for non-hotel guest treatment + thermal combo
    comboPercentages: [30, 30, 35, 35, 40, 45, 35] // Mon-Sun combo usage percentages
  },
  retail: {
    revenuePercentage: 12 // 12% of treatment + thermal revenue
  },
  costs: {
    // Fixed Costs - Base Rent (minimum annual rent)
    baseRent: 275000, // $275,000 annual minimum rent
    // Tiered Rent based on annual revenue
    rentTiers: [
      { minRevenue: 0, maxRevenue: 1800000, percentage: 5 },
      { minRevenue: 1800000, maxRevenue: 2500000, percentage: 6 },
      { minRevenue: 2500000, maxRevenue: 3000000, percentage: 7 },
      { minRevenue: 3000000, maxRevenue: 4500000, percentage: 8 },
      { minRevenue: 4500000, maxRevenue: 6000000, percentage: 9 },
      { minRevenue: 6000000, maxRevenue: null, percentage: 10 }
    ],
    annualManagementSalary: 170000, // $170,000 annual
    weeklyOverhead: 8000, // $8,000 weekly for utilities, POS, internet, phone, music
    
    // Variable Costs
    backBarCostPerTreatment: 15, // $15 per treatment for products/supplies
    amenityCostPerGuest: 10, // $10 per guest for towels, robes, slippers
    retailCOGSPercentage: 65, // 65% of retail revenue
    treatmentLaborCost: 55, // $55 per treatment for contractors
    
    // Labor Costs
    attendants: {
      dailyCount: [2, 2, 2, 2, 4, 4, 4], // Mon-Thu: 2, Fri-Sun: 4
      hourlyRate: 20, // $20/hour
      hoursPerShift: 8 // Standard 8-hour shift
    },
    receptionists: {
      dailyCount: [4, 4, 4, 4, 4, 4, 4], // Mon-Sun: 4
      hourlyRate: 23, // $23/hour
      hoursPerShift: 8 // Standard 8-hour shift
    },
    supervisors: {
      dailyCount: [1, 1, 1, 1, 1.5, 1.5, 1.5], // Mon-Thu: 1, Fri-Sun: 1.5
      hourlyRate: 30, // $30/hour
      hoursPerShift: 8 // Standard 8-hour shift
    }
  }
})

// Save inputs to localStorage
export const saveToLocalStorage = (inputs: SpaInputs): void => {
  try {
    const serialized = JSON.stringify(inputs)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// Load inputs from localStorage
export const loadFromLocalStorage = (): SpaInputs | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (serialized === null) {
      return null
    }
    const data = JSON.parse(serialized)
    // Merge with defaults to fill in any missing fields from older versions
    return mergeWithDefaults(data)
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

// Clear localStorage
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

// Export data as JSON for download
export const exportDataAsJSON = (inputs: SpaInputs): void => {
  try {
    const dataStr = JSON.stringify(inputs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'aires-financial-model-data.json'
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export data:', error)
  }
}

// Import data from JSON file
export const importDataFromJSON = (file: File): Promise<SpaInputs> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        // Validate the imported data structure
        if (validateInputStructure(data)) {
          // Merge with defaults to fill in any missing fields from older versions
          resolve(mergeWithDefaults(data))
        } else {
          reject(new Error('Invalid data structure'))
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Basic validation of input structure
const validateInputStructure = (data: any): boolean => {
  try {
    return (
      data &&
      typeof data === 'object' &&
      data.treatment &&
      data.thermal &&
      data.retail &&
      data.costs &&
      Array.isArray(data.treatment.utilization) &&
      data.treatment.utilization.length === 7 &&
      Array.isArray(data.thermal.utilization) &&
      data.thermal.utilization.length === 7
    )
  } catch {
    return false
  }
}

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format percentage for display
export const formatPercentage = (percentage: number, decimals: number = 1): string => {
  return `${percentage.toFixed(decimals)}%`
}

// Days of the week labels
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ============================================
// SCENARIO MANAGEMENT FUNCTIONS
// ============================================

// Generate unique ID for scenarios
const generateScenarioId = (): string => {
  return `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get all saved scenarios
export const getAllScenarios = (): Scenario[] => {
  try {
    const serialized = localStorage.getItem(SCENARIOS_KEY)
    if (serialized === null) {
      return []
    }
    return JSON.parse(serialized)
  } catch (error) {
    console.error('Failed to load scenarios:', error)
    return []
  }
}

// Save a new scenario
export const saveScenario = (name: string, description: string, inputs: SpaInputs): Scenario => {
  const scenarios = getAllScenarios()
  const now = new Date().toISOString()
  
  const newScenario: Scenario = {
    id: generateScenarioId(),
    name,
    description,
    createdAt: now,
    updatedAt: now,
    inputs: JSON.parse(JSON.stringify(inputs)) // Deep clone to avoid reference issues
  }
  
  scenarios.push(newScenario)
  
  try {
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))
  } catch (error) {
    console.error('Failed to save scenario:', error)
  }
  
  return newScenario
}

// Update an existing scenario
export const updateScenario = (id: string, name: string, description: string, inputs: SpaInputs): Scenario | null => {
  const scenarios = getAllScenarios()
  const index = scenarios.findIndex(s => s.id === id)
  
  if (index === -1) {
    console.error('Scenario not found:', id)
    return null
  }
  
  const updatedScenario: Scenario = {
    ...scenarios[index],
    name,
    description,
    updatedAt: new Date().toISOString(),
    inputs: JSON.parse(JSON.stringify(inputs))
  }
  
  scenarios[index] = updatedScenario
  
  try {
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))
  } catch (error) {
    console.error('Failed to update scenario:', error)
    return null
  }
  
  return updatedScenario
}

// Get a single scenario by ID
export const getScenario = (id: string): Scenario | null => {
  const scenarios = getAllScenarios()
  return scenarios.find(s => s.id === id) || null
}

// Delete a scenario by ID
export const deleteScenario = (id: string): boolean => {
  const scenarios = getAllScenarios()
  const filteredScenarios = scenarios.filter(s => s.id !== id)
  
  if (filteredScenarios.length === scenarios.length) {
    console.error('Scenario not found:', id)
    return false
  }
  
  try {
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(filteredScenarios))
    return true
  } catch (error) {
    console.error('Failed to delete scenario:', error)
    return false
  }
}

// Export a scenario as JSON file
export const exportScenarioAsJSON = (scenario: Scenario): void => {
  try {
    const dataStr = JSON.stringify(scenario, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    // Sanitize filename
    const sanitizedName = scenario.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    link.download = `scenario_${sanitizedName}_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export scenario:', error)
  }
}

// Import a scenario from JSON file
export const importScenarioFromJSON = (file: File): Promise<Scenario> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        
        // Validate the scenario structure
        if (validateScenarioStructure(data)) {
          // Merge inputs with defaults to fill in any missing fields from older versions
          const mergedInputs = mergeWithDefaults(data.inputs)
          // Generate new ID to avoid conflicts
          const importedScenario: Scenario = {
            ...data,
            inputs: mergedInputs,
            id: generateScenarioId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          // Save the imported scenario
          const scenarios = getAllScenarios()
          scenarios.push(importedScenario)
          localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))
          
          resolve(importedScenario)
        } else {
          reject(new Error('Invalid scenario structure'))
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Validate scenario structure
const validateScenarioStructure = (data: unknown): boolean => {
  try {
    const scenario = data as Scenario
    return (
      scenario &&
      typeof scenario === 'object' &&
      typeof scenario.name === 'string' &&
      typeof scenario.description === 'string' &&
      scenario.inputs &&
      validateInputStructure(scenario.inputs)
    )
  } catch {
    return false
  }
}
