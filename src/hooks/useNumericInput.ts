import { useState, useCallback, useRef, useEffect } from 'react'

// --- Centralized helpers ---

/** Strings that are valid intermediate typing states but not yet parseable numbers */
export function isTransientEditState(str: string): boolean {
  return /^$|^-$|^\.$|^-\.$|^-?\d+\.$|^0\d/.test(str)
}

/** Try to parse a string as a number. Returns undefined if invalid or transient. */
export function parseNumericString(str: string, isInteger: boolean): number | undefined {
  if (str === '' || str === '-' || str === '.' || str === '-.') return undefined
  const n = Number(str)
  if (isNaN(n)) return undefined
  if (isInteger && !Number.isInteger(n)) return undefined
  return n
}

/** Clamp a number to [min, max] range */
export function clampValue(value: number, min?: number, max?: number): number {
  let v = value
  if (min !== undefined && v < min) v = min
  if (max !== undefined && v > max) v = max
  return v
}

/** Normalize value for the field type (round integers) */
export function normalizeForType(value: number, isInteger: boolean): number {
  return isInteger ? Math.round(value) : value
}

/** Convert a committed value to its display string */
export function valueToDisplayString(value: number | ''): string {
  if (value === '' || value === undefined || value === null) return ''
  return String(value)
}

// --- Hook ---

export interface UseNumericInputOptions {
  /** Current upstream model value */
  value: number
  /** Push committed/live numeric value upstream */
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** true for integer/int fields */
  isInteger?: boolean
}

export interface UseNumericInputReturn {
  /** The string to display in the input */
  displayValue: string
  /** Whether the user is currently editing */
  isEditing: boolean
  handleFocus: (e?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (e?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  /** Call when an external control (e.g. slider) sets the value directly */
  setFromSlider: (value: number) => void
}

export function useNumericInput({
  value,
  onChange,
  min,
  max,
  step,
  isInteger = false
}: UseNumericInputOptions): UseNumericInputReturn {
  const [inputString, setInputString] = useState(() => valueToDisplayString(value))
  const [isEditing, setIsEditing] = useState(false)
  const lastCommittedRef = useRef(value)

  // Sync display from external prop when not editing
  useEffect(() => {
    if (!isEditing) {
      setInputString(valueToDisplayString(value))
      lastCommittedRef.current = value
    }
  }, [value, isEditing])

  const handleFocus = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value
      setInputString(raw)

      // If the string parses to a valid number for this field type, propagate live
      const parsed = parseNumericString(raw, isInteger)
      if (parsed !== undefined) {
        lastCommittedRef.current = parsed
        onChange(parsed)
      }
      // Otherwise: transient state, only local string updates
    },
    [onChange, isInteger]
  )

  const handleBlur = useCallback(() => {
    setIsEditing(false)

    const raw = inputString.trim()
    const parsed = parseNumericString(raw, false) // parse loosely first

    if (parsed === undefined || raw === '') {
      // Invalid or empty — restore last committed value
      const fallback = lastCommittedRef.current
      setInputString(valueToDisplayString(fallback))
      onChange(fallback)
      return
    }

    // Normalize and clamp
    let committed = normalizeForType(parsed, isInteger)
    committed = clampValue(committed, min, max)

    // Snap to step if defined and > 0
    if (step && step > 0 && min !== undefined) {
      committed = Math.round((committed - min) / step) * step + min
      // Fix floating point
      const decimals = (step.toString().split('.')[1] || '').length
      committed = Number(committed.toFixed(decimals))
    }

    lastCommittedRef.current = committed
    setInputString(valueToDisplayString(committed))
    onChange(committed)
  }, [inputString, onChange, min, max, step, isInteger])

  const setFromSlider = useCallback(
    (v: number) => {
      lastCommittedRef.current = v
      if (!isEditing) {
        setInputString(valueToDisplayString(v))
      }
      onChange(v)
    },
    [isEditing, onChange]
  )

  return {
    displayValue: inputString,
    isEditing,
    handleFocus,
    handleChange,
    handleBlur,
    setFromSlider
  }
}
