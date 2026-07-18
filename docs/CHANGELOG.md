# CHANGELOG.md

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## [Unreleased]

### Added

#### Keterangan (Caption) Gambar Utama Artikel (2026-07-18)
* Kolom baru **`featured_image_caption String?`** di tabel `articles` (via `prisma db push`, DATABASE_SCHEMA.md diperbarui) + `featured_image_caption` di `articleSchema` (`z.string().max(255).optional().nullable()`), dibaca & disimpan `saveArticleDraftAction` (create & update).
* **Input caption inline gaya Medium** di `ArticleForm` — muncul tepat di bawah preview gambar utama (rata tengah, italic, placeholder "Tambahkan keterangan gambar (opsional)"), reaktif ke state, opsional.
* **Render publik**: `<figcaption>` di bawah cover artikel (`/artikel/[slug]`) bila caption terisi; juga dipakai sebagai `alt` gambar. `PublicArticleDetail` + select `getArticleBySlug` menambah field ini (opsional agar fallback dummy tak berubah).

### Changed

#### Kutipan Artikel Pakai Times New Roman Italic (2026-07-18)
* CSS `.prose blockquote` (+ turunannya) di globals.css — kutipan/blockquote konten artikel dirender **Times New Roman, regular (400), italic** di editor & halaman baca. Selector ke turunan memaksa bold penulis di dalam kutipan ikut regular.

#### Warna Body + Heading Konten Artikel Jadi Hitam Pekat (2026-07-18)
* CSS `html:not(.dark) .prose { --tw-prose-body: #000000; --tw-prose-headings: #000000 }` (globals.css) — teks body & heading konten artikel di editor & halaman baca (`/artikel/[slug]`) jadi hitam pekat pada mode terang. Mode gelap tetap pakai `prose-invert` (tidak disentuh). Link tak diubah.

#### Jarak Antar Item Daftar Artikel Dirapatkan (2026-07-18)
* CSS `.prose :is(ol,ul) > li` & `.prose li > p` (globals.css) — jarak antar item daftar bernomor/bullet di konten artikel dikurangi jadi ≈ sepertiga default typography (li 0.5em→0.167em, paragraf dalam li 0.75em→0.25em). Berlaku di editor & halaman baca (`/artikel/[slug]`).

#### Editor Artikel: Judul Auto-Tinggi + Preview Gambar (2026-07-18)
* **Judul artikel** di `ArticleForm` diubah dari `<Input>` (satu baris, scroll horizontal) → `<textarea>` auto-tinggi (`rows=1` + `resize-none overflow-hidden`, tinggi menyesuaikan `scrollHeight` saat mount & `onInput`). Teks judul panjang kini menambah baris ke bawah, bukan scroll ke samping. `name="title"` & kontrak submit tak berubah.
* **Gambar Artikel** (featured image) yang berhasil diunggah via uploader (panel kanan) kini juga tampil sebagai **pratinjau di editor, tepat di bawah judul** (aspect-video, `next/image`, gaya cover Medium). Reaktif terhadap state `featuredImage` — unggah/ganti/hapus langsung terlihat.

#### Banner Error Form Menyebut Field yang Gagal (2026-07-18)
* Banner error di `ArticleForm` & `AgendaForm` kini menampilkan baris **"Periksa: <field>"** (mis. "Periksa: Isi Artikel, Kategori") dari `state.fieldErrors`, dipetakan ke label ramah-pengguna. Sebelumnya hanya pesan umum "Gagal memvalidasi form…" sehingga user tak tahu field mana yang salah padahal terasa "sudah terisi semua" (penyebab tersering: isi artikel < 50 karakter atau kategori belum dipilih). Pesan inline per-field tetap ada.

### Added

#### Modal Konfirmasi Hapus (Global) (2026-07-18)
* **`ConfirmProvider` + `useConfirm()`** (`shared/ui/ConfirmDialog.tsx`) — pengganti `window.confirm` bawaan browser berbasis Promise (`await confirm({ title, description, confirmText?, cancelText?, variant? })` → `boolean`). Reuse `Dialog` yang ada; varian `destructive` (default, tombol merah + ikon Trash2) & `default` (tombol primer + ikon peringatan). Provider dipasang sekali di `Providers` (`shared/lib/QueryProvider.tsx`) → tersedia di seluruh CMS.
* **Semua 13 konfirmasi native diganti** modal UI: hapus artikel/agenda/testimoni/dokumen/album/foto/akun komisariat/jabatan/pengurus, plus arsip massal artikel & agenda dan ajukan-review artikel & agenda. Situs berbasis `<form action>` (akun komisariat, jabatan, pengurus) diubah ke tombol `type="button"` → `await confirm()` lalu `form.requestSubmit()` (menangkap `closest('form')` sebelum `await`). `DeletePeriodModal` yang sudah ada dibiarkan (pola modal per-item tersendiri).

#### Editor Artikel Gaya Medium (2026-07-12)
* **Editor baru khusus artikel** `MediumEditor` (`shared/ui/editor/MediumEditor.tsx`) menggantikan toolbar statis di halaman tulis artikel. `ArticleForm` beralih dari `TiptapEditor` → `MediumEditor` (interface `value`/`onChange`/`disabled` sama, kontrak submit tak berubah). **Editor agenda tetap `TiptapEditor`** (tak disentuh).
* **BubbleMenu** (pill gelap saat seleksi teks): Bold, Italic, Underline, Link (input inline — Enter apply, Esc batal), Heading H2 (T besar), H3 (T kecil), Blockquote. Heading dibatasi H2/H3 (judul artikel sudah H1 — aturan 1 h1/halaman).
* **FloatingMenu** (tombol `+` di baris kosong, data-driven agar mudah ditambah): sisip **Gambar** (upload Cloudinary via `compressImageToWebp` + `uploadMediaAction`, folder `article-content`, overlay loading), **Video/YouTube** (embed, `Youtube.setYoutubeVideo` mem-parse URL penuh), **Code block**, **Divider** (horizontal rule). Tombol toggle `+ ↔ ×`; saat menu terbuka, placeholder disembunyikan (class `me-menu-open`) agar tak tumpang-tindih ikon.
* **Placeholder** "Tulis di sini…" (`@tiptap/extension-placeholder`) di baris kosong + CSS `.tiptap .is-empty::before` (globals.css). Kolom tulis `max-w-3xl` (= lebar kolom baca `/artikel/[slug]`, WYSIWYG). Tombol `+` placement `left` (sejajar baris teks) dan toggle `+ ↔ ×`.
* **Judul artikel gaya Medium**: field `title` dipindah dari panel metadata → **di atas editor** (kolom tulis), besar `text-4xl font-heading` borderless, placeholder "Judul Artikel". Satu field `name="title"` (submit tak berubah).
* **Caption gambar & video** (`FigureImage` + `FigureVideo`, custom Tiptap node): media disisip sebagai `<figure>…<figcaption/></figure>` dengan keterangan yang bisa diketik + placeholder ("Ketik keterangan gambar/video (opsional)") via React NodeView (CSS `.is-caption-empty::before`). Video: URL YouTube → embed via `getEmbedUrlFromYoutubeUrl`, iframe 16:9. Rendering publik via `prose` (figcaption rata tengah; kosong → disembunyikan). Konten `<img>`/youtube lama tetap didukung.
* **Modal embed YouTube**: `window.prompt` diganti komponen `Dialog` (input URL + Batal/Sisipkan).
* **Skala tipografi konsisten editor ↔ baca** (WYSIWYG): H1 28/32px, H2 24/26px, H3 20/22px, body 18px (mobile/desktop); margin heading H2/H3 = 0 (tanpa gap "enter", hanya body yang berspasi).
* **Dependency baru**: `@tiptap/extension-youtube@^3.27.1`, `@tiptap/extension-placeholder@^3.27.1`. Underline/Link/CodeBlock/HorizontalRule sudah dari StarterKit v3. Pin ke 3.27.1 agar cocok peer `@tiptap/core`. (Table tidak dipakai — dihapus atas permintaan.)
* **Rendering publik**: `.prose iframe` (globals.css) → embed YouTube responsif 16:9 di `/artikel/[slug]`.
* Unsplash: **fase 2** (struktur menu `+` sudah data-driven, tinggal tambah 1 entri saat API key siap).

#### Edit Akun Komisariat (2026-07-04)
* Aksi **Edit Nama & Username** di modul Komisariat (`CommissariatAccountTable` dropdown → `EditAccountModal`). `updateCommissariatAccountAction`: validasi + cek username unik (exclude self); username berubah → update email login sintetis di Supabase (`updateUserById`, `email_confirm`); nama disinkronkan ke `Commissariat` tertaut (slug tetap → URL publik stabil). Password tidak berubah.

#### Modul Universitas + Impor Excel (2026-07-04)
* **Universitas jadi modul sendiri** — dipindah dari tab Taksonomi ke `/dashboard/universities` (item sidebar baru, ADMIN_CABANG). CRUD reuse komponen taksonomi (`TaxonomyTable`/`CreateTaxonomyModal` `type="UNIVERSITY"`). Tab "Universitas" dihapus dari halaman Taksonomi.
* **Impor Excel** kolom tunggal `Nama Kampus` (`importUniversitiesAction`) — slugify + dedup by slug (existing + dalam-batch), lewati yang sudah ada. Ringkasan created + skipped.
* **Refactor**: helper parsing Excel murni (`normHeader`, `pickField`) dipindah ke `shared/lib/xlsx-helpers.ts` (dipakai import komisariat/pengurus/universitas). `organization/api/import-helpers.ts` re-export dari shared.

#### Impor Pengurus via Excel (2026-07-04)
* **Import Excel per periode** di `/dashboard/organization/periods/[id]` (tombol "Impor Pengurus (Excel)" samping "Tambah Pengurus"). Action `importBoardMembersAction(period_id, file)` — baca `.xlsx/.xls` (SheetJS), buat `BoardMember` massal. Kolom: `Foto_URL`, `Nama_Lengkap`*, `Jabatan`*, `Asal_Komisariat`, `Asal_Kampus`, `Bio`, `URL_Instagram`, `URL_TikTok`, `URL_X`, `URL_Linkedin` (header dinormalisasi — spasi/underscore/titik diabaikan).
* **Aturan**: Jabatan tidak dikenal → **Position baru auto-dibuat** (`layout_type: LAINNYA`, `sort_order` di akhir). Kampus/Komisariat **dicocokkan case-insensitive** ke master; tidak ketemu → dikosongkan (universitas tak pernah auto-dibuat). **Duplikat** (nama + jabatan sama di periode) → dilewati (aman untuk import ulang). Foto via URL (bukan unggah file). Social links dari 4 kolom URL (`X` → platform `twitter`).
* Helper murni `import-helpers.ts` (`pickField`, `buildSocialLinks`) + self-check `import-helpers.check.ts` (`npx tsx`). Ringkasan hasil: jumlah dibuat + daftar baris dilewati beserta alasan.

#### E2E Playwright + Perf fixes + fix h1 SEO (2026-07-03)
* **Playwright E2E** (`@playwright/test`, dev dep — future scope TECH_STACK): `playwright.config.ts` (webServer auto-start dev, baseURL env), `e2e/public-smoke.spec.ts` (9 route publik → 200 + `<h1>` + detail 404), `e2e/auth.spec.ts` (unauth `/dashboard` → `/login`, login valid → dashboard, login salah → tetap login). Kredensial via env (`E2E_ADMIN_USER/PASS`, di `.env` gitignored). Script `npm run test:e2e`.
* **Fix SEO/a11y — `<h1>` per halaman**: E2E menemukan halaman ber-`PageHero` (struktur, artikel, agenda, komisariat, galeri, dokumen, profil) + kontak **tidak punya `<h1>`** (heading = `<h2>` dari SectionHeader). `SectionHeader{Center,Left}` diberi prop `as` (default `h2`); `PageHero` & kontak render heading utama sebagai `h1`. Smoke 10/10 lolos.
* **Perf (Lighthouse)**: `browserslist` modern (drop ~14 KiB legacy JS polyfill), preconnect + dns-prefetch `res.cloudinary.com`, `viewport`/`themeColor` di root layout.

#### Bulk Archive + Orphan Media Scanner + Analytics (2026-07-03)
* **Bulk Archive** (backlog): checkbox pilih massal + toolbar "Arsipkan (N)" di `ArticleList` & `AgendaList`. Action `bulkArchive{Articles,Agendas}Action(ids)` — soft-delete (`deleted_at`) via `updateMany`, scoped (KOMISARIAT hanya miliknya, CABANG semua), audit log + revalidate. Reversibel (bukan hard delete).
* **Orphan Media Cleanup — scanner READ-ONLY** (backlog, best-practice): `/dashboard/media-cleanup` (ADMIN_CABANG). `scanOrphanMediaAction` — list aset Cloudinary (`listCloudinaryImages`, Admin API paginated) vs semua referensi DB (field `*_url` semua tabel + parse HTML `Article.content`/`Agenda.description` untuk gambar inline Tiptap). Diff → aset yatim. **Pengaman**: grace 7 hari (skip aset baru), read-only (tombol hapus sengaja belum ada), skip resource `raw`/dokumen. Panel: ringkasan + grid thumbnail orphan. Nav sidebar baru.
* **Vercel Web Analytics + Speed Insights** (`@vercel/analytics`, `@vercel/speed-insights`) di `app/layout.tsx` — wajib di-enable di dashboard Vercel.
* **`loading.tsx`** skeleton (streaming) di 9 route publik (list + detail) via `PageSkeleton` reusable → navigasi terasa instan (skeleton dulu, konten menyusul).

#### Halaman Detail Agenda `/agenda/[slug]` (2026-07-02)
* Dari 404 → halaman detail: flyer (4:5) + badge status, judul, komisariat, short_description, kartu info (tanggal `formatAgendaDate`, jam, lokasi, countdown), tombol "Lihat Lokasi" (`location_url`), deskripsi HTML (Tiptap) via `prose`, "Agenda Lainnya" (reuse `AgendaGridCard`, di-export). `getAgendaBySlug` + `generateMetadata` (title/desc/OG flyer) + `notFound()`.
* `sitemap.ts` kini juga listing URL agenda published (`/agenda/[slug]`).

#### SEO Teknis: sitemap, robots, OpenGraph, JSON-LD (2026-07-02)
* **`app/sitemap.ts`** (ISR 1 jam): 9 halaman statis + semua artikel published (`/artikel/[slug]`). **`app/robots.ts`**: allow all, disallow `/dashboard/ /login /api/`, tunjuk sitemap + host.
* **Metadata global** (`(website)/layout.tsx`): `metadataBase` (root, `SITE_URL`), judul kaya keyword ("HMI Cabang Semarang — Himpunan Mahasiswa Islam Cabang Semarang"), `keywords` (HMI Semarang dll), **OpenGraph** (type/locale id_ID/siteName/image hero-logo) + **Twitter card** + `robots index/follow` + favicon dari settings. `<html lang="id">`.
* **JSON-LD `Organization`** (schema.org) di layout publik: name + alternateName "HMI Semarang", url, logo, email, address, sameAs (instagram) → sinyal brand/knowledge panel Google.
* **Description per-halaman** (struktur, komisariat, dokumen, agenda, galeri, artikel, kontak, profil) ber-keyword "HMI Semarang".
* Config baru `SITE_URL` + `SITE_KEYWORDS` (`widgets/public-layout/config/site.ts`, override via `NEXT_PUBLIC_SITE_URL`).

#### Halaman Baca Artikel `/artikel/[slug]` (gaya Medium) (2026-07-02)
* Dari ComingSoon → halaman baca clean: kolom sempit `max-w-[720px]`, konten HTML Tiptap via `prose` (dep baru **`@tailwindcss/typography`**, didaftarkan di `globals.css`).
* Header: kategori chip → judul → excerpt → baris penulis (avatar + nama · tanggal · waktu baca · view) + share. **Cover contained** (rounded, selebar kolom). Tags di bawah konten.
* **Reading progress bar** (garis emerald atas, `ReadingProgressBar`).
* **Share** (`ShareButtons`): WhatsApp, X, Facebook, Salin Link. (Instagram Story di-skip — tidak ada web-share resmi.)
* **Artikel Terkait**: 3 kartu kategori sama (fallback terbaru) via `getRelatedArticles`, reuse `ArticleCard`.
* **View count**: `incrementArticleView` dipanggil saat halaman dibuka → `view_count` naik → section "Terpopuler" jadi nyata. `generateMetadata` (title/description/OG) per artikel. `getArticleBySlug` (+notFound bila tidak ada/belum published).

#### Komponen `PageHero` (band emerald) untuk halaman publik (2026-07-02)
* **`shared/ui/PageHero.tsx`** (baru): hero band emerald gradient + diamond, berisi breadcrumb (putih) + section header `inverted` (prop `align: center|left`, `cta` opsional) + slot `children` per-halaman. Navbar-seam putih hilang; halaman jadi seragam & branded.
* Diterapkan ke **`/struktur-organisasi`** (align center; period switcher dropdown+arrow masuk slot children), **`/artikel`** (center), **`/dokumen`** (center; title/desc dipindah dari `PublicDocumentTable` ke hero, search tetap di toolbar tabel). **`/kontak` dikecualikan** (punya layout split-card emerald sendiri).

#### Halaman Publik Artikel (`/artikel`) (2026-07-02)
* `Article.view_count Int @default(0)` (buat urut terpopuler; increment nanti saat detail artikel dibangun — sementara popular fallback ke terbaru).
* Query publik `features/articles/api/public-queries.ts`: `getLatestArticles` (bento), `getPopularArticles` (order view_count desc), `getAllPublicArticles` (list) + `ARTICLE_FALLBACK` + `reading_time` (dari konten). Semua graceful `[]`.
* Halaman `/artikel` (dari ComingSoon): **(1)** breadcrumb, **(2)** SectionHeaderCenter, **(3)** bento artikel terbaru (reuse `FeaturedCarousel` + secondary cards), **(4)** carousel infinite "Terpopuler", **(5)** daftar semua artikel (grid + pagination 10 client). ISR 300s. FadeIn stagger.
* Komponen reusable `features/articles/ui`: `ArticleCard`, `PopularCarousel` (rAF marquee), `ArticleListGrid`, `ArticleBento`.

#### Auth Username + Modul Komisariat & LPP + Ganti Password (2026-07-01)
* **Login berbasis Username** (semua akun): `User` tambah kolom `username @unique` + `name`. `loginAction` cari user by username → ambil email → `signInWithPassword` (Supabase Auth tetap berbasis email di balik layar). `loginSchema`/`LoginForm` field Email → **Username**. Backfill username user lama (= prefix email) via script one-time.
* **Modul baru "Komisariat & LPP"** (`/dashboard/commissariat-accounts`, ADMIN_CABANG only): kelola akun `ADMIN_KOMISARIAT` (komisariat + LPP jadi satu role). **Impor Excel massal** (dep baru **`xlsx`/SheetJS**, dicatat di `TECH_STACK.md`) kolom `No`, `Nama_Komisariat`, `Username` → tiap baris buat akun (email sintetis `<username>@hmisemarang.local`, **password default `123456`**, `name`=Nama_Komisariat, link `commissariat_id` bila nama cocok). Dedup username (DB + intra-batch), lapor baris di-skip. Aksi: reset password ke default, hapus akun. Nav sidebar item baru.
* **Ganti Password** (`features/auth`): `changePasswordAction` (`supabase.auth.updateUser`, min 6 + konfirmasi) + `ChangePasswordForm` ditaruh di `/dashboard/profile` (dashboard komisariat).
* **Modul Pengguna → khusus akun tingkat cabang**: `dashboard/users` hanya tampil akun non-`ADMIN_KOMISARIAT`; `CreateUserModal` disederhanakan (role fixed ADMIN_CABANG, +Username +Nama, buang pemilih role/komisariat); `UserTable` +kolom Username & Nama.

#### Akun Komisariat auto-tautkan entity Commissariat (2026-07-02)
* **Keputusan: LPP dibatalkan** — modul "Komisariat & LPP" di-rename jadi **"Komisariat"** (nav sidebar, judul halaman, modal, header tabel). Akun LPP dihapus manual.
* **Impor & Tambah Manual** kini **auto-create record `Commissariat`** (helper `ensureCommissariat`: cari by nama case-insensitive, else buat baru + slug unik) lalu tautkan ke `User.commissariat_id`. Jadi tiap akun komisariat punya entity data (buat Profil Komisariat + tampil di publik nanti). Modal manual: pemilih "tautkan komisariat" dihapus (otomatis dari nama).
* **Backfill** 32 akun komisariat yang sudah ter-import (sebelum perubahan) → dibuatkan entity Commissariat + ditautkan.

#### Logo 3D (.glb) di Section "Tentang HMI Cabang Semarang" (2026-06-29)
* Dependency baru **`@google/model-viewer`** (disetujui; dicatat di `TECH_STACK.md`) — web component `<model-viewer>` untuk render aset 3D, jauh lebih ringan dari react-three-fiber.
* **`Logo3D`** (client, `widgets/home/ui/Logo3D.tsx`): render `public/models/logo-hmsmg3d.glb` (auto-rotate, camera-controls, zoom off). Lazy import `@google/model-viewer` di `useEffect` (client-only WebGL); element di-cast FC agar ter-tipe tanpa augmentasi JSX global.
* **`HomeAbout`** card kanan: "Pratinjau Visual" mock diganti **logo 3D berputar** dalam kartu glass (`bg-white/5 border-white/15 backdrop-blur`, aspect-square). `HomeAbout` kini sync (tidak lagi fetch `about_image_url`).
* Aset GLB di-rename `logo hmsmg3d 2.glb` → `logo-hmsmg3d.glb` (URL bersih tanpa spasi).

### Changed

#### Standar Global: Public Website Data States (2026-06-28)
* **`DESIGN.md` §16 (baru, "Public Website Data States")**: standar global perilaku state berdasarkan sumber data. **Dynamic Data** (CMS/DB/Prisma/Supabase/API/Server Action/External) wajib **Loading (Skeleton) + Success (CMS → Fallback bila perlu) + Error (Graceful Fallback UI tanpa Layout Shift & tanpa pesan teknis)**. **Static Data** (hardcoded/config/env/asset/copywriting) dirender langsung tanpa Skeleton/Error. Reusable component = presentasional (Presentation Ready Data); business logic hanya di Server Component/Feature Layer/Server Action/Shared API (FSD). (§17 Final Summary di-renumber dari §16.)
* **`SKILLS.md` §14**: tambah butir "Public Website Data States (WAJIB)" merujuk `DESIGN.md` §16.
* **Audit dokumentasi homepage**: subbab **Data States** (Data Source/Loading/Success/Error) ditambahkan ke section ber-Dynamic Data — `hero`, `about` (dynamic sebagian: gambar CMS), `commissariat-carousel`, `featured-articel`, `agendas-carousel`, `gallery-section`. Section **statis** `opening-screen` diberi catatan klasifikasi (Static, tanpa Loading/Error).
* **Penerapan di kode (homepage):**
  * **Loading State** — `Skeleton` primitive baru (`shared/ui/Skeleton.tsx`) + skeleton per section (`widgets/home/ui/HomeSkeletons.tsx`); `page.tsx` membungkus tiap dynamic section dengan `<Suspense fallback={…}>` (streaming, cegah CLS). `OpeningSplash` (static) render langsung tanpa Suspense.
  * **Error State (Graceful)** — semua query homepage (`widgets/home/api/queries.ts`) + `getWebsiteSettings` dibungkus `try/catch` → kembalikan `[]`/`null` saat DB gagal, sehingga section jatuh ke fallback/empty (tanpa crash, tinggi dipertahankan).
  * `HomeHero` & `HomeAbout` kini fetch `getWebsiteSettings` sendiri (`React.cache` dedupe) agar bisa di-stream per-section; prop `heroImageUrl`/`aboutImageUrl` dihapus dari `page.tsx`.

#### Preset Font: Bricolage Grotesque (heading) + Rubik (body) (2026-06-28)
* Ganti font global di `src/app/layout.tsx`: **Inter → Rubik** (`--font-sans`, untuk body/subheading/eyebrow/UI) dan **Geist (sans) → Bricolage Grotesque** (`--font-heading`, untuk heading). Geist Mono dipertahankan (`--font-mono`).
* `globals.css`: `--font-heading` kini menunjuk Bricolage; base layer menerapkan `font-heading` ke `h1`–`h6` otomatis.
* `docs/DESIGN.md` (§Typography) diperbarui sesuai preset baru.

### Added

#### Stub Halaman Publik + Prefetch Default (2026-06-28)
* Menambahkan **stub halaman publik** untuk seluruh route navigasi yang sebelumnya 404: `/profil`, `/struktur-organisasi`, `/artikel`, `/agenda`, `/komisariat`, `/galeri`, `/dokumen`, `/kontak`, plus dinamis `/artikel/[slug]` & `/komisariat/[slug]`. Semua memakai komponen reusable **`ComingSoon`** (`shared/ui/ComingSoon.tsx`) berisi `EmptyState` "Segera hadir".
* Karena route kini ada, **`prefetch={false}` dihapus** dari semua link scaffolding (nav header/footer, About CTA, carousel komisariat, featured carousel, article cards, SectionHeader CTA) — kembali ke prefetch default Next.js → navigasi instan, tanpa 404 prefetch di console.

#### Optimasi Gambar Otomatis sebelum Upload (WebP, best-practice) (2026-06-28)
* **`compressImageToWebp`** (client, `shared/lib/image-compress.ts`): semua gambar via `ImageUploader` dioptimalkan di browser sebelum dikirim ke Server Action/Cloudinary — dikonversi ke **WebP** dengan strategi best-practice. Canvas API, tanpa dependensi baru:
  * **Resize** ke `maxDimension` per-konteks (default 1920); quality dasar **0.82** (sweet spot, hampir tak terlihat bedanya vs 0.9 tapi jauh lebih kecil).
  * Bila masih > 2MB (ceiling): **downscale dulu** (jaga ketajaman) sampai sisi terpanjang 640px, baru turunkan quality dengan floor **0.6** (cegah artefak). Loop terbatas ~16 iterasi.
  * EXIF orientation diterapkan (`imageOrientation: 'from-image'`) agar foto HP tak miring. Input **yang sudah WebP**, non-raster (SVG/GIF), atau gagal decode → di-pass-through tanpa pipeline (langsung upload).
* **`ImageUploader`** menerima prop `maxDimension` (default 1920). Disetel per-konteks: logo 512, foto pengurus 600, featured artikel / about / flyer / foto sekretariat 1280, hero 1920.
* Delivery tetap pakai Cloudinary `f_auto,q_auto` (`getOptimizedUrl`) → AVIF/WebP adaptif per-browser saat tampil.
* `next.config.ts`: `experimental.serverActions.bodySizeLimit: '3mb'` — headroom di atas default 1MB untuk payload multipart WebP ≤2MB.

#### OpeningSplash tampil tiap refresh (2026-06-28)
* `OpeningSplash` tidak lagi memakai guard `sessionStorage` (sekali per sesi) — kini animasi "Yakin · Usaha · Sampai" tampil **setiap refresh halaman**. Dedupe StrictMode tetap via guard module-level (`splashStarted`) yang reset pada full reload.

#### Hero Animations — Entrance, Parallax & Count-Up (2026-06-28)
* **Entrance**: konten hero (eyebrow, heading, subheading, search, metrics) dibungkus `FadeIn` dengan stagger. Mulai **setelah OpeningSplash selesai** — `OpeningSplash` mengekspor `SPLASH_DURATION_MS` (dihitung dari timing kata + overlay), dipakai sebagai offset delay hero (`SPLASH_DURATION_MS + 0/100/200/300/400`). `CountUp` menerima prop `delay` agar count metric mulai setelah splash.
* **Parallax**: `HeroBackground` (client, `widgets/home/ui/HeroBackground.tsx`) — background image bergeser `scrollY * 0.3` via `requestAnimationFrame`; image di-oversize `h-[130%] -top-[15%]` agar tidak bocor saat bergeser. Menggantikan layer `<Image>` statis di `HomeHero`.
* **Count-up metrics**: `CountUp` (client, `widgets/home/ui/CountUp.tsx`) — angka metrik menghitung 0→target saat masuk viewport (ease-out cubic 1.5s), mempertahankan suffix non-numerik ("5000+", "16+"); "3" tetap.

#### Modul CMS "Kata Mereka" (Testimonial Management) (2026-06-28)
* **DB**: model `Testimonial` (`prisma db push`) — `photo_url, quote, name, title, featured, display_order, is_published` + audit fields.
* **Entity** `entities/testimonial/model/schema.ts` (Zod: nama/title/kutipan/foto wajib, `display_order` int ≥0).
* **Feature** `features/testimonial-management`: actions `saveTestimonialAction` (create/update), `deleteTestimonialAction`, `togglePublishTestimonialAction` — pola standar (auth SYSTEM_ADMIN/ADMIN_CABANG → Zod → Prisma → Audit Log). `TestimonialForm` (ImageUploader avatar folder `testimonials` maxDimension 400, featured Checkbox, status Select, display_order) + `TestimonialList` (tabel + aksi edit/publish-toggle/delete + cari nama, EmptyState).
* **Dashboard**: route `/dashboard/testimonials` (+`/new`, `/[id]/edit`) dengan guard role; sidebar grup "Konten" tambah item **"Kata Mereka"** (`QuoteIcon`, `ADMIN_CABANG_ONLY`). ADMIN_KOMISARIAT no access.
* **Public**: `getTestimonials()` kini query `is_published && featured`, urut `display_order asc` → `updated_at desc`; `HomeTestimonials` map `photo_url`→`getOptimizedUrl` (fallback bila kosong).

#### Homepage Section "Kata Mereka" — Testimonial Carousel (2026-06-28)
* **`HomeTestimonials`** (server, `widgets/home/ui/HomeTestimonials.tsx`): header center (eyebrow "Kata Mereka", heading "Apa Kata Mereka Tentang HMI?", subheading) + carousel. Section tint emerald. `FadeIn`.
* **`TestimonialCarousel`** (client, `widgets/home/ui/TestimonialCarousel.tsx`): infinite marquee (reuse rAF — auto-play, pause hover, drag, swipe, loop). **TestimonialCard**: ikon Quote, quote italic `line-clamp-4`, divider, avatar bulat (atau initial) + nama + title. Responsif `w-80 sm:w-96` (≈1/2/3 card).
* **Query** `getTestimonials()` di `widgets/home/api/queries.ts` + tipe `PublicTestimonial`. **Deviasi/penting:** model `Testimonial` & modul CMS "Testimoni" **belum ada di skema** → query mengembalikan `[]` (graceful), section memakai **fallback** (Lafran Pane, Nurcholish Madjid, dll — sesuai gambar referensi). Saat model+CMS siap, tinggal isi body query (Featured → displayOrder, Published only). Komponen tetap presentasional (props only).
* `page.tsx`: `<HomeTestimonials />` (dibungkus `Suspense` + `TestimonialsSkeleton`) setelah `<HomeCTA />`.

#### Homepage Section 08 — CTA Banner (2026-06-28)
* **`HomeCTA`** (server, **static**, `widgets/home/ui/HomeCTA.tsx`): banner full-width rounded gradient emerald + decorative diamond pattern (radial mask, menonjol di sudut), konten center — heading "Cari Tahu Tentang Kami Lebih Banyak", subheading, 2 tombol: primary putih "Lihat Galeri" → `/galeri`, secondary outline "Hubungi Kami" → `/kontak`. Mobile tombol vertikal, desktop horizontal. `FadeIn` (fade-up). Section **statis** → render langsung tanpa Suspense/Loading/Error (DESIGN §16).
* `src/app/(website)/page.tsx`: tambah `<HomeCTA />` setelah `<HomeGallery />` (tanpa Suspense). `cta-section.md` diberi subbab Data Source (Static).

#### Homepage Section 07 — Gallery Preview (Circular Gallery 3D) (2026-06-28)
* **`CircularGallery`** (client, `widgets/home/ui/CircularGallery.tsx`): komponen presentasional 3D carousel melingkar (kode referensi user, dimodifikasi). Props `albums` (presentation-ready), `href`, `radius`, `autoRotateSpeed`. Auto-rotate + scroll-based rotation, **hover memperlambat** rotasi, **radius responsif** (mengecil di layar sempit). Tiap album = `Link` ke `/galeri` (keyboard-focusable, focus ring). Card: cover + gradient overlay + judul; `coverImageUrl` kosong → placeholder gradien emerald. Tanpa business logic (no fetch/sort/fallback).
* **`HomeGallery`** (server, `widgets/home/ui/HomeGallery.tsx`): header center (eyebrow "Galeri", heading "Dokumentasi Kegiatan", subheading) + CircularGallery + CTA "Jelajahi Galeri →" `/galeri`. Map `cover_image_url` → `getOptimizedUrl`. Merge fallback (6 album) bila CMS < 6 agar lingkaran penuh. `FadeIn` (header → gallery → CTA).
* **Query** `getGalleryAlbums()` di `widgets/home/api/queries.ts`: album `PUBLISHED`, `cover_image_url` not null, `created_at desc`, take 8, `React.cache`.
* **Deviasi spec**: model `GalleryAlbum` belum punya `is_featured`/`featured_order` → urutan pakai album terbaru (`created_at desc`), bukan featured-first. Drag/touch gesture penuh belum diimplementasikan (auto + scroll + hover-slow saja).
* `src/app/(website)/page.tsx`: tambah `<HomeGallery />` setelah `<HomeAgenda />`.

#### Homepage Section 06 — Upcoming Agenda (2026-06-28)
* **`HomeAgenda`** (server, `widgets/home/ui/HomeAgenda.tsx`): header dua kolom (eyebrow "Agenda", heading "Agenda Mendatang", subheading, CTA "Agenda Lainnya" → `/agenda`) + carousel. Section tint `bg-emerald-50/60` (zebra setelah Articles putih). Fetch `getUpcomingAgendas()` + merge fallback (4 hardcoded).
* **`AgendaCarousel`** (client, `widgets/home/ui/AgendaCarousel.tsx`): infinite horizontal carousel (reuse pola rAF `CommissariatCarousel` — auto-scroll, pause hover, drag, swipe, loop). **AgendaCard** vertical sesuai referensi: flyer `aspect-[4/5]` + badge status kanan-atas (hijau Akan Datang/Hari Ini, abu Selesai), body putih (judul 2 baris, 📅 tanggal, 📍 lokasi, countdown, tombol outline "Lihat Detail" / "Lihat Dokumentasi" bila selesai). Hover lift + image zoom, klik → `/agenda/[slug]` (dicegah saat drag).
* **`shared/lib/agenda.ts`**: helper pure `getAgendaStatus` (today/upcoming/done dari tanggal), `getAgendaBadge`, `getCountdownLabel` ("Besok"/"N Hari Lagi"), `formatAgendaDate` (tunggal / rentang "01 - 07 Des 2026"). Self-check `agenda.check.ts` (runnable `npx tsx`).
* **Query** `getUpcomingAgendas()` di `widgets/home/api/queries.ts`: agenda `PUBLISHED`, `start_datetime asc`, take 8, `React.cache`.
* `src/app/(website)/page.tsx`: tambah `<HomeAgenda />` setelah `<HomeArticles />`.

#### Homepage Section 05 — Featured Articles (2026-06-28)
* **`HomeArticles`** (server component, `widgets/home/ui/HomeArticles.tsx`): bento grid — 1 featured besar (`lg:col-span-2`, image + gradient overlay gelap, kategori, judul, excerpt, tombol "Baca Selengkapnya") + 2 card sekunder bertumpuk kanan. Card sekunder dua varian: punya `featured_image_url` → image overlay + zoom hover; tanpa gambar → card hijau solid (`bg-primary`). Header dua kolom (eyebrow "Artikel" + heading "Artikel Pilihan" + subheading kiri, CTA "Jelajahi Artikel →" `/artikel` kanan). Metadata `Kategori • Tanggal` (`Intl.DateTimeFormat id-ID`), excerpt `line-clamp-2`, semua card → `/artikel/[slug]`. Dibungkus `FadeIn`.
* **Query** `getFeaturedArticles()` di `widgets/home/api/queries.ts`: 3 artikel `PUBLISHED` terbaru (`published_at desc`, `deleted_at: null`), select + relasi `category.name`, `React.cache`.
* **Fallback** 3 artikel hardcoded di-merge bila CMS < 3 (slug dedup).
* **`FeaturedCarousel`** (client, `widgets/home/ui/FeaturedCarousel.tsx`): slot featured besar kini single-item carousel — auto-play 5 detik, infinite loop, fade animation (crossfade), pause on hover, pagination dots (aktif melebar, klik pindah slide, tanpa prev/next). Query `take: 5` → 3 artikel untuk carousel, 2 untuk sekunder. Featured = artikel terbaru (model `Article` tak punya flag `is_featured`); tata letak bento (carousel kiri + 2 sekunder kanan) mengikuti referensi user.
* `src/app/(website)/page.tsx`: tambah `<HomeArticles />` setelah `<HomeAbout />`.

#### Homepage Section 04 — About HMI Cabang Semarang (2026-06-27)
* **`HomeAbout`** (server component, `widgets/home/ui/HomeAbout.tsx`): split layout 50:50 (desktop `md:grid-cols-2`, mobile 1 kolom dengan gambar di bawah) sesuai spec `docs/public-website/homepage/about.md`. Kiri: eyebrow "Tentang Kami", heading, 2 paragraf profil organisasi, core values inline (✓ Yakin / Usaha / Sampai — visual, bukan badge), CTA "Lihat Profil Lengkap →" ke `/profil`. Kanan: featured image `aspect-[4/3]` rounded dari CMS, fallback placeholder abu "Gambar belum tersedia". Background light gradient (`from-emerald-50/40 to-white`).
* **`FadeIn`** (client, `shared/ui/FadeIn.tsx`): reusable fade-up wrapper berbasis `IntersectionObserver` — reveal sekali saat masuk viewport (threshold 0.15), `translate-y-6 opacity-0` → `0/100` transisi 700ms, `motion-reduce` aware. Dipakai `HomeAbout`, siap dipakai ulang section homepage berikutnya.
* **DB migration** (`prisma db push`): tambah `about_image_url String?` ke `WebsiteSetting`.
* **CMS**: field "Gambar Tentang Kami" (`ImageUploader` folder `about-images`) ditambahkan ke tab "Tampilan" SettingsForm; schema Zod + `updateSettingsAction` (create & update) diperbarui.
* `src/app/(website)/page.tsx`: tambah `<HomeAbout aboutImageUrl={settings?.about_image_url} />` setelah `<HomeHero />`.

#### Homepage — Infinite Commissariat Strip di Hero Bottom (2026-06-27)
* **`CommissariatCarousel`** (client, `widgets/home/ui/CommissariatCarousel.tsx`): infinite strip berbasis rAF — auto-scroll (0.5px/frame), pause on hover, drag mouse, swipe touch. Setiap item: logo rounded square (48×48 + `bg-white/20`) + nama komisariat bold putih, `w-64` fixed. Item diduplikasi `[...items, ...items]` untuk seamless loop; normalisasi posisi `x` saat drag selesai.
* **`HomeHero`** diubah menjadi `async` server component: fetch `getPublicCommissariats()` langsung di dalam komponen, merge hasil DB + fallback hardcoded (8 komisariat) berdasarkan slug deduplication. Carousel ditempatkan `absolute bottom-0 z-20 w-full pb-6` di dalam hero.
* **Query** `getPublicCommissariats()` di `widgets/home/api/queries.ts`: fetch komisariat aktif (`is_active: true`), ordered alfabet, select `id/name/slug/logo_url/campus_name` + relasi `university.name`; dibungkus `React.cache`.
* **`CommissariatCard.tsx`** dan **`HomeCommissariats.tsx`** dihapus — section komisariat terpisah diganti dengan carousel strip langsung di bottom hero (identitas visual, bukan section navigasi).
* **`Section.tsx`** ditambahkan di `shared/ui`: reusable section wrapper (`overflow-hidden py-14`) dengan prop `className` opsional.

#### Navbar & Hero Refinements (2026-06-27)
* **Navbar scroll state:** saat scroll > 80px di homepage, navbar berubah ke `border-b bg-white shadow-sm` (sebelumnya `bg-background/80 backdrop-blur`).
* **Hero content padding:** `pt-24 pb-24` (simetris) agar konten hero tepat di tengah vertikal dengan ruang untuk carousel strip di bawah.

#### Hero Section — Full Spec Compliance + Transparent Navbar + CMS Hero Image (2026-06-24)
* **`HomeHero` rewrite** (spec: `docs/public-website/homepage/hero.md`): full-screen (`min-h-screen`), background image dari CMS (`hero_image_url`) via `next/image fill`, emerald gradient overlay, Islamic SVG diamond pattern (opacity 4%). Metrics sekarang **inline di dalam hero** (Komisariat DB, Korkom hardcode 3, Kampus DB, Kader DB+) — bukan card terpisah. `HomeStats` dihapus dari homepage.
* **Transparent navbar**: `PublicHeader` berubah dari `sticky` menjadi `fixed`. Di halaman beranda (`pathname === '/'`), navbar transparan dengan teks putih & logo putih langsung (tanpa wrapper hijau). Saat scroll > 80px, navbar berubah solid (`bg-background/80 backdrop-blur`) dengan transisi 300ms. Pada halaman lain, langsung solid.
* **DB migration** (via `prisma db push`): tambah `hero_image_url String?` dan `dark_logo_url String?` ke model `WebsiteSetting`.
* **CMS Settings Form** — tambah tab keempat "Tampilan" berisi `ImageUploader` untuk Gambar Hero (`hero-images/`) dan Logo Gelap (`logos/`). Schema + action `updateSettingsAction` diperbarui untuk menyimpan kedua field baru.
* `getWebsiteSettings()` dibungkus `React.cache` untuk deduplikasi fetch antara layout dan page.
* `src/app/(website)/search/page.tsx` diperbarui untuk `pt-24` agar konten tidak tertutup fixed navbar.

#### Public Homepage (Fase Inti) + Shell Publik Reusable (2026-06-23)
* **Route group baru `src/app/(website)/`** dengan layout publik bersama (`PublicHeader` + `PublicFooter`) yang akan dipakai ulang oleh halaman publik berikutnya (`/profil`, `/artikel`, dst). Login tetap di `(public)/login` tanpa shell publik. `generateMetadata()` membaca `site_name`/`seo_title`/`seo_description` dari `WebsiteSetting`. Boilerplate `src/app/page.tsx` dihapus; homepage kini di `(website)/page.tsx`.
* **`PublicHeader`** (widget `widgets/public-layout`): logo (default logo putih HMI dibungkus wadah hijau agar terlihat di latar terang), nav lengkap (Beranda, Profil, Struktur, Artikel, Agenda, Komisariat, Galeri, Dokumen, Kontak) sebagai scaffolding, tombol Login, dan menu mobile via `Sheet` (hamburger). Highlight tautan aktif via `usePathname`.
* **`PublicFooter`** (latar hijau `bg-primary`): brand + deskripsi + ikon Instagram (react-icons/fa6), tautan cepat, kontak (email/alamat dari settings), dan bar copyright (`footer_text` atau default "Yakin Usaha Sampai").
* **Homepage sections** (widget `widgets/home`): `OpeningSplash` (overlay "Yakin · Usaha · Sampai" sekali per sesi via `sessionStorage`, fade-out), `HomeHero` (heading & subheading fixed dari PRD + CTA Selengkapnya/Login), `HomeSearch` (bar pencarian → `/search?q=`), `HomeStats` (3 kartu: Komisariat, Kampus, Kader — diagregasi dari Prisma).
* **Stub `/search`** di group `(website)` (baca `q`, `EmptyState` "Pencarian segera hadir") agar submit search tidak 404; pencarian penuh menyusul.
* Helper baru `getWebsiteSettings()` di `features/website-settings/api/queries.ts` (singleton via `findFirst`).
* **Ditunda ke iterasi berikutnya:** Komisariat Carousel, Featured Articles, Agenda Carousel, Gallery Preview (sesuai keputusan scope "inti dulu").

#### Dark / Light Theme Toggle (2026-06-23)
* Wired up `next-themes` `ThemeProvider` (class-based, `defaultTheme="light"`) in the root `Providers`. The `.dark` CSS variables already existed in `globals.css`.
* Added a `ThemeToggle` button (Sun/Moon) placed in `SiteHeader` immediately to the **left of the notification bell**. Hydration-safe (renders icon only after mount).
* Board member card name/position font sizes bumped to match the reference proportions (name → `text-xl` 20px, jabatan → `text-base` 16px; jabatan area height widened to fit two lines).

#### Redesigned Kepengurusan Workflow — Period → Pengurus → Flip Cards (2026-06-23)
* **DB migration** on `BoardMember`: added `social_links` (JSON array, replaces single `instagram_url`), `university_id` + `commissariat_id` (FKs → University/Commissariat), and `created_at`; added back-relations on `University` & `Commissariat`. `Position.layout_type` now carries the layout group (`KSB` | `KETUA_BIDANG` | `LAINNYA`).
* **Tambah Periode** modal (`CreatePeriodModal`): create a new period + multi positions in one step, each position assigned a layout group. Button "Simpan & Susun Pengurus" redirects straight to the period detail page (action returns the new `periodId`).
* **Susunan Kepengurusan** page: a "Tambah Pengurus" modal (`TambahPengurusModal`) with foto (1:1, required), nama, jabatan (combobox), kampus & komisariat (comboboxes) — all required — plus optional multi social links (default 1 Instagram, "Tambah Sosmed" button) and a ≤200-char bio with counter.
* **Flip cards** (`PengurusCard`): front shows photo + name (green, larger, bold) + position + social icons below; clicking flips to reveal bio, kampus, komisariat. Edit/Delete shown only when `editable` (dashboard); reusable for the public page later with `editable={false}`.
* Added **`react-icons`** (Font Awesome 6 brands) for proper social-media brand icons (Instagram, X/Twitter, LinkedIn, Facebook, YouTube, TikTok), since Lucide dropped brand icons. Scoped to social platforms only; Lucide remains the primary icon set. Documented in `TECH_STACK.md`.
* **Layout grouping** (`SusunanKepengurusan`): KSB row (centered, Ketua in middle), Ketua Bidang grid (newest top-left), and Lainnya grid, with tight section spacing.
* **Kelola Jabatan** section retained on the detail page (add/rename/delete jabatan + change layout group) so the position combobox stays current.
* New/updated server actions: `createPositionStructureAction` (new-period only, returns `periodId`), `createBoardMemberAction`/`updateBoardMemberAction` (full fields + required validation), `updatePositionAction`/`createPositionAction` (accept layout group). Removed the obsolete `PositionList` component.
* **Period edit now reuses the Tambah Periode modal**: clicking Edit in the period row opens the same `CreatePeriodModal` (years + jabatan list + layout groups) in edit mode with the button relabeled "Simpan Perubahan". New `updatePeriodStructureAction` updates the year range and syncs positions (rename/regroup/reorder existing by row id, create new rows, delete removed rows incl. their members). Removed the standalone `EditPeriodModal`.
* Fixed: the period **Hapus** action is no longer disabled for the active period — it is now clickable, and the active-period safety guard is enforced (with message) inside `deletePeriodAction`/the confirmation dialog.

### Changed

#### Consolidated "Jabatan" Management into the Organization Module (2026-06-23)
* Removed the "Jabatan" tab from the Taxonomy page (and its `JabatanTaxonomyTable` flat list) — position/period data belongs to the Organization module, not taxonomy (which is for classification labels). Taxonomy now only manages Article/Document categories, Tags, and Universities.
* Moved `CreatePositionStructureModal` from `taxonomy/ui` to `organization/ui` (now an in-slice import, FSD-compliant) and made it the primary action on the Periods page (`/dashboard/organization/periods`), replacing the old `CreatePeriodModal`. It creates a new period + multiple positions at once, or appends positions to an existing period via a searchable Combobox.
* Removed the now-unused `CreatePeriodModal` component and `createPeriodAction` server action.
* Added per-position **Edit/rename** (new `EditPositionModal` using the existing `updatePositionAction`) to `PositionList` on the period detail page, so the rename capability from the dropped flat table is preserved.
* Cleaned up `revalidatePath('/dashboard/taxonomy')` calls in the organization actions (no longer relevant).

### Added

#### Period (Riwayat Kepengurusan) Edit, Archive & Delete Actions (2026-06-23)
* Added `updatePeriodAction` (edit start/end year with auto-regenerated period name and duplicate-year guard) and `deletePeriodAction` (cascade-deletes the period with all its positions & board members) in the organization actions.
* Added `archivePeriodAction` (soft delete): deactivates the active period via `is_active=false` — the structure data is preserved but no longer shows on the public homepage. No DB migration; reuses the existing active/inactive flag.
* `deletePeriodAction` refuses to delete the currently active period — another period must be activated first — to avoid wiping the live public structure.
* Added "Edit", "Arsipkan" (shown only for the active period), and "Hapus" items to the period row action dropdown in `PeriodList`, with new `EditPeriodModal` and a `DeletePeriodModal` confirmation dialog (showing affected position count). The Delete item is disabled for the active period; archived periods stay listed with the existing "Arsip" badge and can be re-activated.

#### Taxonomy Edit Action & Jabatan Structure Tab (2026-06-23)
* Added `updateTaxonomyAction` server action enabling full CRUD on simple taxonomies (Article Category, Document Category, Tag, University); the URL slug is intentionally preserved on rename to avoid breaking public/SEO links.
* Added an "Edit" action (with `EditTaxonomyModal`) to every taxonomy table row's action dropdown alongside the existing Archive/Activate toggle.
* Added a new "Jabatan" tab to the Taxonomy page that reuses the existing `Period` + `Position` models as a single source of truth shared with the Organization module (no DB migration).
* Added `createPositionStructureAction` (creates one Period plus multiple Positions in a single transaction via a combined modal) and `updatePositionAction` (rename a position) in the organization actions.
* New components: `CreatePositionStructureModal` (year inputs + dynamic multi-position list) and `JabatanTaxonomyTable` (flat list showing each position with its period/year, with inline Edit and Delete).
* `CreatePositionStructureModal` now supports two modes via a toggle: **"Periode yang ada"** (pick an existing period through a searchable `Combobox`; new positions are appended with continuing `sort_order`) or **"Buat periode baru"** (creates the period + positions). Defaults to existing-period mode when at least one period exists. `createPositionStructureAction` branches on a `mode` field accordingly.
* The dynamic position list in `CreatePositionStructureModal` uses a fixed-height window (`h-[min(432px,46vh)]`, ~10 rows) that reserves roomy empty space when there are few rows and scrolls internally for long lists, keeping the modal within the viewport.

### Changed

#### Sidebar & Dropdown Navigation for ADMIN_KOMISARIAT (2026-06-23)
* Added "Profil Komisariat" as a dedicated sidebar menu item below "Dasbor", visible exclusively for `ADMIN_KOMISARIAT` role, linking to `/dashboard/profile`.
* Removed "Profil Saya" dropdown item from NavUser for `ADMIN_KOMISARIAT` since the sidebar item replaces it; non-komisariat roles (`ADMIN_CABANG`, `SYSTEM_ADMIN`) retain "Profil Saya" in their dropdown as before.
* Extended `NavUser` component to accept a `role` prop for conditional rendering of dropdown items.
* Unified the user profile card placement into `SidebarFooter` for all roles (including `ADMIN_KOMISARIAT`), restoring its original bottom-of-sidebar position instead of the header.
* Added subtle horizontal padding to the sidebar header, content, and footer (`px-3` / `px-1`) so navigation items are no longer flush against the edge.

### Removed

#### Dark Mode Toggle (2026-06-23)
* Removed `ThemeToggle` component from `SiteHeader`. Project now focuses exclusively on light theme.

#### Dashboard Skeleton Loading UI (2026-06-22)
* Removed dashboard skeleton placeholder rendering from route `loading.tsx` files and granular `<Suspense>` fallbacks while preserving the App Shell streaming boundaries.
* Removed unused shared skeleton UI helpers from `src/shared/ui/`.
* Removed the sidebar menu skeleton export and the image uploader pulse placeholder accent.

### Added

#### Dashboard UI Adjustments (2026-06-23)
* `SiteHeader` now dynamically resolves page title from `pathname` instead of static "Dasbor" text. Added `py-2` vertical padding.
* `GlobalSearch` trigger is now icon-only on mobile (`w-9 h-9`), and expands to a 2x wider searchbar (`w-64` on tablet, `w-80` on desktop) with text on `sm:` breakpoint.
* `PageHeader` standardized: heading capped at `text-2xl` (24px), subheading set to `text-xs`, icon max `h-8 w-8` (32px).
* Sidebar auto-closes on mobile when navigating to subpages via `NavMain` pathname change detection.
* `KelolaJabatanSection` refactored into `KelolaJabatanModal` dialog, triggered from a button next to "Tambah Pengurus" on the organization period page.
* Fixed inconsistent gap between position names and Instagram icons in `PengurusCard` by allowing natural text height and pushing icons with fixed top margin.

#### University Taxonomy & Searchable Combobox Standardization (2026-06-23)
* Created `University` model in Prisma schema with `name`, `slug`, `is_active` fields and relational links to `Commissariat` and `CommissariatProfileSubmission`.
* Added `university_id` foreign key to `Commissariat` and `CommissariatProfileSubmission` models.
* Built reusable `Combobox` component (`src/shared/ui/Combobox.tsx`) using Popover + Command (cmdk) for searchable dropdown pattern.
* Extended Taxonomy CRUD actions and toggle status to support `UNIVERSITY` type, with RBAC enforcement for `SYSTEM_ADMIN` and `ADMIN_CABANG`.
* Added "Universitas" tab to Taxonomy management page.
* Converted `ProfileForm` campus field from text input to University Combobox dropdown.
* Converted `ArticleForm` category and commissariat selects to searchable Combobox components.

#### Table UX Standardization (2026-06-23)
* Standardized all table action columns to use DropdownMenu with `MoreHorizontal` icon trigger instead of inline buttons.
* Renamed "Tindakan" column header to "Aksi" across all 7 dashboard tables.
* Made all Badge/status labels `w-full` for consistent column alignment.
* Added `truncate` with `max-w-*` constraints on long-text table cells to prevent column overflow.
* Set consistent `h-12` minimum height on `TableRow` for uniform row spacing.
* Compacted `SmartPagination` padding to `py-2` while maintaining mobile touch targets.


#### Aggressive Internal Link Prefetch (2026-06-22)
* Added explicit `prefetch` props to known internal `next/link` navigation across dashboard layout, forms, lists, review center, notifications, and error pages.
* Guarded database-driven notification links so only internal paths are prefetched.
* Documented the internal prefetch convention in `docs/SKILLS.md`.

#### Dashboard Streaming & Skeleton Refactoring (2026-06-22)
* Removed global `loading.tsx` from dashboard root to prevent blocking the entire layout on navigation.
* Refactored `RecentActivityWidget`, `PendingQueueWidget`, and `LeaderboardWidget` to internally handle their own `<Suspense>` boundaries.
* Widget shells (Cards, Headers, Titles) now render synchronously at `0ms` delay, while inner data fetches stream dynamically with granular row-level skeletons.

#### Role-Based Sidebar Navigation (2026-06-22)
* Implemented Role-Based Access Control (RBAC) filtering for the dashboard sidebar based on `ROLE_PERMISSION_MATRIX.md`.
* `layout.tsx` now directly queries Prisma (`User` table) to securely retrieve the user's role without relying on potentially stale Supabase JWT metadata.
* `AppSidebar.tsx` intelligently filters its navigation menus so that `ADMIN_KOMISARIAT` only sees relevant features (Articles, Agendas, Notifications, Cadre Verification, Dashboard), hiding administrative tools reserved for `ADMIN_CABANG` and `SYSTEM_ADMIN`.

#### Next.js App Shell & Performance Refactoring (2026-06-22)
* Implemented the App Shell pattern across the CMS dashboard to resolve sluggish navigation and blocking route transitions.
* Created `TableSkeleton` and `GridSkeleton` components in `src/shared/ui/` for premium loading states.
* Added Suspense boundaries (`loading.tsx`) to `/dashboard` root and all heavy entity routes (`articles`, `agendas`, `documents`, `galleries`, `cadre-verification`, `users`).
* Navigation now occurs instantly (< 50ms) while data is fetched asynchronously behind the skeleton fallbacks.

#### FSD Entities Layer Extraction (2026-06-22)
* Extracted Zod `schema.ts` domain models from the `features` layer and successfully relocated them into their respective `src/entities/{domain}/model/schema.ts` directories to ensure 100% compliance with strict Feature-Sliced Design.
* Updated import references programmatically across all relative and absolute imports in `actions.ts` files and UI forms without breaking the build.

#### FSD Naming Conventions Refactoring (2026-06-22)
* Renamed all 35 generic `kebab-case.tsx` UI components in `src/shared/ui/` to `PascalCase.tsx` to strictly adhere to the project's React component naming standard.
* Moved `src/shared/lib/prisma.ts` to `src/shared/api/prisma/client.ts` to standardize Prisma singleton location.
* Renamed environment variables config from `src/shared/config/env.ts` to `src/shared/config/config.ts`.
* Renamed and relocated `src/shared/api/cloudinary-action.ts` to `src/shared/api/media/actions.ts` to strictly adhere to the Server Actions filename (`actions.ts`) policy.
* Updated import paths globally across 92 files to match the new component casing and relocated files.

#### Codebase Structure & Action Consolidation (2026-06-22)
* Consolidated authentication actions (`loginAction` and `logoutAction`) and schema (`loginSchema`) in `src/features/auth/api/` into unified `actions.ts` and `schema.ts` files, ensuring compliance with strict FSD naming conventions.
* Updated `LoginForm.tsx` imports and removed obsolete separate `login.ts` and `logout.ts` files.
* Deleted deprecated/stale user-management files `create-user.ts` and `force-reset.ts` from `src/features/user-management/api/` as their logic has been consolidated.

#### Dashboard Layout Refactoring & Performance Streaming (2026-06-22)
* Standardized all 25 dashboard page containers on `p-6 space-y-6 max-w-7xl mx-auto w-full` to enforce consistent padding, margins, and width alignment across the CMS.
* Created unified, reusable `BackButton` (`src/shared/ui/back-button.tsx`) and `PageHeader` (`src/shared/ui/page-header.tsx`) components.
* Refactored forms (`ArticleForm`, `AgendaForm`, `DocumentForm`, `AlbumForm`) and the review split-screen (`ReviewSplitScreen`) to utilize the unified back buttons and headers.
* Optimized dashboard rendering performance: decoupled statistics, leaderboard, pending list, and recent audit logs into independent, parallel async server components wrapped in React `<Suspense>` boundaries with shimmer `Skeleton` loader fallbacks, enabling instant dashboard page transitions.

#### FSD Safe Refactoring — Option B (2026-06-22)
* Reorganized dashboard widgets and queries: moved `PendingQueueWidget`, `RecentActivityWidget`, `LeaderboardWidget`, `StatCard`, and queries to `src/widgets/dashboard/`.
* Created FSD layout widgets: moved layout components (`AppSidebar`, `SiteHeader`, `NavMain`, `NavSecondary`, `NavUser`, `NavDocuments`, `SectionCards`) from `src/shared/ui/` to `src/widgets/layout/`.
* Standardized hooks: renamed `use-mobile.ts` to `useMobile.ts` (PascalCase), and extracted `useDebounce` from `shared/lib/hooks.ts` into a standalone `src/shared/hooks/useDebounce.ts` hook.
* Standardized utility naming and location: relocated `supabase-admin.ts` to `src/shared/api/supabase/admin.ts`, and renamed `cloudinary-client.ts` to `src/shared/lib/cloudinary-upload.ts`.
* Deleted stale files: removed deprecated PascalCase UI folder `src/shared/ui/ui/`, chart and table demo components, and old `shared/lib/hooks.ts` file.
* Fixed ESLint error in `useMobile.ts` where state was set synchronously inside `useEffect`.
* Verified all Next.js routes and TypeScript build successfully ✅.

#### UI/UX Upgrade — Dashboard Sidebar Navigation (2026-06-22)
* Installed `dashboard-01` shadcn block with full component suite: `Sidebar`, `AppSidebar`, `SiteHeader`, `NavMain`, `NavSecondary`, `NavUser`, `Card`, `Badge`, `Table`, `Avatar`, `Drawer`, `Sheet`, `Tooltip`, `Skeleton`, `Breadcrumb`, `Label`, `Select`, `Separator`, `Toggle`, `Checkbox`, `ToggleGroup`, `Sonner`, `ScrollArea`, `Popover`, `Pagination`.
* Replaced flat top header layout (`layout.tsx`) with full `SidebarProvider` + `SidebarInset` layout.
* Rebuilt `AppSidebar` dengan navigasi lengkap HMI: Konten (Dasbor, Artikel, Agenda, Galeri, Dokumen, Review Center) dan Manajemen (Pengguna, Kader, Organisasi, Taksonomi).
* Rebuilt `NavMain` with active state detection via `usePathname()` and `SidebarMenuButton isActive`.
* Rebuilt `NavUser` with real HMI logout action (Supabase `signOut`) and navigation links to Profile and Notifications.
* Rebuilt `SiteHeader` integrating `GlobalSearch` and `NotificationBell` into the header bar.
* Fixed all 42 files using legacy import path `@/shared/ui/ui/*` → migrated to correct flat paths `@/shared/ui/*`.
* Installed missing shadcn components: `scroll-area`, `popover`, `pagination`.
* Created `src/shared/ui/empty-state.tsx` migrated from legacy custom component.
* Removed redundant `scratch/` debug files.
* Fixed `chart-area-interactive.tsx` `setState` in `useEffect` ESLint error.
* Fixed `nav-main.tsx` TypeScript `pathname possibly null` type error.
* All 24 routes compile and `npm run build` passes ✅.

#### v1.3.0 Observability
* Implemented `logAuditAction` passive injection for recording persistent (Append-Only) activity logs.
* Added `/dashboard/audit-logs` viewer page with standard server-side pagination.
* Created Notification System utility (`createNotification`) for generating system updates.
* Implemented `NotificationBell` in the global dashboard layout using TanStack Query for 30s polling.
* Added `/dashboard/notifications` page for managing all historical notifications.
* Integrated `logAuditAction` into `Taxonomy` features (Article Category, Document Category, Tag).

#### Documentation

* Created `PRD.md`
* Created `TECH_STACK.md`
* Created `DOCUMENTATION_RULES.md`
* Created `SITEMAP_PUBLIC.md`
* Created `SITEMAP_CMS.md`
* Created `decisions/001-authentication.md`
* Created `decisions/002-document-module.md`
* Created `decisions/003-database-readiness.md`
* Created `decisions/004-cloudinary-migration.md`
* Created `ROADMAP.md`

#### Product Modules

* Authentication Module
* Article Module
* Commissariat Module
* Organization & Period Module
* Agenda Module
* Gallery Module
* Dashboard Module
* Notification Module
* Audit Log Module
* Website Settings Module
* Document Module

#### Public Website

* Homepage
* Profile Page
* Structure Organization Page
* Article Pages
* Agenda Pages
* Commissariat Pages
* Gallery Pages
* Document Pages
* Contact Page

#### Features

* Unified Review Center
* Global Search
* Dark Mode Support
* Maintenance Mode
* Analytics Support
* Media Optimization Pipeline
* Soft Delete Strategy
* Single Session Authentication

---

### Changed

#### Product Decisions

* **ADR 004: Migrated Media Storage from Supabase Storage to Cloudinary.**
* Dashboard leaderboard restricted to Top 5 Commissariats.
* Global Search priority defined: Relevance first, then Published Date DESC.
* Content Review concurrency handled via Prisma Transactions (no version column/optimistic locking).
* Audit Logs retention policy set to permanent (never auto-delete).
* Defined Category cardinality (Article N:1, Document N:1).
* Defined Tag cardinality (Article N:M).
* Created dedicated Review History entity to permanently store revision notes.
* Created dedicated Cadre Verification entity.
* Added Draft → Published → Archived workflow for Gallery Albums.
* Refined Soft Delete strategy (restricted for Commissariats, Periods, Categories, Tags).
* Clarified SYSTEM_ADMIN capabilities (bypasses all workflows).
* Agenda Status changed to dynamically computed.
* Audit Logs set to permanent retention.
* Added mandatory revision notes for revision requests.
* Rejected content can be edited and submitted again.
* Approval metadata now stores:

  * approved_by
  * approved_at
* Added public document management module.
* Added category pages:

  * `/artikel/kategori/[slug]`
* Added document search support to global search.

#### Public Website

* Added `/dokumen` route.
* Updated sitemap structure.
* Updated homepage search scope.

#### Authentication

* Clarified distinction between:

  * Authentication emails
  * Business workflow notifications

Authentication emails remain supported:

* Invite Link
* Password Reset

Business workflow emails are not included in MVP.

---

### Fixed

#### Documentation Consistency

* Refactored `DOCUMENTATION_RULES.md` to strictly focus on documentation standards (removed AI orchestration rules, added structural templates, naming conventions, and ADR/Feature standards).
* Synced PRD with Decision Updates.
* Synced Public Sitemap with latest product decisions.
* Synced Tech Stack documentation with authentication requirements.
* Resolved documentation inconsistencies discovered during audit review.

---

### Removed

#### MVP Scope

* Dedicated public tag pages:

  * `/artikel/tag/[slug]`

Tags remain available as metadata and filters only.

---

## Versioning Strategy

### MAJOR

Increment when:

* Breaking architectural changes
* Major business workflow changes
* Database redesign

Example:

```text
1.0.0 → 2.0.0
```

---

### MINOR

Increment when:

* New feature modules added
* New pages added
* New workflows added

Example:

```text
1.0.0 → 1.1.0
```

---

### PATCH

Increment when:

* Documentation fixes
* Small improvements
* Bug fixes
* Non-breaking changes

Example:

```text
1.0.0 → 1.0.1
```

---

## Changelog Rules

Every change affecting:

* Requirements
* Database
* Permissions
* APIs
* Architecture
* Design System

must update this file.

A task is not considered complete until the changelog has been updated.
