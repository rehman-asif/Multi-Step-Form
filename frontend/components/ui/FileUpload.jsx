import { useRef, useState } from 'react'
import { Toast } from '../Toast'

export function FileUpload({ label, error, onChange, files = [], maxFiles = 5 }) {
  const fileInputRef = useRef(null)
  const [toast, setToast] = useState(null)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (files.length + selectedFiles.length > maxFiles) {
      setToast({ message: `Maximum ${maxFiles} files allowed`, type: 'error' })
      return
    }
    onChange([...files, ...selectedFiles])
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  return (
    <div className="mb-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={2000}
        />
      )}
      {label && <label className="label-field">{label}</label>}
      <div className="mt-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary text-sm"
        >
          Choose Files
        </button>
        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span className="text-sm text-gray-700 truncate">
                  {file.name || file.originalName || file.filename}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxFiles} files. Allowed: Images, PDF, DOC, DOCX (Max 5MB each)
        </p>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}


