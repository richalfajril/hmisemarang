'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PlusCircle, Trash2, Star, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { getOptimizedUrl } from '@/shared/lib/cloudinary-client'
import { uploadSinglePhotoAction, deletePhotoAction, setAlbumCoverAction } from '../api/actions'
import { toast } from 'sonner'
import { Progress } from '@/shared/ui/progress'

type PhotoEntry = {
  id: string
  image_url: string
}

interface PhotoGridProps {
  albumId: string
  photos: Array<PhotoEntry>
  coverImageUrl?: string | null
}

export function PhotoGrid({ albumId, photos, coverImageUrl }: PhotoGridProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [loadingPhotoId, setLoadingPhotoId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)
    setIsUploading(true)
    setUploadProgress({ current: 0, total: files.length })

    let successCount = 0
    let failCount = 0

    // Sequential Upload to avoid rate limits
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)

      setUploadProgress(prev => ({ ...prev, current: i + 1 }))

      const result = await uploadSinglePhotoAction(albumId, formData)
      if (result.success) {
        successCount++
      } else {
        failCount++
        toast.error(`Gagal mengunggah ${file.name}: ${result.message}`)
      }
    }

    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''

    if (successCount > 0) toast.success(`Berhasil mengunggah ${successCount} foto.`)
    if (failCount > 0) toast.warning(`${failCount} foto gagal diunggah.`)
  }

  const handleDelete = async (photoId: string) => {
    if (!window.confirm('Hapus foto ini?')) return
    setLoadingPhotoId(photoId)
    const result = await deletePhotoAction(photoId)
    setLoadingPhotoId(null)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleSetCover = async (photoId: string) => {
    setLoadingPhotoId(photoId)
    const result = await setAlbumCoverAction(albumId, photoId)
    setLoadingPhotoId(null)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Koleksi Foto ({photos.length})</h2>
          <p className="text-sm text-muted-foreground mt-1">Unggah foto ke dalam album ini.</p>
        </div>
        
        <div className="w-full sm:w-auto">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengunggah ({uploadProgress.current}/{uploadProgress.total})</>
            ) : (
              <><PlusCircle className="mr-2 h-4 w-4" /> Tambah Foto</>
            )}
          </Button>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={(uploadProgress.current / uploadProgress.total) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">Mohon tunggu, memproses {uploadProgress.current} dari {uploadProgress.total} gambar...</p>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 border border-dashed rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">Belum Ada Foto</h3>
          <p className="text-muted-foreground mb-6">Mulai tambahkan foto ke dalam album ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => {
            const isCover = photo.image_url === coverImageUrl
            const isLoading = loadingPhotoId === photo.id

            return (
              <Card key={photo.id} className={`overflow-hidden relative group ${isCover ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background' : ''}`}>
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={getOptimizedUrl(photo.image_url)}
                    alt="Foto Galeri"
                    fill
                    className={`object-cover transition-transform group-hover:scale-105 ${isLoading ? 'opacity-50 blur-sm' : ''}`}
                    unoptimized
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  {isCover && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-md flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" /> Sampul
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!isCover && (
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 text-white border-0" onClick={() => handleSetCover(photo.id)} title="Jadikan Sampul" disabled={isLoading}>
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full bg-red-500/80 hover:bg-red-500" onClick={() => handleDelete(photo.id)} title="Hapus Foto" disabled={isLoading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
