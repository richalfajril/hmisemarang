'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import { TextSelection } from '@tiptap/pm/state'
import { useEffect, useRef, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube, { getEmbedUrlFromYoutubeUrl } from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { FigureImage } from './FigureImage'
import { FigureVideo } from './FigureVideo'
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Heading2,
  Heading3,
  Quote,
  Plus,
  ImageIcon,
  Video as YoutubeIcon,
  Code2,
  Minus,
  Loader2,
  X,
  type LucideIcon,
} from 'lucide-react'
import { compressImageToWebp } from '@/shared/lib/image-compress'
import { uploadMediaAction } from '@/shared/api/media/actions'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/Dialog'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/Label'
import { cn } from '@/shared/lib/utils'

interface MediumEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function BubbleBtn({
  active,
  onClick,
  disabled,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded text-white/90 hover:bg-white/15 disabled:opacity-40',
        active && 'bg-white/25 text-white',
      )}
    >
      {children}
    </button>
  )
}

export function MediumEditor({ value, onChange, disabled }: MediumEditorProps) {
  const [linkMode, setLinkMode] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [plusOpen, setPlusOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [youtubeOpen, setYoutubeOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: { class: 'text-primary underline underline-offset-4' },
        },
      }),
      Image.configure({ HTMLAttributes: { class: 'rounded-md max-w-full h-auto' } }),
      FigureImage,
      FigureVideo,
      Youtube.configure({ HTMLAttributes: { class: 'w-full aspect-video rounded-md' } }),
      Placeholder.configure({ placeholder: 'Tulis di sini…' }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert prose-h2:text-2xl sm:prose-h2:text-[1.625rem] prose-h2:mt-0 prose-h2:mb-0 prose-h3:text-xl sm:prose-h3:text-[1.375rem] prose-h3:mt-0 prose-h3:mb-0 max-w-4xl mx-auto min-h-[400px] py-4 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  useEffect(() => {
    if (editor) editor.setEditable(!disabled)
  }, [editor, disabled])

  // Tutup menu + saat kursor pindah posisi (subscribe event editor).
  useEffect(() => {
    if (!editor) return
    const close = () => setPlusOpen(false)
    editor.on('selectionUpdate', close)
    return () => {
      editor.off('selectionUpdate', close)
    }
  }, [editor])

  // Setelah sisip figure, pindahkan kursor ke caption-nya (dicari via src unik) agar
  // langsung bisa diketik & tak meninggalkan paragraf kosong ber-tombol +.
  const focusFigureCaption = (typeName: string, src: string) => {
    if (!editor) return
    let capPos: number | null = null
    editor.state.doc.descendants((n, pos) => {
      if (n.type.name === typeName && n.attrs.src === src) capPos = pos + 1
    })
    if (capPos !== null) editor.chain().setTextSelection(capPos).focus().run()
  }

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // reset agar file sama bisa dipilih lagi
    if (!file || !editor) return
    setUploading(true)
    try {
      const optimized = await compressImageToWebp(file, 1920)
      const fd = new FormData()
      fd.append('file', optimized)
      const res = await uploadMediaAction(fd, 'article-content')
      if (res.success && res.url) {
        editor.chain().focus().insertContent({ type: 'figureImage', attrs: { src: res.url } }).run()
        focusFigureCaption('figureImage', res.url)
      } else {
        alert(res.error || 'Gagal mengunggah gambar')
      }
    } catch (err) {
      console.error('Inline image upload failed:', err)
      alert('Terjadi kesalahan saat mengunggah gambar: ' + ((err as Error)?.message || 'unknown'))
    } finally {
      setUploading(false)
    }
  }

  const insertYoutube = () => setYoutubeOpen(true)

  const submitYoutube = () => {
    const url = youtubeUrl.trim()
    if (!url || !editor) {
      setYoutubeOpen(false)
      return
    }
    const embed = getEmbedUrlFromYoutubeUrl({ url })
    if (!embed) {
      alert('URL YouTube tidak valid')
      return
    }
    editor.chain().focus().insertContent({ type: 'figureVideo', attrs: { src: embed } }).run()
    focusFigureCaption('figureVideo', embed)
    setYoutubeUrl('')
    setYoutubeOpen(false)
  }

  // `image` sengaja tanpa `run` — dibuka lewat imageInputRef di onClick (ref hanya boleh
  // diakses di event handler, bukan render). Struktur data-driven → Unsplash tinggal ditambah (fase 2).
  type InsertItem = { id: string; icon: LucideIcon; label: string; run?: () => void }
  const insertItems: InsertItem[] = editor
    ? [
        { id: 'image', icon: ImageIcon, label: 'Gambar' },
        { id: 'youtube', icon: YoutubeIcon, label: 'Video', run: insertYoutube },
        { id: 'code', icon: Code2, label: 'Kode', run: () => editor.chain().focus().toggleCodeBlock().run() },
        { id: 'divider', icon: Minus, label: 'Pemisah', run: () => editor.chain().focus().setHorizontalRule().run() },
      ]
    : []

  return (
    <div className={cn('relative w-full bg-background', plusOpen && 'me-menu-open', disabled && 'opacity-50 cursor-not-allowed')}>
      <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImageFile} />

      {editor && (
        <BubbleMenu
          editor={editor}
          options={{ placement: 'top' }}
          shouldShow={({ state }) => {
            // Hanya untuk seleksi TEKS non-kosong — bukan saat node (gambar/video) terpilih.
            return state.selection instanceof TextSelection && !state.selection.empty
          }}
          className="flex items-center gap-0.5 rounded-lg bg-neutral-900 p-1 shadow-lg"
        >
          {linkMode ? (
            <form
              className="flex items-center gap-1 px-1"
              onSubmit={(e) => {
                e.preventDefault()
                if (linkUrl.trim() === '') {
                  editor.chain().focus().extendMarkRange('link').unsetLink().run()
                } else {
                  editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run()
                }
                setLinkMode(false)
              }}
            >
              <input
                autoFocus
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setLinkMode(false)
                }}
                placeholder="Tempel tautan, Enter…"
                className="w-56 bg-transparent px-2 py-1 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            </form>
          ) : (
            <>
              <BubbleBtn title="Tebal" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-4 w-4" />
              </BubbleBtn>
              <BubbleBtn title="Miring" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-4 w-4" />
              </BubbleBtn>
              <BubbleBtn title="Garis bawah" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <Underline className="h-4 w-4" />
              </BubbleBtn>
              <BubbleBtn
                title="Tautan"
                active={editor.isActive('link')}
                onClick={() => {
                  setLinkUrl(editor.getAttributes('link').href || '')
                  setLinkMode(true)
                }}
              >
                <Link2 className="h-4 w-4" />
              </BubbleBtn>
              <span className="mx-1 h-5 w-px bg-white/20" />
              <BubbleBtn
                title="Judul (H2)"
                active={editor.isActive('heading', { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                <Heading2 className="h-4 w-4" />
              </BubbleBtn>
              <BubbleBtn
                title="Subjudul (H3)"
                active={editor.isActive('heading', { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                <Heading3 className="h-4 w-4" />
              </BubbleBtn>
              <BubbleBtn title="Kutipan" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="h-4 w-4" />
              </BubbleBtn>
            </>
          )}
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          editor={editor}
          options={{ placement: 'left' }}
          shouldShow={({ editor, state }) => {
            // Dokumen kosong (mis. halaman baru dibuka) → + tampil sejak awal (tanpa perlu fokus editor).
            if (editor.isEmpty) return true
            const { $anchor, empty } = state.selection
            // Selain itu: hanya di paragraf kosong — bukan di figcaption (caption gambar/video).
            return empty && $anchor.parent.type.name === 'paragraph' && $anchor.parent.content.size === 0
          }}
          className={cn('flex items-center gap-1', plusOpen && 'rounded-full bg-background shadow-sm')}
        >
          <button
            type="button"
            title={plusOpen ? 'Tutup' : 'Sisipkan'}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setPlusOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/40 bg-background text-muted-foreground hover:border-primary hover:text-primary"
          >
            {plusOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
          {plusOpen && (
            <div className="flex items-center gap-1">
              {insertItems.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  title={it.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (it.id === 'image') imageInputRef.current?.click()
                    else it.run?.()
                    setPlusOpen(false)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-background text-primary hover:bg-primary/10"
                >
                  <it.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}
        </FloatingMenu>
      )}

      <EditorContent editor={editor} />

      {uploading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/60">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <Dialog
        open={youtubeOpen}
        onOpenChange={(o) => {
          setYoutubeOpen(o)
          if (!o) setYoutubeUrl('')
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Sisipkan Video YouTube</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="yt-url">URL YouTube</Label>
            <Input
              id="yt-url"
              autoFocus
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  submitYoutube()
                }
              }}
              placeholder="https://www.youtube.com/watch?v=…"
            />
            <p className="text-xs text-muted-foreground">Tempel tautan video, mis. youtube.com/watch?v=… atau youtu.be/…</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setYoutubeOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={submitYoutube} disabled={!youtubeUrl.trim()}>
              Sisipkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
