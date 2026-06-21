'use client'

import { useActionState } from 'react'
import { saveAlbumAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card'
import { Loader2, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PageHeader } from '@/shared/ui/PageHeader'

interface AlbumFormProps {
  initialData?: {
    id: string
    title: string
    status: string
    description?: string | null
  } | null
}

export function AlbumForm({ initialData }: AlbumFormProps) {
  const [state, formAction, isPending] = useActionState(saveAlbumAction, initialActionState)
  const router = useRouter()

  useEffect(() => {
    if (state?.success && !initialData) {
      // If it's a new album and successful, we probably want to redirect to /dashboard/galleries to let them add photos
      router.push('/dashboard/galleries')
    }
  }, [state?.success, initialData, router])

  const cancelHref = initialData ? `/dashboard/galleries/${initialData.id}` : '/dashboard/galleries'

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      <PageHeader
        title={initialData ? 'Edit Informasi Album' : 'Buat Album Baru'}
        description={initialData ? 'Perbarui metadata album.' : 'Setelah album dibuat, Anda akan dapat mengunggah foto ke dalamnya.'}
        backHref={cancelHref}
      >
        <Link href={cancelHref} prefetch>
          <Button type="button" variant="outline" disabled={isPending}>Batal</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> {initialData ? 'Simpan Perubahan' : 'Buat Album'}</>}
        </Button>
      </PageHeader>

      <Card className="max-w-4xl">
        <CardContent className="pt-6">
          {!state?.success && state?.message && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 mb-6 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{state.message}</p>
            </div>
          )}
          {state?.success && initialData && (
            <div className="flex items-center gap-2 rounded-md bg-green-500/15 p-4 mb-6 text-sm text-green-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{state.message}</p>
            </div>
          )}

          {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

          <div className="space-y-2">
            <Label htmlFor="title">Judul Album *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title || ''}
              placeholder="Misal: Pelantikan Pengurus HMI Cabang Semarang 2024"
              required
              disabled={isPending}
              className={state?.fieldErrors?.title ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.title && <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Singkat</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ''}
              rows={3}
              disabled={isPending}
              className={state?.fieldErrors?.description ? 'border-destructive' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Visibilitas Album *</Label>
            <Select name="status" defaultValue={initialData?.status || 'DRAFT'} disabled={isPending}>
              <SelectTrigger className={state?.fieldErrors?.status ? 'border-destructive' : ''}>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLISHED">Published (Publik)</SelectItem>
                <SelectItem value="DRAFT">Draft (Disembunyikan)</SelectItem>
                <SelectItem value="ARCHIVED">Archived (Diarsipkan)</SelectItem>
              </SelectContent>
            </Select>
            {state?.fieldErrors?.status && <p className="text-xs text-destructive">{state.fieldErrors.status[0]}</p>}
          </div>

        </CardContent>
      </Card>
    </form>
  )
}
