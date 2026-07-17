# Medium-Style Article Editor — Design Spec

**Date:** 2026-07-12
**Status:** Approved (design), pending implementation plan
**Scope:** Article writing page editor only

---

## 1. Problem & Goal

Editor Tiptap di halaman tulis artikel saat ini ([src/shared/ui/editor/TiptapEditor.tsx](../../../src/shared/ui/editor/TiptapEditor.tsx))
memakai **toolbar statis** di atas area tulis. Target: editor yang meniru pengalaman menulis **Medium**:

- Tidak ada toolbar permanen.
- **Bubble menu** (pill gelap) muncul saat teks diseleksi.
- Tombol **+** muncul di baris kosong untuk menyisipkan blok (gambar, video, code, divider, table).

Goal: editor artikel terasa "persis Medium" tanpa mengubah alur data (`value`/`onChange`) yang sudah ada, dan tanpa
menyentuh editor agenda.

---

## 2. Decisions (dari brainstorming)

| Keputusan | Pilihan |
| --- | --- |
| Tingkat kemiripan | **Full Medium clone** — toolbar statis dihapus, ganti bubble + plus menu |
| Cakupan komponen | **Artikel saja** — komponen baru khusus artikel; editor agenda (`TiptapEditor`) tidak disentuh |
| Restyle halaman/judul | **Tidak sekarang** — fokus editor; restyle judul serif = pekerjaan terpisah |
| Isi menu **+** (fase 1) | Gambar (upload), Video/YouTube, Code block, Divider, Table |
| Unsplash | **Fase 2** — struktur menu disiapkan data-driven; ditambah saat API key siap |
| Isi bubble menu | Bold, Italic, Underline, Link, Heading H2 (T besar), H3 (T kecil), Quote |

---

## 3. Architecture

### 3.1 Komponen baru
`src/shared/ui/editor/MediumEditor.tsx` — komponen client baru.

- **Interface identik** dengan `TiptapEditor`: `{ value: string; onChange: (v: string) => void; disabled?: boolean }`.
  ArticleForm cukup mengganti import (`TiptapEditor` → `MediumEditor`). Tidak ada perubahan pada state/submit ArticleForm.
- `TiptapEditor.tsx` **lama tetap ada** dan tetap dipakai `AgendaForm`. Diff terisolasi; risiko regresi agenda = nol.

### 3.2 Extensions
```
StarterKit.configure({
  link: { openOnClick: false, HTMLAttributes: { class: 'text-primary underline underline-offset-4' } },
  // underline, codeBlock, horizontalRule sudah termasuk StarterKit v3 (default aktif)
})
Image.configure({ HTMLAttributes: { class: 'rounded-md max-w-full h-auto' } })
Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: 'w-full aspect-video rounded-md' } })
Table.configure({ resizable: true }), TableRow, TableHeader, TableCell
```
Catatan: StarterKit v3 sudah membundel `underline`, `link`, `code-block`, `horizontal-rule`
(diverifikasi di `node_modules/@tiptap/starter-kit`). Link dikonfigurasi lewat opsi StarterKit
untuk menghindari double-register (kode lama meng-`import Link` terpisah — dihilangkan di komponen baru).

### 3.3 Dependency baru (npm)
- `@tiptap/extension-youtube`
- `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`

Keduanya sudah tercantum di [TECH_STACK.md](../../TECH_STACK.md) bagian Tiptap (Table, YouTube Embed) —
tidak melanggar aturan dokumentasi. Versi paket dicatat setelah install.

---

## 4. UI Components

### 4.1 BubbleMenu (`@tiptap/react/menus`)
Pill gelap dengan caret bawah, muncul saat ada seleksi teks non-kosong.

Urutan tombol: `B` · `i` · `U` · 🔗 Link │ `T`(H2, besar) · `T`(H3, kecil) · `"` Quote.

**Link inline (ala Medium):** state lokal `linkMode: boolean`.
- Klik 🔗 → isi pill diganti input teks kecil (prefill href aktif bila ada).
- Enter → `extendMarkRange('link').setLink({ href })`; kosong+Enter → `unsetLink()`; Esc → batal (kembali ke tombol).
- Tombol 🔗 aktif (highlight) saat kursor di dalam link.

Styling: `bg-neutral-900 text-white rounded-lg`, ikon `lucide-react`, tombol aktif → `bg-white/20`.
Theme-aware tidak wajib (pill selalu gelap, seperti Medium).

### 4.2 FloatingMenu (`@tiptap/react/menus`)
Muncul di baris **kosong** (paragraph tanpa isi). Menampilkan tombol **+** bulat.

- Klik **+** → `expanded` state true → deret ikon bulat muncul horizontal di sampingnya.
- Ikon (data-driven array): Gambar · YouTube · Code · Divider · Table.
- Klik ikon → jalankan aksi lalu `expanded=false`.

**Struktur data-driven** agar Unsplash mudah ditambah fase 2:
```ts
type InsertItem = { id: string; icon: LucideIcon; label: string; run: () => void }
const items: InsertItem[] = [imageItem, youtubeItem, codeItem, dividerItem, tableItem]
// fase 2: tinggal push unsplashItem
```
Styling ikon memakai token `text-primary`/`border-primary` (hijau HMI) agar konsisten light/dark,
bukan hijau Medium literal.

### 4.3 Aksi insert
| Item | Aksi |
| --- | --- |
| Gambar | Trigger hidden `<input type=file accept=image/*>` → `compressImage` → `uploadMediaAction(fd, 'article-content')` → `chain().focus().setImage({ src: url }).run()`. Loading state saat upload. |
| YouTube | Prompt/input URL kecil → parse ID → `chain().focus().setYoutubeVideo({ src }).run()` (extension menerima URL penuh). |
| Code | `chain().focus().toggleCodeBlock().run()` |
| Divider | `chain().focus().setHorizontalRule().run()` |
| Table | `chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()` |

Sisip gambar **reuse** jalur yang sama dengan `ImageUploader`:
`compressImage` ([shared/lib/image-compress.ts](../../../src/shared/lib/image-compress.ts)) +
`uploadMediaAction` ([shared/api/media/actions.ts](../../../src/shared/api/media/actions.ts)).

---

## 5. Public Rendering

Halaman baca [/artikel/[slug]](../../../src/app/(website)/artikel) sudah merender konten HTML via kelas `prose`
(`@tailwindcss/typography`). Blok baru perlu penyesuaian kecil CSS agar rapi:
- iframe YouTube → `aspect-video w-full rounded-md`.
- `<table>` → border & padding standar prose (biasanya sudah ditangani `prose`; verifikasi).
- `<hr>` → sudah ditangani prose.

Penyesuaian dilakukan di `globals.css` bila prose default belum cukup (diverifikasi saat implementasi).

---

## 6. Testing / Verification (ponytail check)

Logika murni non-trivial di fitur ini = **parsing URL YouTube → video ID/embed**.
- 1 file self-check kecil (`youtube-url.check.ts`, jalan via `npx tsx`, assert-based) menguji beberapa bentuk URL
  (`watch?v=`, `youtu.be/`, `embed/`, dengan query tambahan) → ID benar.
- Sisanya (bubble/floating menu) adalah wiring UI Tiptap → diverifikasi manual dengan menjalankan `npm run dev`
  dan menulis artikel (seleksi teks → bubble muncul; baris kosong → + muncul; tiap insert bekerja).

> Catatan: jika `@tiptap/extension-youtube` sudah menerima URL penuh di `setYoutubeVideo` dan tidak butuh
> parsing manual, helper + test parsing dihapus (YAGNI) — diputuskan saat implementasi setelah cek API extension.

---

## 7. Documentation Updates

- **CHANGELOG.md** — entri di `[Unreleased] > Added` mendeskripsikan editor artikel gaya Medium
  (bubble menu, floating + menu, blok gambar/youtube/code/divider/table).
- **TECH_STACK.md** — catat nama & versi paket `@tiptap/extension-youtube` + `@tiptap/extension-table*`
  yang benar-benar dipasang (bagian Tiptap sudah menyebut Table & YouTube secara konsep).

---

## 8. Out of Scope

- Unsplash (fase 2 — butuh API key + atribusi).
- Restyle judul serif / layout halaman tulis (pekerjaan terpisah).
- Editor agenda (tetap `TiptapEditor` lama).
- Kolaborasi real-time, slash-command menu (`/`), drag-handle reorder blok.

---

## 9. Files Touched (ringkasan)

| File | Perubahan |
| --- | --- |
| `src/shared/ui/editor/MediumEditor.tsx` | **Baru** — editor gaya Medium |
| `src/shared/lib/youtube-url.ts` + `.check.ts` | **Baru** (opsional, lihat §6) — parse URL YouTube |
| `src/features/articles/ui/ArticleForm.tsx` | Ganti import `TiptapEditor` → `MediumEditor` |
| `src/app/globals.css` | CSS prose untuk iframe/table (bila perlu) |
| `package.json` | +2 kelompok dependency Tiptap |
| `docs/CHANGELOG.md`, `docs/TECH_STACK.md` | Update dokumentasi |
