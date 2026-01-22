const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const getFileUrl = (file) => {
  if (!file) return null
  
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  
  if (file.path) {
    const filename = file.path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/')
    return `${API_BASE_URL}/uploads/${filename}`
  }
  
  if (file.filename) {
    return `${API_BASE_URL}/uploads/${file.filename}`
  }
  
  return null
}

export const getFileName = (file) => {
  if (!file) return 'Unknown file'
  
  if (file instanceof File) {
    return file.name
  }
  
  return file.originalName || file.filename || 'Unknown file'
}

