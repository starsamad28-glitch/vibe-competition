import { useState } from 'react'

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved === null ? (typeof initialValue === 'function' ? initialValue() : initialValue) : JSON.parse(saved)
    } catch {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }
  })
  const updateValue = (nextValue) => setValue((previous) => {
    const next = typeof nextValue === 'function' ? nextValue(previous) : nextValue
    try { window.localStorage.setItem(key, JSON.stringify(next)) } catch { /* Storage may be unavailable. */ }
    return next
  })
  return [value, updateValue]
}