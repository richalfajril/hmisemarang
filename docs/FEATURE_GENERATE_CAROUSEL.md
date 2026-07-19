# FEATURE_GENERATE_CAROUSEL.md

> **Feature Name:** Generate Carousel
> **Module:** CMS Article
> **Version:** 1.1
> **Status:** Implemented (v1, client-side)
> **Owner:** Bidang Komunikasi dan Digital – HMI Cabang Semarang

---

# 0. Implementation Notes / Deviations (v1 — 2026-07-19)

Implementasi v1 **menyimpang dari engine yang tertulis di draft** karena kendala platform (Vercel
serverless: limit 250MB, tanpa `maxDuration`/bundling Chromium). Keputusan diambil bersama owner:

- **Rendering client-side**, bukan Playwright server-side. Slide (1080×1350) disusun & dirender
  menjadi PNG **di browser admin** memakai `html-to-image`. Tidak ada Chromium/Playwright di server.
- **Tanpa halaman export `/articles/{slug}/export`.** Blok artikel dirender di kontainer off-screen di
  dalam modal, memakai kelas `.prose prose-emerald` yang sama dengan website agar konsisten.
- **Pixel-slice yang dimaksimalkan** (revisi v1.1, atas permintaan owner). Isi artikel dirender jadi
  satu kolom tinggi lalu dipotong tiap ±1350px agar **tiap slide penuh** — teks boleh terpotong di
  tengah blok/baris (termasuk numbering). **Pengecualian: gambar tidak boleh terpotong** — bila batas
  potong jatuh di dalam sebuah gambar, potongan dinaikkan ke atas gambar sehingga gambar utuh di slide
  berikutnya (`lib/paginate.ts::planSlices`, `noCutZones`). Ceiling: gambar yang lebih tinggi dari satu
  slide di-clip.
- **Cover meniru detail artikel**: di bawah judul ada avatar penulis, tanggal, menit baca, jumlah
  dilihat, dan ikon share (WhatsApp/X/Facebook/Link, statis). Body memakai font 20px + dateline
  "SEMARANG, hmisemarang.org —" seperti halaman baca.
- **Slide CTA berheader**: band header IG dipasang di atas slide QR agar tidak kosong; tinggi tetap
  1350px, konten QR ditata presisi di ruang sisa (1110px).
- **Tanpa temporary asset Cloudinary & tanpa endpoint `/api`.** PNG & ZIP dibuat sepenuhnya di klien
  (`jszip`) lalu diunduh langsung; tidak ada upload/cleanup. Ini juga menghindari konflik dengan ADR-003.
  Satu-satunya sentuhan server: `saveCarouselHeaderAction` (Server Action) menyimpan URL header.
- **Header IG bersifat global** (satu untuk organisasi) di `website_settings.carousel_header_url`,
  bukan preferensi per-admin. Upload memakai `ImageUploader` → `uploadMediaAction` yang sudah ada.
- **URL QR** memakai rute publik nyata `https://hmisemarang.org/artikel/{slug}` (draft menulis
  `/articles/{slug}` yang tidak ada).

Kode: `src/features/carousel-generator/` (`lib/paginate.ts`, `lib/slides.ts`, `lib/render.ts`,
`ui/GenerateCarouselModal.tsx`, `api/actions.ts`). Bagian di bawah ini adalah spec desain asli dan
sebagian mendeskripsikan pendekatan Playwright yang **tidak dipakai** — pertahankan sebagai rujukan riwayat.

---

# 1. Overview

Generate Carousel adalah fitur yang memungkinkan Admin mengubah artikel yang telah dipublikasikan menjadi carousel Instagram secara otomatis.

Sistem akan mengambil tampilan artikel dari halaman export khusus, menghasilkan beberapa gambar berukuran **1080 × 1350 px**, lalu mengompres seluruh gambar menjadi file ZIP yang siap diunggah ke Instagram.

Admin tidak perlu lagi melakukan desain ulang menggunakan Canva, Photoshop, maupun aplikasi desain lainnya.

---

# 2. Objectives

- Mengubah artikel website menjadi carousel Instagram secara otomatis.
- Menjaga tampilan carousel tetap identik dengan website.
- Mempercepat proses publikasi media sosial.
- Menghilangkan proses screenshot manual.
- Menjaga konsistensi branding organisasi.

---

# 3. Scope

## Included

- Generate carousel dari artikel Published.
- Preview hasil generate.
- Download ZIP.
- Header Instagram.
- Screenshot body artikel.
- Slide CTA.
- QR Code otomatis.
- Nomor halaman.
- Upload temporary ke Cloudinary.

## Excluded

- Template berbeda.
- Export Story.
- Export Square.
- Export LinkedIn.
- Video carousel.
- AI Summary.

---

# 4. User Role

| Role | Access |
|-------|--------|
| Admin Cabang | ✅ Generate Carousel |
| Admin Komisariat | ❌ |
| Public | ❌ |

---

# 5. Use Case

## UC-001 Generate Carousel

### Actor

Admin Cabang

### Preconditions

- User sudah login.
- Artikel berstatus Published.
- Artikel memiliki slug.
- Header Instagram tersedia.

### Trigger

Admin memilih menu:

```
Generate Carousel
```

### Success Flow

1. Admin membuka daftar artikel.
2. Klik menu Action.
3. Klik Generate Carousel.
4. Modal Loading muncul.
5. Sistem melakukan render halaman export.
6. Sistem menghasilkan seluruh PNG.
7. Sistem upload PNG ke Cloudinary.
8. Sistem membuat ZIP.
9. Preview ditampilkan.
10. Admin klik Download ZIP.
11. ZIP diunduh.
12. Modal ditutup.
13. Asset temporary di Cloudinary dihapus.

---

# 6. User Story

### US-001

Sebagai Admin,

Saya ingin membuat carousel Instagram dari artikel,

Agar tidak perlu mendesain ulang secara manual.

---

### US-002

Sebagai Admin,

Saya ingin hasil download berupa ZIP,

Agar seluruh slide tetap berurutan.

---

### US-003

Sebagai Admin,

Saya ingin terdapat QR Code,

Agar pembaca dapat langsung membuka artikel lengkap.

---

### US-004

Sebagai Admin,

Saya ingin melihat preview,

Agar dapat memastikan hasil generate sudah benar.

---

# 7. User Flow

```
Dashboard

↓

Artikel

↓

Action

↓

Generate Carousel

↓

Loading

↓

Generate PNG

↓

Upload Cloudinary

↓

Generate ZIP

↓

Preview

↓

Download ZIP

↓

Close Modal

↓

Delete Temporary Assets
```

---

# 8. Business Rules

## BR-001

Hanya artikel Published yang dapat di-generate.

---

## BR-002

Artikel Draft tidak dapat di-generate.

---

## BR-003

Resolusi seluruh slide adalah

```
1080 × 1350 px
```

---

## BR-004

Output berupa

```
ZIP
```

---

## BR-005

Nama ZIP

```
{slug}.zip
```

Contoh

```
edisi-sebelum-jadi-atlantis.zip
```

---

## BR-006

Nama PNG

```
01.png
02.png
03.png
...
```

---

## BR-007

Maksimum

```
20 slide
```

Total terdiri dari:

- Cover
- Body
- CTA

Jika artikel lebih panjang,

Sistem hanya menghasilkan maksimal 20 slide.

---

## BR-008

Asset preview bersifat temporary.

Setelah modal ditutup,

seluruh asset temporary di Cloudinary dihapus.

---

# 9. Rendering Source

Sistem TIDAK mengambil screenshot halaman public.

Sistem menggunakan halaman export khusus.

Contoh

```
/articles/{slug}/export
```

Halaman export hanya berisi:

- Kategori
- Judul
- Metadata
- Cover
- Isi Artikel

Tidak terdapat:

- Navbar
- Breadcrumb
- Sidebar
- Share Button
- Related Articles
- Footer Website

---

# 10. Screenshot Algorithm

## Slide 1

```
Header IG

1080 × 240

+

Screenshot Artikel

Y = 0

Height = 1110
```

Output

```
1080 × 1350
```

---

## Slide Body

Dimulai dari

```
Y = 1110
```

Capture

```
Width

1080

Height

1350
```

Loop

```
offset += 1350
```

hingga selesai.

---

## Slide Terakhir

CTA.

Bukan screenshot.

---

# 11. Slide Composition

## Slide 1

```
Header Instagram

+

Kategori

Judul

Metadata

Cover

Awal Isi Artikel
```

---

## Slide 2 dst

```
Screenshot Body
```

---

## Slide Terakhir

```
BACA SELENGKAPNYA

Judul Artikel

QR Code

Scan QR Code
untuk membaca artikel lengkap.

hmisemarang.org
```

---

# 12. QR Code

QR Code mengarah ke

```
https://hmisemarang.org/articles/{slug}
```

Ukuran

```
±450 × 450 px
```

Center.

---

# 13. Page Indicator

Seluruh slide memiliki indikator.

Contoh

```
1/10

2/10

...

10/10
```

Posisi

```
Bottom Right
```

Koordinat

```
X = 1000

Y = 1300
```

---

# 14. Preview

Setelah generate selesai,

Modal Preview ditampilkan.

```
┌───────────────────────────────┐
│ ←           3 / 10         × │
├───────────────────────────────┤
│                               │
│                               │
│       Preview PNG             │
│                               │
│                               │
├───────────────────────────────┤
│  <                     >      │
├───────────────────────────────┤
│        Download ZIP           │
└───────────────────────────────┘
```

Preview menggunakan

PNG hasil generate.

---

# 15. Loading

Selama proses generate.

```
███████████░░░░░░░░

Slide 4 of 12
```

---

# 16. Download

Klik

```
Download ZIP
```

Browser mengunduh

```
{slug}.zip
```

---

# 17. Error Handling

Jika render gagal.

Modal menampilkan

```
Gagal membuat carousel.

Silakan coba kembali.
```

Detail error disimpan pada server log.

---

# 18. Cloudinary

Seluruh PNG diupload sebagai temporary asset.

Digunakan untuk:

- Preview
- ZIP Generation

Setelah modal ditutup

↓

Delete seluruh asset temporary.

---

# 19. Acceptance Criteria

## AC-001

Generate Carousel hanya tersedia pada artikel Published.

---

## AC-002

Slide pertama terdiri dari:

- Header IG
- Screenshot artikel setinggi 1110 px.

---

## AC-003

Body menggunakan screenshot berturut-turut.

---

## AC-004

CTA selalu menjadi slide terakhir.

---

## AC-005

Nomor halaman muncul pada seluruh slide.

---

## AC-006

Output berupa

```
ZIP
```

---

## AC-007

ZIP berisi

```
01.png
02.png
03.png
...
```

---

## AC-008

Seluruh PNG berukuran

```
1080 × 1350
```

---

## AC-009

Preview menggunakan PNG hasil generate.

---

## AC-010

Cloudinary asset dihapus setelah modal ditutup.

---

## AC-011

Jika artikel menghasilkan lebih dari 20 slide,

Sistem hanya menghasilkan maksimal 20 slide.

---

# 20. Future Enhancement

- Multiple Template
- Instagram Story Export
- Square Export
- LinkedIn Export
- Facebook Export
- AI Caption Generator
- AI Carousel Summary
- Batch Generate
- Schedule Auto Publish

# 21. UI / UX Specification

## 21.1 Entry Point

Fitur **Generate Carousel** tersedia pada halaman **CMS → Artikel** melalui menu **Action**.

```text
Dashboard
    │
    ▼
Artikel
    │
    ▼
Action
    │
    ▼
Generate Carousel
```

Hanya artikel dengan status **Published** yang dapat menggunakan fitur ini.

---

## 21.2 Generate Carousel Modal

Ketika Admin memilih **Generate Carousel**, sistem akan menampilkan modal konfigurasi sebelum proses dimulai.

Modal terdiri dari beberapa section.

### Header Carousel

Header digunakan pada **Slide Cover**.

Admin memiliki dua pilihan.

#### Opsi 1 — Gunakan Header Terakhir

Sistem akan otomatis menampilkan header terakhir yang pernah digunakan oleh Admin.

Informasi yang ditampilkan:

- Preview Header
- Nama File
- Tanggal terakhir digunakan

Action:

- **Gunakan Header Terakhir**

Apabila dipilih, sistem langsung menggunakan header tersebut.

---

#### Opsi 2 — Upload Header Baru

Admin dapat mengganti header kapan saja.

Ketentuan:

- Format: PNG
- Resolusi: **1080 × 240 px**
- Maksimum ukuran file mengikuti konfigurasi upload sistem.

Setelah upload berhasil.

Preview Header langsung diperbarui.

Header yang digunakan terakhir akan disimpan sebagai **Header Terakhir** milik Admin untuk proses generate berikutnya.

---

### Informasi Artikel

Modal menampilkan informasi artikel.

- Judul Artikel
- Kategori
- Slug
- Status Publish

---

### Informasi Output

Output yang akan dihasilkan.

- Resolusi: 1080 × 1350 px
- Format: PNG
- Download: ZIP

---

### Action Button

Button tersedia:

- Cancel
- Generate Carousel

Validasi:

- Tombol **Generate Carousel** hanya aktif apabila Header telah tersedia (Header Terakhir atau Header Baru).

---

## 21.3 Loading State

Setelah Admin menekan **Generate Carousel**, modal berubah menjadi Loading State.

Informasi yang ditampilkan:

- Progress Bar
- Jumlah slide yang sedang diproses

Contoh:

```text
████████████░░░░░░░░

Slide 4 of 12
```

Selama proses berlangsung:

- Tombol Generate dinonaktifkan.
- Tombol Close dinonaktifkan.
- Tidak dapat menutup modal.

---

## 21.4 Preview State

Apabila proses generate berhasil.

Modal berubah menjadi Preview.

Preview menggunakan **PNG hasil generate**, bukan melakukan render ulang HTML.

Komponen Preview:

- Preview Image
- Nomor Slide
- Tombol Previous
- Tombol Next
- Download ZIP
- Close

Admin dapat memeriksa seluruh hasil generate sebelum mengunduh.

---

## 21.5 Download ZIP

Ketika tombol **Download ZIP** ditekan.

Browser akan langsung mengunduh.

```
{slug}.zip
```

Isi ZIP:

```
01.png
02.png
03.png
...
```

---

## 21.6 Close Preview

Apabila Admin menutup modal Preview.

Sistem akan melakukan cleanup.

- Menghapus seluruh PNG temporary dari Cloudinary.
- Menghapus file ZIP temporary.
- Menghapus seluruh temporary resource yang dibuat selama proses Generate Carousel.

Tidak ada file yang disimpan permanen selain Header Terakhir milik Admin.

---

# 22. Technical Design Document (TDD)

## 22.1 Overview

Generate Carousel merupakan proses rendering server-side yang mengubah artikel website menjadi carousel Instagram.

Rendering dilakukan menggunakan Playwright.

Output berupa PNG yang kemudian dikompres menjadi ZIP.

---

## 22.2 Rendering Engine

Engine yang digunakan:

- Playwright

Playwright bertugas:

- Membuka halaman export.
- Menunggu seluruh asset selesai dimuat.
- Mengambil screenshot berdasarkan koordinat.
- Menyimpan hasil screenshot.

---

## 22.3 Export Page

Rendering dilakukan menggunakan halaman export khusus.

Contoh URL:

```
/articles/{slug}/export
```

Halaman export hanya memuat:

- Label Kategori
- Judul
- Metadata
- Cover Image
- Isi Artikel

Tidak memuat:

- Navbar
- Breadcrumb
- Sidebar
- Share Button
- Artikel Terkait
- Footer Website

Tujuan:

Menghasilkan screenshot yang konsisten dan tidak dipengaruhi layout website publik.

---

## 22.4 Rendering Flow

### Cover

Slide pertama terdiri dari:

Header PNG

```
1080 × 240
```

+

Screenshot Artikel

```
Y = 0

Height = 1110
```

Output:

```
1080 × 1350
```

---

### Body

Screenshot dimulai dari:

```
Y = 1110
```

Setiap screenshot memiliki ukuran:

```
Width

1080

Height

1350
```

Setelah setiap screenshot selesai.

Offset bertambah:

```
offset += 1350
```

Loop dilakukan hingga:

- Konten artikel selesai.
- Atau mencapai maksimum 20 slide.

---

### CTA

Slide terakhir tidak menggunakan screenshot.

Slide dibuat menggunakan template HTML.

Isi:

- BACA SELENGKAPNYA
- Judul Artikel
- QR Code
- Caption
- Website

---

## 22.5 QR Code

QR Code otomatis dibuat.

URL tujuan:

```
https://hmisemarang.org/articles/{slug}
```

Ukuran QR:

±450 × 450 px.

---

## 22.6 Page Indicator

Seluruh slide memiliki indikator halaman.

Contoh:

```
1/10

2/10

3/10
```

Posisi:

Bottom Right.

Koordinat:

```
X = 1000

Y = 1300
```

---

## 22.7 Cloudinary

PNG hasil generate diupload ke Cloudinary sebagai temporary asset.

Digunakan untuk:

- Preview
- Penyusunan ZIP

PNG tidak disimpan permanen.

Setelah modal ditutup.

Seluruh asset temporary dihapus.

---

## 22.8 ZIP Generation

ZIP dibuat menggunakan JSZip.

Nama ZIP:

```
{slug}.zip
```

Isi:

```
01.png
02.png
03.png
...
```

Browser menerima ZIP sebagai file download.

---

## 22.9 Header Storage

Header terakhir yang digunakan oleh Admin disimpan sebagai preferensi pengguna.

Header ini digunakan untuk mempermudah proses generate berikutnya.

Admin tetap dapat mengganti Header kapan saja.

Mengganti Header akan memperbarui Header Terakhir.

---

## 22.10 Error Logging

Server mencatat seluruh error.

Contoh:

- Playwright Error
- Cloudinary Error
- JSZip Error
- Upload Error
- Rendering Error

User hanya menerima pesan:

```
Gagal membuat carousel.

Silakan coba kembali.
```

---

# 23. API Specification

## Endpoint

```
POST /api/articles/{id}/generate-carousel
```

---

## Authorization

Hanya dapat diakses oleh:

- Admin Cabang

---

## Request

Payload terdiri dari:

- Article ID
- Header PNG

Apabila Admin memilih **Gunakan Header Terakhir**, sistem akan menggunakan Header Terakhir yang tersimpan.

Apabila Admin memilih **Upload Header Baru**, sistem menggunakan file tersebut dan memperbarui Header Terakhir.

---

## Validation

Sebelum proses dimulai.

Server melakukan validasi.

- Artikel ditemukan.
- Artikel berstatus Published.
- Header tersedia.
- Header berformat PNG.
- Resolusi Header sesuai.
- Artikel memiliki slug.

Apabila salah satu gagal.

Request dihentikan.

---

## Process Flow

Server menjalankan proses berikut.

1. Validasi Request.
2. Memuat Header.
3. Membuka halaman Export.
4. Generate Cover.
5. Generate seluruh Body.
6. Generate CTA.
7. Upload seluruh PNG ke Cloudinary.
8. Generate ZIP menggunakan JSZip.
9. Mengembalikan data Preview.

---

## Success Response

Response berisi:

- Status
- Total Slide
- Daftar URL PNG Preview
- URL ZIP
- Session ID

Frontend menggunakan URL PNG untuk Preview.

Browser menggunakan URL ZIP untuk Download.

---

## Error Response

Kemungkinan error.

- Artikel tidak ditemukan.
- Artikel belum Publish.
- Header belum tersedia.
- Format Header tidak sesuai.
- Resolusi Header tidak sesuai.
- Rendering gagal.
- Upload Cloudinary gagal.
- ZIP gagal dibuat.

Frontend hanya menampilkan.

```
Gagal membuat carousel.

Silakan coba kembali.
```

Detail error hanya tersedia pada server log.

---

## Preview Session

Selama Preview masih dibuka.

PNG temporary tetap tersedia di Cloudinary.

Setelah Admin menutup modal.

Frontend mengirim request untuk mengakhiri Preview Session.

Server akan:

- Menghapus seluruh PNG temporary.
- Menghapus ZIP temporary.
- Membersihkan seluruh resource yang dibuat selama proses Generate Carousel.

Dengan demikian tidak ada temporary asset yang tertinggal di Cloudinary maupun server.