import { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={props.id || props.name} className="label-field">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input-field ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
