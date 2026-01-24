'use client'

import { useEffect } from 'react'

export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColor = type === 'error' 
    ? 'bg-red-50 border-red-200 text-red-700' 
    : 'bg-green-50 border-green-200 text-green-700'

  return (
    <div className={`fixed top-4 right-4 z-50 border rounded-lg px-4 py-3 shadow-lg ${bgColor}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-current opacity-70 hover:opacity-100">
          ×
        </button>
      </div>
    </div>
  )
}
