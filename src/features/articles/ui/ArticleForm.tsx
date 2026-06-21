'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveArticleDraftAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/ui/Button'
import { Input } from '@/shared/ui/ui/Input'
import { Label } from '@/shared/ui/ui/Label'
import { Textarea } from '@/shared/ui/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/ui/Select'
import { TiptapEditor } from '@/shared/ui/editor/TiptapEditor'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Article, ArticleCategory } from '@prisma/client'
import { Loader2, Save, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ArticleFormProps {
  initialData?: Article
  categories: ArticleCategory[]
}

export function ArticleForm({ initialData, categories }: ArticleFormProps) {
  const [state, formAction, isPending] = useActionState(saveArticleDraftAction, initialActionState)
  const [content, setContent] = useState(initialData?.content || '')
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image_url || '')
  const router = useRouter()

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/articles">
            <Button variant="outline" size="icon" type="button">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">{initialData ? 'Edit Draf Artikel' : 'Tulis Artikel Baru'}</h2>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/articles">
            <Button variant="outline" type="button">Batal</Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Draf
          </Button>
        </div>
      </div>

      {!state?.success && state?.message && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {/* Hidden inputs for non-standard form fields */}
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="featured_image_url" value={featuredImage} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Artikel *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title || ''}
              disabled={isPending}
              placeholder="Contoh: Diskusi Publik Peran Mahasiswa"
              className={state?.fieldErrors?.title ? 'border-destructive' : ''}
              required
            />
            {state?.fieldErrors?.title && (
              <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (Opsional)</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={initialData?.slug || ''}
              disabled={isPending}
              placeholder="Kosongkan untuk generate otomatis dari judul"
              className={state?.fieldErrors?.slug ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.slug && (
              <p className="text-xs text-destructive">{state.fieldErrors.slug[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={initialData?.excerpt || ''}
              disabled={isPending}
              placeholder="Ringkasan singkat artikel..."
              rows={3}
              className={state?.fieldErrors?.excerpt ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.excerpt && (
              <p className="text-xs text-destructive">{state.fieldErrors.excerpt[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Isi Artikel *</Label>
            <div className={state?.fieldErrors?.content ? 'border border-destructive rounded-md' : ''}>
              <TiptapEditor
                value={content}
                onChange={setContent}
                disabled={isPending}
              />
            </div>
            {state?.fieldErrors?.content && (
              <p className="text-xs text-destructive">{state.fieldErrors.content[0]}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Gambar Fitur *</Label>
            <ImageUploader
              value={featuredImage}
              onChange={setFeaturedImage}
              folder="public-media"
              disabled={isPending}
            />
            {state?.fieldErrors?.featured_image_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.featured_image_url[0]}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">Rekomendasi rasio 16:9. Format WebP/JPG/PNG. Maks 5MB.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Kategori *</Label>
            <Select name="category_id" defaultValue={initialData?.category_id || undefined} disabled={isPending}>
              <SelectTrigger className={state?.fieldErrors?.category_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.fieldErrors?.category_id && (
              <p className="text-xs text-destructive">{state.fieldErrors.category_id[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author_name">Nama Penulis</Label>
            <Input
              id="author_name"
              name="author_name"
              defaultValue={initialData?.author_name || ''}
              disabled={isPending}
              placeholder="Contoh: Ahmad"
              className={state?.fieldErrors?.author_name ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.author_name && (
              <p className="text-xs text-destructive">{state.fieldErrors.author_name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author_commissariat">Asal Komisariat Penulis</Label>
            <Input
              id="author_commissariat"
              name="author_commissariat"
              defaultValue={initialData?.author_commissariat || ''}
              disabled={isPending}
              placeholder="Contoh: Komisariat FSM"
              className={state?.fieldErrors?.author_commissariat ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.author_commissariat && (
              <p className="text-xs text-destructive">{state.fieldErrors.author_commissariat[0]}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
