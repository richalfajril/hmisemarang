'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveArticleDraftAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select'
import { TiptapEditor } from '@/shared/ui/editor/TiptapEditor'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Article, ArticleCategory } from '@prisma/client'
import { Loader2, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/shared/ui/PageHeader'

interface ArticleFormProps {
  initialData?: Article
  categories: ArticleCategory[]
  userRole?: string
  userCommissariatId?: string
  commissariats?: { id: string; name: string }[]
}

export function ArticleForm({ initialData, categories, userRole, userCommissariatId, commissariats = [] }: ArticleFormProps) {
  const [state, formAction, isPending] = useActionState(saveArticleDraftAction, initialActionState)
  const [content, setContent] = useState(initialData?.content || '')
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image_url || '')
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard/articles')
    } else if (state?.payload && !state.success) {
      if (state.payload.content) setContent(state.payload.content)
      if (state.payload.featured_image_url) setFeaturedImage(state.payload.featured_image_url)
    }
  }, [state, router])

  const isCommissariatAdmin = userRole === 'ADMIN_KOMISARIAT'
  const autoCommissariatName = commissariats.find(c => c.id === userCommissariatId)?.name || ''
  
  // For Commissariat Admins, we lock the value to their commissariat name
  const defaultAuthorCommissariat = isCommissariatAdmin 
    ? autoCommissariatName 
    : (initialData?.author_commissariat || '')

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium animate-pulse">Menyimpan Artikel...</p>
          </div>
        </div>
      )}

      <form action={formAction} className="flex flex-col h-full w-full overflow-hidden">
        {/* Header - Fixed */}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b">
          <PageHeader
            title={initialData ? 'Edit Draf Artikel' : 'Tulis Artikel Baru'}
            description={initialData ? 'Perbarui informasi draf artikel Anda.' : 'Tulis draf artikel baru untuk dipublikasikan setelah disetujui.'}
            backHref="/dashboard/articles"
            className="border-none pb-0"
          >
            <Link href="/dashboard/articles" prefetch>
              <Button variant="outline" type="button" disabled={isPending}>Batal</Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Draf
            </Button>
          </PageHeader>

          {!state?.success && state?.message && (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{state.message}</p>
            </div>
          )}
        </div>

        {/* Hidden inputs for non-standard form fields */}
        {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="featured_image_url" value={featuredImage} />
        {isCommissariatAdmin && (
          <input type="hidden" name="author_commissariat" value={autoCommissariatName} />
        )}

        {/* Main Content - Scrollable Columns */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Column: Tiptap Editor */}
          <div className="flex-1 overflow-y-auto p-6 lg:border-r border-border">
            <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
              <Label className="sr-only">Isi Artikel *</Label>
              <div className={`flex-1 flex flex-col ${state?.fieldErrors?.content ? 'border border-destructive rounded-md' : ''}`}>
                <TiptapEditor
                  value={content}
                  onChange={setContent}
                  disabled={isPending}
                />
              </div>
              {state?.fieldErrors?.content && (
                <p className="text-xs text-destructive mt-2">{state.fieldErrors.content[0]}</p>
              )}
            </div>
          </div>

          {/* Right Column: Metadata */}
          <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 overflow-y-auto p-6 bg-muted/10 lg:bg-muted/30 border-t lg:border-t-0 border-border">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Artikel *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={state?.payload?.title || initialData?.title || ''}
                  disabled={isPending}
                  placeholder="Contoh: Diskusi Publik Peran Mahasiswa"
                  className={state?.fieldErrors?.title ? 'border-destructive' : 'bg-background'}
                  required
                />
                {state?.fieldErrors?.title && (
                  <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Gambar Fitur *</Label>
                <div className="bg-background rounded-md overflow-hidden">
                  <ImageUploader
                    value={featuredImage}
                    onChange={setFeaturedImage}
                    folder="public-media"
                    disabled={isPending}
                  />
                </div>
                {state?.fieldErrors?.featured_image_url && (
                  <p className="text-xs text-destructive">{state.fieldErrors.featured_image_url[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_name">Nama Penulis *</Label>
                <Input
                  id="author_name"
                  name="author_name"
                  defaultValue={state?.payload?.author_name || initialData?.author_name || ''}
                  disabled={isPending}
                  placeholder="Contoh: Ahmad"
                  className={state?.fieldErrors?.author_name ? 'border-destructive w-full' : 'bg-background w-full'}
                  required
                />
                {state?.fieldErrors?.author_name && (
                  <p className="text-xs text-destructive">{state.fieldErrors.author_name[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_commissariat">Asal Komisariat Penulis *</Label>
                {isCommissariatAdmin ? (
                  <Input
                    id="author_commissariat_display"
                    value={autoCommissariatName}
                    disabled
                    className="bg-muted text-muted-foreground w-full"
                  />
                ) : (
                  <Select name="author_commissariat" defaultValue={state?.payload?.author_commissariat || defaultAuthorCommissariat || undefined} disabled={isPending} required>
                    <SelectTrigger className={state?.fieldErrors?.author_commissariat ? 'border-destructive w-full' : 'bg-background w-full'}>
                      <SelectValue placeholder="Pilih Komisariat..." />
                    </SelectTrigger>
                    <SelectContent>
                      {commissariats.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {state?.fieldErrors?.author_commissariat && (
                  <p className="text-xs text-destructive">{state.fieldErrors.author_commissariat[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Kategori *</Label>
                <Select name="category_id" defaultValue={state?.payload?.category_id || initialData?.category_id || undefined} disabled={isPending} required>
                  <SelectTrigger className={state?.fieldErrors?.category_id ? 'border-destructive w-full' : 'bg-background w-full'}>
                    <SelectValue placeholder="Pilih Kategori..." />
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
                <Label htmlFor="slug">Slug (Opsional)</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={state?.payload?.slug || initialData?.slug || ''}
                  disabled={isPending}
                  placeholder="Kosongkan untuk generate otomatis"
                  className={state?.fieldErrors?.slug ? 'border-destructive' : 'bg-background'}
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
                  defaultValue={state?.payload?.excerpt || initialData?.excerpt || ''}
                  disabled={isPending}
                  placeholder="Ringkasan singkat artikel..."
                  rows={4}
                  className={state?.fieldErrors?.excerpt ? 'border-destructive' : 'bg-background resize-none'}
                />
                {state?.fieldErrors?.excerpt && (
                  <p className="text-xs text-destructive">{state.fieldErrors.excerpt[0]}</p>
                )}
              </div>

            </div>
          </div>

        </div>
      </form>
    </>
  )
}
