'use client'

export function ProgressBar({ currentStep, stepNames }) {
  const progress = (currentStep / stepNames.length) * 100

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {stepNames.map((name, index) => (
          <div
            key={index}
            className={`flex-1 text-center text-sm font-medium ${
              index + 1 <= currentStep ? 'text-primary-600' : 'text-gray-400'
            }`}
          >
            {name}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-sm text-gray-600 mt-2">
        Step {currentStep} of {stepNames.length}
      </div>
    </div>
  )
}
