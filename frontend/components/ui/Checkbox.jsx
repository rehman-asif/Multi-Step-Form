import { forwardRef } from 'react'

export const Checkbox = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="mb-4">
      <label className="flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
          {...props}
        />
        <span className="text-gray-700">{label}</span>
      </label>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'
