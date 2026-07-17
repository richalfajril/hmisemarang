# Medium-Style Article Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ganti editor artikel dari toolbar statis menjadi editor gaya Medium (bubble menu saat seleksi + tombol `+` di baris kosong untuk menyisipkan gambar/YouTube/code/divider/table).

**Architecture:** Komponen baru `MediumEditor.tsx` dengan interface identik `TiptapEditor` (`value`/`onChange`/`disabled`), dipakai `ArticleForm` saja. `TiptapEditor.tsx` lama tetap untuk agenda. BubbleMenu & FloatingMenu dari `@tiptap/react/menus`. Sisip gambar reuse `compressImageToWebp` + `uploadMediaAction`.

**Tech Stack:** Next.js App Router (client component), React 19, Tiptap v3 (`@tiptap/react`, StarterKit, extension-image, +extension-youtube, +extension-table\*), Tailwind v4, lucide-react.

## Global Constraints

- **Commit policy:** JANGAN commit/push otomatis. Langkah "Checkpoint" hanya di-commit bila user meminta eksplisit. (Preferensi user — override template writing-plans.)
- **FSD boundaries:** editor = `shared/ui/editor/`; upload reuse `shared/api/media/actions.ts` + `shared/lib/image-compress.ts`. Jangan buat helper baru yang sudah ada.
- **Dependency:** hanya `@tiptap/extension-youtube` + `@tiptap/extension-table` (+ row/cell/header bila paket terpisah). Sudah didokumentasikan di `docs/TECH_STACK.md` bagian Tiptap. Tidak menambah dependency lain.
- **No new pure-logic helper unless needed:** `Youtube.setYoutubeVideo({ src })` menerima URL penuh → TIDAK perlu parser ID (YAGNI). Verifikasi di Task 4; hanya buat parser + self-check jika ternyata butuh ID.
- **Interface stabil:** `MediumEditor` props = `{ value: string; onChange: (v: string) => void; disabled?: boolean }`. Output tetap HTML via `editor.getHTML()` — kontrak submit ArticleForm tidak berubah.
- **SEO:** heading konten = H2/H3 saja (judul artikel sudah H1 terpisah). Bubble menu TIDAK menyediakan H1.

---

### Task 1: Dependencies + MediumEditor skeleton (extensions, tanpa menu)

**Files:**
- Create: `src/shared/ui/editor/MediumEditor.tsx`
- Modify: `src/features/articles/ui/ArticleForm.tsx:12` (ganti import) dan `:123` (ganti komponen)
- Modify: `package.json` (via npm install)

**Interfaces:**
- Produces: `MediumEditor({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean })` — default export? Tidak: named export `MediumEditor` (konsisten dgn `TiptapEditor`).

- [ ] **Step 1: Install dependency Tiptap**

Run:
```bash
npm install @tiptap/extension-youtube @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header
```
Expected: 5 paket terpasang (versi mengikuti mayor `@tiptap/*` yang ada, ~3.27).

- [ ] **Step 2: Verifikasi nama export table**

Run:
```bash
node -e "const t=require('@tiptap/extension-table'); console.log(Object.keys(t))"
node -e "console.log(Object.keys(require('@tiptap/extension-youtube')))"
```
Expected: melihat export `Table` (dan/atau `TableKit`), `Youtube`. Jika `@tiptap/extension-table` mengekspor `TableKit` (bundel row/cell/header), gunakan itu dan lewati 3 paket terpisah. Catat hasilnya untuk dipakai di Step 3.

- [ ] **Step 3: Tulis MediumEditor.tsx (skeleton — extensions + EditorContent, belum ada menu)**

```tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { cn } from '@/shared/lib/utils'

interface MediumEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function MediumEditor({ value, onChange, disabled }: MediumEditorProps) {
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
      Youtube.configure({ HTMLAttributes: { class: 'w-full aspect-video rounded-md' } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none min-h-[400px] py-4 focus:outline-none',
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

  return (
    <div className={cn('w-full bg-background', disabled && 'opacity-50 cursor-not-allowed')}>
      <EditorContent editor={editor} />
    </div>
  )
}
```
Catatan: `StarterKit` v3 sudah membundel underline, link, code-block, horizontal-rule (diverifikasi). `link` dikonfigurasi via opsi StarterKit — jangan `import Link` terpisah (double-register). `immediatelyRender: false` wajib untuk Next SSR.

- [ ] **Step 4: Ganti editor di ArticleForm**

Di `src/features/articles/ui/ArticleForm.tsx`:
- Baris 12: `import { TiptapEditor } from '@/shared/ui/editor/TiptapEditor'` → `import { MediumEditor } from '@/shared/ui/editor/MediumEditor'`
- Baris 123: `<TiptapEditor` → `<MediumEditor` (props `value`/`onChange`/`disabled` tetap sama).

- [ ] **Step 5: Typecheck & lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: tanpa error. (Jika `Table`/`Youtube` import salah nama, perbaiki sesuai Step 2.)

- [ ] **Step 6: Verifikasi manual editor render**

Run: `npm run dev`, buka `/dashboard/articles/create`, ketik beberapa paragraf.
Expected: area tulis muncul (tanpa toolbar atas), teks tersimpan ke state (cek preview/submit tak error). Belum ada bubble/plus menu — itu Task 2-4.

- [ ] **Step 7: Checkpoint** (commit hanya bila user minta)

```bash
git add src/shared/ui/editor/MediumEditor.tsx src/features/articles/ui/ArticleForm.tsx package.json package-lock.json
git commit -m "feat(editor): add MediumEditor skeleton with tiptap table/youtube extensions"
```

---

### Task 2: BubbleMenu (seleksi teks)

**Files:**
- Modify: `src/shared/ui/editor/MediumEditor.tsx`

**Interfaces:**
- Consumes: `editor` dari `useEditor` (Task 1).
- Produces: komponen internal `<BubbleMenu>` + state link inline. Tidak diekspor.

- [ ] **Step 1: Tambah import menu & ikon**

Di `MediumEditor.tsx` tambahkan:
```tsx
import { BubbleMenu } from '@tiptap/react/menus'
import { useState } from 'react'
import { Bold, Italic, Underline, Link2, Heading2, Heading3, Quote } from 'lucide-react'
```

- [ ] **Step 2: Tambah tombol bubble helper (di dalam file, sebelum export MediumEditor)**

```tsx
function Btn({
  active, onClick, disabled, children, title,
}: {
  active?: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode; title: string
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
```
Catatan: `onMouseDown preventDefault` mencegah seleksi hilang saat klik tombol.

- [ ] **Step 3: Render BubbleMenu di dalam MediumEditor (sebelum `</div>` penutup)**

Tambahkan state di awal komponen: `const [linkMode, setLinkMode] = useState(false)` dan `const [linkUrl, setLinkUrl] = useState('')`.

Sisipkan (setelah guard `editor &&`):
```tsx
{editor && (
  <BubbleMenu
    editor={editor}
    options={{ placement: 'top' }}
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
          onKeyDown={(e) => { if (e.key === 'Escape') setLinkMode(false) }}
          placeholder="Tempel tautan, Enter…"
          className="w-56 bg-transparent px-2 py-1 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
      </form>
    ) : (
      <>
        <Btn title="Tebal" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
        <Btn title="Miring" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
        <Btn title="Garis bawah" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline className="h-4 w-4" /></Btn>
        <Btn title="Tautan" active={editor.isActive('link')} onClick={() => { setLinkUrl(editor.getAttributes('link').href || ''); setLinkMode(true) }}><Link2 className="h-4 w-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-white/20" />
        <Btn title="Judul (H2)" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
        <Btn title="Subjudul (H3)" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
        <Btn title="Kutipan" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
      </>
    )}
  </BubbleMenu>
)}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: tanpa error. (Jika `toggleUnderline` tak dikenal, pastikan underline aktif di StarterKit — v3 default aktif; jika perlu tambahkan `import Underline from '@tiptap/extension-underline'` ke extensions.)

- [ ] **Step 5: Verifikasi manual bubble menu**

`npm run dev` → `/dashboard/articles/create` → ketik teks, seleksi sebagian.
Expected: pill hitam muncul di atas seleksi. Bold/Italic/Underline mengubah teks; H2/H3/Quote mengubah blok; klik Tautan → input muncul, tempel URL + Enter → teks jadi link; Esc membatalkan.

- [ ] **Step 6: Checkpoint** (commit bila diminta)

```bash
git add src/shared/ui/editor/MediumEditor.tsx
git commit -m "feat(editor): add Medium-style bubble menu with inline link input"
```

---

### Task 3: FloatingMenu (tombol + di baris kosong) + insert non-gambar

**Files:**
- Modify: `src/shared/ui/editor/MediumEditor.tsx`

**Interfaces:**
- Consumes: `editor` (Task 1).
- Produces: array data-driven `insertItems` (siap ditambah Unsplash fase 2), tombol `+` yang expand.

- [ ] **Step 1: Tambah import**

```tsx
import { FloatingMenu } from '@tiptap/react/menus'
import { Plus, ImageIcon, Youtube as YoutubeIcon, Code2, Minus, Table as TableIcon } from 'lucide-react'
```

- [ ] **Step 2: Tambah state expand di komponen**

`const [plusOpen, setPlusOpen] = useState(false)`

- [ ] **Step 3: Definisikan insertItems (di dalam komponen, setelah editor siap)**

```tsx
const insertYoutube = () => {
  const url = window.prompt('URL YouTube:')
  if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run()
}
const insertItems = editor
  ? [
      { id: 'image', icon: ImageIcon, label: 'Gambar', run: () => imageInputRef.current?.click() },
      { id: 'youtube', icon: YoutubeIcon, label: 'Video', run: insertYoutube },
      { id: 'code', icon: Code2, label: 'Kode', run: () => editor.chain().focus().toggleCodeBlock().run() },
      { id: 'divider', icon: Minus, label: 'Pemisah', run: () => editor.chain().focus().setHorizontalRule().run() },
      { id: 'table', icon: TableIcon, label: 'Tabel', run: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    ]
  : []
```
Catatan: `imageInputRef` didefinisikan di Task 4; untuk Task 3, item `image` boleh sementara `run: () => {}` lalu diisi di Task 4. `setYoutubeVideo` menerima URL penuh (verifikasi Task 4 Step 4).

- [ ] **Step 4: Render FloatingMenu (sebelum `</div>` penutup)**

```tsx
{editor && (
  <FloatingMenu
    editor={editor}
    options={{ placement: 'left-start' }}
    className="flex items-center gap-1"
  >
    {plusOpen ? (
      <div className="flex items-center gap-1">
        {insertItems.map((it) => (
          <button
            key={it.id}
            type="button"
            title={it.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { it.run(); setPlusOpen(false) }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary hover:bg-primary/10"
          >
            <it.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    ) : (
      <button
        type="button"
        title="Sisipkan"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setPlusOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" />
      </button>
    )}
  </FloatingMenu>
)}
```

- [ ] **Step 5: Reset plusOpen saat seleksi pindah**

Tambahkan effect: `useEffect(() => { setPlusOpen(false) }, [editor?.state.selection.from])` — agar menu menutup saat kursor pindah baris. (Jika lint mengeluh soal dependency, gunakan `editor` + baca `.state.selection.from` di dalam.)

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: tanpa error (item `image` sementara no-op sampai Task 4).

- [ ] **Step 7: Verifikasi manual**

`npm run dev` → baris kosong baru → tombol `+` muncul di kiri. Klik → deret ikon. Kode/Pemisah/Tabel/Video bekerja. (Gambar diisi Task 4.)

- [ ] **Step 8: Checkpoint** (commit bila diminta)

```bash
git add src/shared/ui/editor/MediumEditor.tsx
git commit -m "feat(editor): add floating + menu with code/divider/table/youtube inserts"
```

---

### Task 4: Sisip gambar (upload Cloudinary) + verifikasi YouTube API

**Files:**
- Modify: `src/shared/ui/editor/MediumEditor.tsx`

**Interfaces:**
- Consumes: `compressImageToWebp(file, maxDimension)` dari `@/shared/lib/image-compress`; `uploadMediaAction(formData, folder)` dari `@/shared/api/media/actions` (return `{ success, url, publicId }`).

- [ ] **Step 1: Tambah import & ref**

```tsx
import { useRef } from 'react'
import { compressImageToWebp } from '@/shared/lib/image-compress'
import { uploadMediaAction } from '@/shared/api/media/actions'
import { Loader2 } from 'lucide-react'
```
Di komponen: `const imageInputRef = useRef<HTMLInputElement>(null)` dan `const [uploading, setUploading] = useState(false)`.

- [ ] **Step 2: Handler upload**

```tsx
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
      editor.chain().focus().setImage({ src: res.url }).run()
    } else {
      alert(res.error || 'Gagal mengunggah gambar')
    }
  } catch {
    alert('Terjadi kesalahan saat mengunggah gambar')
  } finally {
    setUploading(false)
  }
}
```

- [ ] **Step 3: Isi `run` item image + render hidden input + overlay loading**

Ubah item `image` di `insertItems` (Task 3 Step 3): `run: () => imageInputRef.current?.click()`.

Tambahkan (di dalam wrapper `<div>`):
```tsx
<input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImageFile} />
{uploading && (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/60">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
)}
```
Tambahkan `relative` ke className wrapper `<div>` agar overlay terposisi benar.

- [ ] **Step 4: Verifikasi API setYoutubeVideo (keputusan parser)**

Cek dokumentasi/def:
```bash
grep -rE "setYoutubeVideo|getEmbedUrl|src" node_modules/@tiptap/extension-youtube/dist/index.d.ts | head
```
Expected: `setYoutubeVideo({ src })` menerima URL penuh (extension mem-parse internal). Jika BENAR → tidak perlu parser (sesuai Global Constraints). Jika ternyata butuh ID mentah, buat `src/shared/lib/youtube-url.ts` (`export function toYoutubeEmbedId(url: string): string | null`) + `youtube-url.check.ts` (assert-based, `npx tsx`) menguji `watch?v=`, `youtu.be/`, `embed/`, query tambahan; lalu pakai di `insertYoutube`.

- [ ] **Step 5: Typecheck & lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: tanpa error.

- [ ] **Step 6: Verifikasi manual gambar**

`npm run dev` → `+` → Gambar → pilih file → spinner → gambar tersisip. Submit artikel → cek `content` berisi `<img src="https://res.cloudinary...">`.

- [ ] **Step 7: Checkpoint** (commit bila diminta)

```bash
git add src/shared/ui/editor/MediumEditor.tsx
git commit -m "feat(editor): inline image upload via Cloudinary in floating menu"
```

---

### Task 5: Public rendering (prose) + dokumentasi

**Files:**
- Modify: `src/app/globals.css` (bila perlu)
- Modify: `docs/CHANGELOG.md`, `docs/TECH_STACK.md`

- [ ] **Step 1: Verifikasi rendering publik**

Buat/publish 1 artikel berisi YouTube + table + divider + gambar (via Task 1-4). Buka halaman baca `/artikel/[slug]`.
Expected: iframe YouTube tampil responsif, table ada border, divider tampil, gambar tampil.

- [ ] **Step 2: Tambah CSS bila prose belum cukup**

Jika iframe YouTube tidak responsif atau table tanpa border, tambahkan di `globals.css` (dalam layer yang sesuai):
```css
.prose iframe { width: 100%; aspect-ratio: 16 / 9; border-radius: 0.5rem; }
.prose table { width: 100%; border-collapse: collapse; }
.prose th, .prose td { border: 1px solid hsl(var(--border)); padding: 0.5rem 0.75rem; }
```
Jika prose default sudah cukup, LEWATI step ini (YAGNI).

- [ ] **Step 3: Update CHANGELOG**

Di `docs/CHANGELOG.md` bagian `[Unreleased] > Added`, tambahkan entri (tanggal 2026-07-12): editor artikel gaya Medium — bubble menu (bold/italic/underline/link inline/H2/H3/quote), floating `+` menu (gambar upload Cloudinary, YouTube embed, code block, divider, table). Komponen `MediumEditor` khusus artikel; agenda tetap `TiptapEditor`. Dependency baru `@tiptap/extension-youtube`, `@tiptap/extension-table*`.

- [ ] **Step 4: Update TECH_STACK**

Di `docs/TECH_STACK.md` bagian Tiptap, catat nama & versi paket yang terpasang (`@tiptap/extension-youtube@x.y.z`, `@tiptap/extension-table@x.y.z` dst) di bawah daftar Extensions.

- [ ] **Step 5: Verifikasi akhir**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: build sukses tanpa error.

- [ ] **Step 6: Checkpoint** (commit bila diminta)

```bash
git add src/app/globals.css docs/CHANGELOG.md docs/TECH_STACK.md
git commit -m "docs+style: Medium editor public rendering polish and changelog"
```

---

## Self-Review

**Spec coverage:**
- §3.1 komponen baru artikel-saja → Task 1 ✅
- §3.2 extensions (underline/link via StarterKit, image/youtube/table) → Task 1 ✅
- §3.3 dependency baru → Task 1 Step 1 + Task 5 doc ✅
- §4.1 BubbleMenu + link inline → Task 2 ✅
- §4.2 FloatingMenu data-driven + Unsplash-ready → Task 3 (`insertItems` array) ✅
- §4.3 aksi insert (gambar/youtube/code/divider/table) → Task 3 + Task 4 ✅
- §5 public rendering prose → Task 5 ✅
- §6 verification (manual + parser opsional) → Task 4 Step 4, tiap task punya verifikasi manual ✅
- §7 docs → Task 5 ✅

**Placeholder scan:** Item `image` sengaja no-op di Task 3 lalu diisi Task 4 — didokumentasikan eksplisit, bukan placeholder tersembunyi. Parser YouTube kondisional dgn kriteria jelas (Task 4 Step 4). Tidak ada TBD/TODO menggantung.

**Type consistency:** `MediumEditor` props konsisten seluruh task; `insertItems` shape (`{id,icon,label,run}`) sama di Task 3 & 4; `compressImageToWebp`/`uploadMediaAction` sesuai signature terverifikasi; `setYoutubeVideo({src})` konsisten.

## Execution Handoff

Setelah plan disimpan, pilih mode eksekusi (lihat pesan berikut).
