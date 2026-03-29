import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { uploadToImgbb } from '@/lib/imgbb'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
}

const ImageUploadField = ({ label, value, onChange }: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.')
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const url = await uploadToImgbb(file)
      onChange(url)
    } catch {
      setUploadError('Upload failed. You can paste a URL below instead.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClear = () => {
    onChange('')
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Drop zone */}
      <div
        className="relative border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-40 object-cover"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <ImagePlus className="w-8 h-8" />
                <p className="text-sm font-medium">Click or drag to upload</p>
                <p className="text-xs">PNG, JPG, WEBP up to 10 MB</p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}

      {/* URL fallback */}
      <Input
        type="url"
        placeholder="Or paste an image URL here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl text-sm"
      />
    </div>
  )
}

export default ImageUploadField
