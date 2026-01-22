'use client'

import { useSelector } from 'react-redux'

const steps = [
  'User Profile',
  'Contact Info',
  'Employment',
  'Financial',
  'Preferences',
  'Review',
]

export function ProgressBar() {
  const { currentStep, totalSteps } = useSelector((state) => state.form)
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center text-sm font-medium ${
              index + 1 <= currentStep ? 'text-primary-600' : 'text-gray-400'
            }`}
          >
            {step}
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
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  )
}


