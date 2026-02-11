'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { SpaInputs, FinancialCalculations } from '@/utils/types'
import { getDefaultInputs, saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage'
import { calculateFinancials } from '@/utils/calculations'

interface FinancialContextType {
  inputs: SpaInputs
  calculations: FinancialCalculations
  updateInputs: (newInputs: SpaInputs) => void
  updateTreatment: (updater: (prev: SpaInputs['treatment']) => SpaInputs['treatment']) => void
  updateThermal: (updater: (prev: SpaInputs['thermal']) => SpaInputs['thermal']) => void
  updateRetail: (updater: (prev: SpaInputs['retail']) => SpaInputs['retail']) => void
  updateCosts: (updater: (prev: SpaInputs['costs']) => SpaInputs['costs']) => void
  resetToDefaults: () => void
  isLoaded: boolean
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<SpaInputs>(getDefaultInputs())
  const [isLoaded, setIsLoaded] = useState(false)
  const [calculations, setCalculations] = useState<FinancialCalculations>(() => 
    calculateFinancials(getDefaultInputs())
  )

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage()
    if (saved) {
      setInputs(saved)
      setCalculations(calculateFinancials(saved))
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage and recalculate when inputs change
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(inputs)
      setCalculations(calculateFinancials(inputs))
    }
  }, [inputs, isLoaded])

  const updateInputs = useCallback((newInputs: SpaInputs) => {
    setInputs(newInputs)
  }, [])

  const updateTreatment = useCallback((updater: (prev: SpaInputs['treatment']) => SpaInputs['treatment']) => {
    setInputs(prev => ({ ...prev, treatment: updater(prev.treatment) }))
  }, [])

  const updateThermal = useCallback((updater: (prev: SpaInputs['thermal']) => SpaInputs['thermal']) => {
    setInputs(prev => ({ ...prev, thermal: updater(prev.thermal) }))
  }, [])

  const updateRetail = useCallback((updater: (prev: SpaInputs['retail']) => SpaInputs['retail']) => {
    setInputs(prev => ({ ...prev, retail: updater(prev.retail) }))
  }, [])

  const updateCosts = useCallback((updater: (prev: SpaInputs['costs']) => SpaInputs['costs']) => {
    setInputs(prev => ({ ...prev, costs: updater(prev.costs) }))
  }, [])

  const resetToDefaults = useCallback(() => {
    const defaults = getDefaultInputs()
    setInputs(defaults)
  }, [])

  return (
    <FinancialContext.Provider
      value={{
        inputs,
        calculations,
        updateInputs,
        updateTreatment,
        updateThermal,
        updateRetail,
        updateCosts,
        resetToDefaults,
        isLoaded
      }}
    >
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancialContext() {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error('useFinancialContext must be used within a FinancialProvider')
  }
  return context
}
