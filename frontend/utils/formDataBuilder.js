export function buildFormData(data) {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') {
      continue
    }

    if (key === 'documents' && Array.isArray(value)) {
      value.forEach(file => formData.append('documents', file))
      continue
    }

    if (key === 'password' || key === 'confirmPassword') {
      if (value && value.trim() !== '') {
        formData.append(key, value)
      }
      continue
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (subValue !== undefined && subValue !== null && subValue !== '') {
          const formValue = typeof subValue === 'boolean' ? String(subValue) : subValue
          formData.append(`${key}[${subKey}]`, formValue)
        }
      }
      continue
    }

    const formValue = typeof value === 'boolean' ? String(value) : value
    formData.append(key, formValue)
  }

  return formData
}

