"use client"

import { useState } from "react"

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
}

export function Switch({ checked = false, onCheckedChange, disabled = false, id }: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleChange = () => {
    if (disabled) return
    const newState = !isChecked
    setIsChecked(newState)
    onCheckedChange?.(newState)
  }

  return (
    <button
      id={id}
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isChecked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isChecked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  )
}
