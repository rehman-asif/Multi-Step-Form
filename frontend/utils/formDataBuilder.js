export function buildFormData(data) {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (key === 'documents' && Array.isArray(value)) {
      value.forEach(file => formData.append('documents', file))
      return
    }

    if (key === 'password' || key === 'confirmPassword') {
      if (value?.trim()) formData.append(key, value)
      return
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subValue !== undefined && subValue !== null && subValue !== '') {
          formData.append(`${key}[${subKey}]`, typeof subValue === 'boolean' ? String(subValue) : subValue)
        }
      })
      return
    }

    formData.append(key, typeof value === 'boolean' ? String(value) : value)
  })

  return formData
}
