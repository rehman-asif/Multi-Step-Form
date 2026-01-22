export function Radio({ label, options, error, name, value, onChange }) {
  return (
    <div className="mb-4">
      {label && <label className="label-field">{label}</label>}
      <div className="flex flex-wrap gap-4 mt-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}


