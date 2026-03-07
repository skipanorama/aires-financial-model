'use client'

import React from 'react'

interface NumberInputProps {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  compact?: boolean
  className?: string
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  compact = false,
  className = ''
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      if (min !== undefined && newValue < min) return
      if (max !== undefined && newValue > max) return
      onChange(newValue)
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {prefix && <span className="text-xs text-gray-500">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="input-compact"
        />
        {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
      </div>
    )
  }

  return (
    <div className={`input-group ${className}`}>
      {label && <label>{label}</label>}
      <div className="flex items-center gap-2">
        {prefix && (
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="flex-1 min-w-0"
        />
        {suffix && (
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
