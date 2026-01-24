'use client'

import { useSelector } from 'react-redux'
import { ProgressBar } from './ProgressBar'

const stepNames = ['User Profile', 'Contact Info', 'Employment', 'Financial', 'Preferences', 'Review']

export function FormLayout({ children, title }) {
  const { currentStep } = useSelector((state) => state.form)

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {title && <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">{title}</h1>}
          <ProgressBar currentStep={currentStep} stepNames={stepNames} />
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
