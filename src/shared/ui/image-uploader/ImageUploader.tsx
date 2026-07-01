'use client'

import { useState, useCallback, useRef } from 'react'
import { uploadMediaAction } from '@/shared/api/media/actions'
import { compressImageToWebp } from '@/shared/lib/image-compress'
import { Button } from '@/shared/ui/Button'
import { Loader2, Image as ImageIcon, UploadCloud, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ImageUploaderProps {
  value?: string | null
  onChange: (url: string) => void
  folder?: string
  className?: string
  disabled?: boolean
  /** Longest-edge cap (px) for client-side optimization. 1920 hero, 1280 content, 512 logo. */
  maxDimension?: number
}

export function ImageUploader({ value, onChange, folder = 'public-media', className, disabled, maxDimension = 1920 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return
    
    setIsUploading(true)
    try {
      // Optimize before upload: resize + convert to WebP, ≤2MB.
      const optimized = await compressImageToWebp(file, maxDimension)

      const formData = new FormData()
      formData.append('file', optimized)

      const result = await uploadMediaAction(formData, folder)
      
      if (result.success && result.url) {
        onChange(result.url)
      } else {
        alert(result.error || 'Failed to upload image')
      }
    } catch (err) {
      console.error(err)
      alert('An unexpected error occurred during upload')
    } finally {
      setIsUploading(false)
    }
  }, [folder, onChange, maxDimension])

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled || isUploading) return

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        await handleUpload(file)
      } else {
        alert('Please drop an image file.')
      }
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0])
    }
  }

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-full min-h-[200px] border-2 border-dashed rounded-lg transition-colors overflow-hidden group",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/20 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed",
          value && "border-none"
        )}
        onDragEnter={onDragEnter}
        onDragOver={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={onFileChange}
          disabled={disabled || isUploading}
        />

        {value ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={value} 
              alt="Uploaded media" 
              className="max-h-[300px] object-contain rounded-md"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Ganti Gambar
                </Button>
                <Button 
                  type="button"
                  variant="destructive" 
                  size="sm"
                  onClick={() => onChange('')}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            {isUploading ? (
              <>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mengunggah gambar...</p>
                  <p className="text-xs text-muted-foreground">Mohon tunggu sebentar.</p>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tarik & letakkan gambar di sini</p>
                  <p className="text-xs text-muted-foreground">atau klik tombol di bawah</p>
                </div>
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm"
                  className="mt-2"
                  onClick={() => inputRef.current?.click()}
                  disabled={disabled}
                >
                  Pilih Gambar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
