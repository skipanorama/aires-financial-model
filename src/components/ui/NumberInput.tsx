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
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
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
          className={`${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
