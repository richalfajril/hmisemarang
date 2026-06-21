'use client'

import { useActionState, useRef } from 'react'
import { saveDocumentAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { FileText, Loader2, UploadCloud, AlertCircle } from 'lucide-react'
import { DocumentCategory } from '@prisma/client'
import Link from 'next/link'
import { PageHeader } from '@/shared/ui/page-header'

interface DocumentFormProps {
  initialData?: {
    id: string
    title: string
    category_id: string
    status: string
    description?: string | null
    file_url?: string | null
  } | null
  categories: DocumentCategory[]
}

export function DocumentForm({ initialData, categories }: DocumentFormProps) {
  const [state, formAction, isPending] = useActionState(saveDocumentAction, initialActionState)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      <PageHeader
        title={initialData ? 'Edit Dokumen' : 'Unggah Dokumen Baru'}
        description="Pilih berkas format PDF dengan ukuran maksimal 20MB untuk dipublikasikan."
        backHref="/dashboard/documents"
      >
        <Link href="/dashboard/documents">
          <Button type="button" variant="outline" disabled={isPending}>Batal</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><UploadCloud className="mr-2 h-4 w-4" /> Simpan Dokumen</>}
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
          {state?.success && (
            <div className="flex items-center gap-2 rounded-md bg-green-500/15 p-4 mb-6 text-sm text-green-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{state.message}</p>
            </div>
          )}

          {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Dokumen *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={initialData?.title || ''}
                  placeholder="Misal: Pedoman Perkaderan..."
                  required
                  disabled={isPending}
                  className={state?.fieldErrors?.title ? 'border-destructive' : ''}
                />
                {state?.fieldErrors?.title && <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Kategori *</Label>
                <Select name="category_id" defaultValue={initialData?.category_id || categories[0]?.id} disabled={isPending}>
                  <SelectTrigger className={state?.fieldErrors?.category_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state?.fieldErrors?.category_id && <p className="text-xs text-destructive">{state.fieldErrors.category_id[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select name="status" defaultValue={initialData?.status || 'PUBLISHED'} disabled={isPending}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Berkas PDF {initialData ? '(Opsional jika tidak diubah)' : '*'}</Label>
              <div className="relative h-[280px]">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const el = e.target
                    if (el.files && el.files.length > 0) {
                      const label = document.getElementById('pdf-file-name-label')
                      if (label) label.innerText = el.files[0].name
                    }
                  }}
                  disabled={isPending}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg h-full flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-muted/50 ${state?.fieldErrors?.file ? 'border-destructive' : 'border-muted-foreground/25'}`}
                >
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium text-center px-4" id="pdf-file-name-label">
                    {initialData?.file_url ? 'Pilih PDF baru untuk mengganti file lama' : 'Klik untuk mengunggah PDF'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Max 20MB</p>
                </div>
              </div>
              {state?.fieldErrors?.file && <p className="text-xs text-destructive">{state.fieldErrors.file[0]}</p>}
            </div>
          </div>

        </CardContent>
      </Card>
    </form>
  )
}
