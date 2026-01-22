'use client'

import { ProgressBar } from './ProgressBar'

export function FormLayout({ children, title }) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {title}
            </h1>
          )}
          <ProgressBar />
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}


