'use client'

import { useSelector } from 'react-redux'
import { FormLayout } from '../../components/FormLayout'
import { Step1UserProfile } from './steps/Step1UserProfile'
import { Step2ContactInfo } from './steps/Step2ContactInfo'
import { Step3EmploymentInfo } from './steps/Step3EmploymentInfo'
import { Step4FinancialInfo } from './steps/Step4FinancialInfo'
import { Step5Preferences } from './steps/Step5Preferences'
import { Step6ReviewSubmit } from './steps/Step6ReviewSubmit'

const stepComponents = {
  1: Step1UserProfile,
  2: Step2ContactInfo,
  3: Step3EmploymentInfo,
  4: Step4FinancialInfo,
  5: Step5Preferences,
  6: Step6ReviewSubmit,
}

export default function FormPage() {
  const { currentStep, editingId } = useSelector((state) => state.form)
  const CurrentStepComponent = stepComponents[currentStep] || Step1UserProfile
  const title = editingId ? 'Edit Form Submission' : 'Multi-Step Form'

  return (
    <FormLayout title={title}>
      <CurrentStepComponent />
    </FormLayout>
  )
}

