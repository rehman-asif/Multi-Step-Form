import { useRef, useState } from 'react'
import { Toast } from '../Toast'
import { getFileUrl, getFileName } from '../../utils/fileUtils'

export function FileUpload({ label, onChange, files = [], maxFiles = 5 }) {
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
    onChange(files.filter((_, i) => i !== index))
  }

  const isServerFile = (file) => !(file instanceof File) && (file.path || file.filename)

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
            {files.map((file, index) => {
              const fileUrl = getFileUrl(file)
              const fileName = getFileName(file)
              const isExisting = isServerFile(file)

              return (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-gray-700 truncate">{fileName}</span>
                    {isExisting && fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 text-sm underline whitespace-nowrap"
                      >
                        View
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxFiles} files. Allowed: Images, PDF, DOC, DOCX (Max 5MB each)
        </p>
      </div>
    </div>
  )
}
