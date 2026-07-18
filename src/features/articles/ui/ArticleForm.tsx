'use client'

import { useActionState, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { saveArticleDraftAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { Combobox } from '@/shared/ui/Combobox'
import { MediumEditor } from '@/shared/ui/editor/MediumEditor'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Article, ArticleCategory, Tag } from '@prisma/client'
import { Loader2, Save, AlertCircle, Send, Pencil, Rocket } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/shared/ui/PageHeader'
import { TagInput } from '@/shared/ui/TagInput'
import { ArticleReadingView } from '@/features/articles/ui/ArticleReadingView'
import { toast } from 'sonner'

interface ArticleFormProps {
  initialData?: Article & { tags?: Tag[] }
  categories: ArticleCategory[]
  userRole?: string
  userCommissariatId?: string
  commissariats?: { id: string; name: string }[]
}

/** Format Date → nilai input datetime-local ('YYYY-MM-DDTHH:mm', waktu lokal). */
function toLocalInput(d?: Date | string | null): string {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`
}

/** Label ramah-pengguna per field agar banner error menyebut field yang gagal, bukan hanya pesan umum. */
const FIELD_LABELS: Record<string, string> = {
  title: 'Judul',
  slug: 'Slug',
  excerpt: 'Ringkasan',
  content: 'Isi Artikel',
  featured_image_url: 'Gambar Artikel',
  category_id: 'Kategori',
  author_name: 'Nama Penulis',
  author_image_url: 'Foto Penulis',
  author_commissariat: 'Asal Komisariat',
  tag_ids: 'Tag',
}

/** Snapshot data form untuk pratinjau (dibangun saat klik "Simpan Draf"). */
type PreviewSnap = {
  title: string
  content: string
  categoryName: string | null
  authorName: string | null
  authorImageUrl: string | null
  featuredImageUrl: string | null
  featuredImageCaption: string | null
  tags: string[]
}

export function ArticleForm({ initialData, categories, userRole, userCommissariatId, commissariats = [] }: ArticleFormProps) {
  const [state, formAction, isPending] = useActionState(saveArticleDraftAction, initialActionState)
  const [content, setContent] = useState(initialData?.content || '')
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image_url || '')
  const [imageCaption, setImageCaption] = useState(initialData?.featured_image_caption || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [authorCommissariat, setAuthorCommissariat] = useState(initialData?.author_commissariat || '')
  const [authorImage, setAuthorImage] = useState(initialData?.author_image_url || '')
  const canSchedule = userRole === 'ADMIN_CABANG' || userRole === 'SYSTEM_ADMIN'
  const [manualDate, setManualDate] = useState(false)
  const [pubDate, setPubDate] = useState(toLocalInput(initialData?.published_at))
  const router = useRouter()
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [preview, setPreview] = useState<PreviewSnap | null>(null)
  const [clientMissing, setClientMissing] = useState<string[]>([])
  const [preparing, setPreparing] = useState(false)

  // Judul auto-tinggi: teks panjang menambah baris ke bawah, bukan scroll horizontal.
  const autoGrowTitle = useCallback(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [])

  useEffect(() => {
    autoGrowTitle()
  }, [autoGrowTitle, state])

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      router.push('/dashboard/articles')
      return
    }
    if (state?.message && !state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewOpen(false) // buka banner error di belakang modal pratinjau
      if (state.payload?.content) setContent(state.payload.content as string)
      if (state.payload?.featured_image_url) setFeaturedImage(state.payload.featured_image_url as string)
    }
  }, [state, router])

  const isCommissariatAdmin = userRole === 'ADMIN_KOMISARIAT'
  const autoCommissariatName = commissariats.find(c => c.id === userCommissariatId)?.name || ''

  // Klik "Simpan Draf": validasi field wajib di klien, lalu buka pratinjau (belum simpan ke DB).
  const handleOpenPreview = () => {
    const form = formRef.current
    if (!form) return
    const fd = new FormData(form)
    const val = (n: string) => ((fd.get(n) as string) || '').trim()
    const missing: string[] = []
    if (!val('title')) missing.push('Judul')
    if (val('content').length < 50) missing.push('Isi Artikel (min 50 karakter)')
    if (!val('featured_image_url')) missing.push('Gambar Artikel')
    if (!val('author_name')) missing.push('Nama Penulis')
    if (!val('author_commissariat')) missing.push('Asal Komisariat')
    if (!val('category_id')) missing.push('Kategori')
    if (missing.length) {
      setClientMissing(missing)
      return
    }
    setClientMissing([])
    const snap: PreviewSnap = {
      title: val('title'),
      content,
      categoryName: categories.find((c) => c.id === categoryId)?.name ?? null,
      authorName: val('author_name') || null,
      authorImageUrl: authorImage || null,
      featuredImageUrl: featuredImage || null,
      featuredImageCaption: imageCaption || null,
      tags: ((fd.get('tag_labels') as string) || '').split(',').map((s) => s.trim()).filter(Boolean),
    }
    // Spinner dulu, baru modal (sesuai UX spec). ponytail: jeda fixed 450ms — cukup, tak perlu async nyata.
    setPreparing(true)
    setTimeout(() => {
      setPreview(snap)
      setPreviewOpen(true)
      setPreparing(false)
    }, 450)
  }




  return (
    <>
      {(isPending || preparing) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium animate-pulse">{preparing ? 'Menyiapkan pratinjau…' : 'Menyimpan Artikel…'}</p>
          </div>
        </div>
      )}

      <form ref={formRef} action={formAction} className="flex flex-col h-full w-full overflow-hidden">
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
            <Button type="button" onClick={handleOpenPreview} disabled={isPending}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Draf
            </Button>
          </PageHeader>

          {clientMissing.length > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive animate-in slide-in-from-top-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Lengkapi dulu sebelum pratinjau — <span className="font-semibold">Periksa: {clientMissing.join(', ')}</span></p>
            </div>
          )}

          {!state?.success && state?.message && (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive animate-in slide-in-from-top-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p>{state.message}</p>
                {state.fieldErrors && Object.keys(state.fieldErrors).length > 0 && (
                  <p className="mt-1">
                    Periksa: <span className="font-semibold">{Object.keys(state.fieldErrors).map((k) => FIELD_LABELS[k] ?? k).join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden inputs for non-standard form fields */}
        {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="featured_image_url" value={featuredImage} />
        <input type="hidden" name="category_id" value={categoryId} />
        {isCommissariatAdmin && (
          <input type="hidden" name="author_commissariat" value={autoCommissariatName} />
        )}
        {!isCommissariatAdmin && (
          <input type="hidden" name="author_commissariat" value={authorCommissariat} />
        )}

        {/* Main Content - Scrollable Columns */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Column: Tiptap Editor */}
          <div className="flex-1 overflow-y-auto p-6 lg:border-r border-border">
            <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
              <Label htmlFor="title" className="sr-only">Judul Artikel *</Label>
              <div className="max-w-4xl mx-auto w-full">
                <textarea
                  ref={titleRef}
                  id="title"
                  name="title"
                  rows={1}
                  autoFocus
                  defaultValue={state?.payload?.title || initialData?.title || ''}
                  disabled={isPending}
                  placeholder="Judul Artikel"
                  required
                  onInput={autoGrowTitle}
                  className={`w-full resize-none overflow-hidden border-0 bg-transparent px-0 py-2 font-heading text-[1.75rem] leading-tight font-bold shadow-none outline-none placeholder:text-muted-foreground/40 focus-visible:ring-0 sm:text-[2rem] ${state?.fieldErrors?.title ? 'text-destructive' : ''}`}
                />
                {state?.fieldErrors?.title && (
                  <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>
                )}
              </div>
              {featuredImage && (
                <div className="mx-auto mt-2 w-full max-w-4xl">
                  <div className="relative aspect-video w-full overflow-hidden border border-border">
                    <Image
                      src={featuredImage}
                      alt={imageCaption || 'Pratinjau gambar artikel'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 896px"
                      className="object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    name="featured_image_caption"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    disabled={isPending}
                    maxLength={255}
                    placeholder="Tambahkan keterangan gambar (opsional)"
                    className="mt-2 w-full border-0 bg-transparent text-center text-sm italic text-muted-foreground shadow-none outline-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
                  />
                </div>
              )}
              <Label className="sr-only">Isi Artikel *</Label>
              <div className={`flex-1 flex flex-col ${state?.fieldErrors?.content ? 'border border-destructive rounded-md' : ''}`}>
                <MediumEditor
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
          <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 overflow-y-auto p-6 bg-muted/10 lg:bg-muted/30 border-t lg:border-t-0 border-border">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Gambar Artikel (rasio 16:9) *</Label>
                <div className="bg-background rounded-md overflow-hidden">
                  <ImageUploader
                    value={featuredImage}
                    onChange={setFeaturedImage}
                    folder="public-media"
                    disabled={isPending}
                    maxDimension={1280}
                    className="aspect-video w-full"
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
                <input type="hidden" name="author_image_url" value={authorImage} />
                <Label>Foto Penulis (rasio 1:1, opsional)</Label>
                <ImageUploader
                  value={authorImage || null}
                  onChange={setAuthorImage}
                  folder="author-avatars"
                  maxDimension={400}
                  disabled={isPending}
                  tight
                  className="aspect-square max-w-[180px]"
                />
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
                  <Combobox
                    options={commissariats.map(c => ({ value: c.name, label: c.name }))}
                    value={state?.payload?.author_commissariat || authorCommissariat || undefined}
                    onValueChange={setAuthorCommissariat}
                    placeholder="Pilih Komisariat..."
                    searchPlaceholder="Ketik untuk mencari..."
                    emptyMessage="Komisariat tidak ditemukan."
                    disabled={isPending}
                    className={state?.fieldErrors?.author_commissariat ? 'border-destructive' : 'bg-background'}
                  />
                )}
                {state?.fieldErrors?.author_commissariat && (
                  <p className="text-xs text-destructive">{state.fieldErrors.author_commissariat[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Kategori *</Label>
                <Combobox
                  options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                  value={state?.payload?.category_id || categoryId || undefined}
                  onValueChange={setCategoryId}
                  placeholder="Pilih Kategori..."
                  searchPlaceholder="Ketik untuk mencari..."
                  emptyMessage="Kategori tidak ditemukan."
                  disabled={isPending}
                  className={state?.fieldErrors?.category_id ? 'border-destructive' : 'bg-background'}
                />
                {state?.fieldErrors?.category_id && (
                  <p className="text-xs text-destructive">{state.fieldErrors.category_id[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag_labels">Tag Label (Kata Kunci SEO)</Label>
                <TagInput
                  name="tag_labels"
                  defaultValue={initialData?.tags?.map((t) => t.name) ?? []}
                  disabled={isPending}
                  placeholder="isi sebanyak-banyaknya kata kunci yang mewakili"
                />
                <p className="text-xs text-muted-foreground">Ketik kata kunci lalu tekan Enter atau koma.</p>
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

              {canSchedule && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published_at">Tanggal Publikasi</Label>
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={manualDate}
                        onChange={(e) => setManualDate(e.target.checked)}
                        disabled={isPending}
                        className="h-4 w-4 accent-primary"
                      />
                      Atur manual
                    </label>
                  </div>
                  {manualDate ? (
                    <Input
                      id="published_at"
                      type="datetime-local"
                      name="published_at"
                      value={pubDate}
                      onChange={(e) => setPubDate(e.target.value)}
                      disabled={isPending}
                      required
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground">Otomatis — tanggal saat artikel disimpan.</p>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Pratinjau full-screen — tombol final men-submit form (di dalam <form>) dgn target_status. */}
        {previewOpen && preview && (
          <div className="fixed inset-0 z-50 flex flex-col bg-background">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-bold">Pratinjau Artikel</h2>
                <p className="text-sm text-muted-foreground">
                  {canSchedule ? 'Tinjau tampilan sebelum dipublikasikan.' : 'Tinjau tampilan sebelum diajukan ke Cabang.'}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button type="button" variant="outline" onClick={() => setPreviewOpen(false)} disabled={isPending}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button type="submit" name="target_status" value={canSchedule ? 'PUBLISHED' : 'SUBMITTED'} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : canSchedule ? (
                    <Rocket className="mr-2 h-4 w-4" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {canSchedule ? 'Publish' : 'Ajukan Draf'}
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-4xl px-5 py-8">
                <ArticleReadingView
                  showBreadcrumb={false}
                  title={preview.title}
                  content={preview.content}
                  categoryName={preview.categoryName}
                  authorName={preview.authorName}
                  authorImageUrl={preview.authorImageUrl}
                  featuredImageUrl={preview.featuredImageUrl}
                  featuredImageCaption={preview.featuredImageCaption}
                  tags={preview.tags}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  )
}
