import { forwardRef } from 'react'

export const Select = forwardRef(({ label, error, options, ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={props.id || props.name} className="label-field">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`input-field ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        <option value="">Select {label}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'
