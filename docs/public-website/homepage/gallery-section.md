# Homepage Section Specification

# Section 07 — Gallery Preview

## Purpose

Gallery Preview merupakan signature visual section pada Homepage HMI Cabang Semarang.

Section ini menampilkan dokumentasi kegiatan melalui representasi Album Galeri sehingga pengunjung dapat melihat aktivitas organisasi secara sekilas sebelum menjelajahi dokumentasi lengkap pada halaman Galeri.

Homepage hanya berfungsi sebagai showcase visual, bukan sebagai halaman galeri penuh.

---

# User Flow

Pengunjung menyelesaikan section Upcoming Agenda.

↓

Melihat Circular Gallery.

↓

Memilih salah satu Album.

↓

Masuk ke halaman `/galeri`.

↓

Menjelajahi seluruh Album dan Dokumentasi Kegiatan.

---

# Section Layout

```txt
Eyebrow

Heading

Subheading

↓

Circular Gallery

↓

Primary CTA
```

Seluruh section menggunakan **Center Layout**.

---

# Section Header

## Eyebrow

```txt
Galeri
```

---

## Heading

```txt
Dokumentasi Kegiatan
```

---

## Subheading

```txt
Lihat berbagai dokumentasi kegiatan HMI Cabang Semarang yang mencerminkan semangat kaderisasi, pengabdian, kolaborasi, dan perjalanan organisasi.
```

---

# Circular Gallery

Homepage menggunakan **Circular Gallery 3D** sebagai signature visual website.

Circular Gallery merupakan reusable component pada Design System dan hanya digunakan untuk merepresentasikan Album Galeri.

Homepage tidak menggunakan:

- Gallery Grid
- Masonry Grid
- Carousel konvensional

---

# Design System Contract

Circular Gallery merupakan komponen presentasional.

Komponen **tidak memiliki business logic**.

Komponen hanya bertanggung jawab terhadap:

- Rendering Album
- Animasi Rotasi
- Interaksi Pengguna

Komponen tidak melakukan:

- Fetching Data
- Filtering
- Sorting
- Fallback
- Pagination
- Business Rules

Seluruh business logic dilakukan pada Homepage Server Component.

---

# Component API

```ts
export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  isFeatured: boolean;
  featuredOrder?: number;
}

interface CircularGalleryProps {
  albums: GalleryAlbum[];
  radius?: number;
  autoRotateSpeed?: number;
}
```

Homepage menggunakan:

```tsx
<CircularGallery albums={albums} />
```

Bukan:

```tsx
<CircularGallery items={galleryData} />
```

---

# Data Resolution Strategy

Prioritas data:

1. Featured Album
2. Album Terbaru
3. Fallback Album

Apabila jumlah Album dari CMS belum mencukupi, Homepage secara otomatis menambahkan Album fallback sehingga Circular Gallery tetap penuh.

Fallback akan hilang secara otomatis ketika seluruh Album telah tersedia pada CMS.

---

# Homepage Data Flow

```txt
CMS

↓

Gallery Entity

↓

Server Action

↓

Homepage Server Component

↓

Featured Album

↓

Latest Album

↓

Fallback Album (Jika Diperlukan)

↓

<CircularGallery albums={albums} />
```

Circular Gallery selalu menerima **Presentation Ready Data**.

---

# Loading State

Circular Gallery menampilkan Skeleton Loader selama data Album sedang dimuat.

Skeleton mengikuti ukuran Circular Gallery sehingga tidak menyebabkan Layout Shift.

Ketika data selesai dimuat:

Skeleton

↓

Fade In

↓

Circular Gallery

Skeleton hanya digunakan selama proses loading.

---

# Empty State Strategy

Apabila proses loading selesai namun jumlah Album belum mencukupi, Homepage menggunakan Fallback Album.

Urutan:

```txt
Loading

↓

Skeleton

↓

Data Loaded

↓

Featured Album

↓

Latest Album

↓

Fallback Album (Jika Diperlukan)

↓

Circular Gallery
```

Fallback **bukan** Loading State.

---

# Album Card

Setiap Card merepresentasikan satu Album.

Layout

```txt
Cover Album

Gradient Overlay

Nama Album
```

Homepage hanya menampilkan:

- Cover Album
- Judul Album

Homepage tidak menampilkan:

- Jumlah Foto
- Caption
- Deskripsi
- Nama Fotografer
- Metadata Foto

---

# Interaction

Seluruh Album Card dapat diklik.

Navigasi

```txt
/galeri
```

Homepage tidak membuka:

- Lightbox
- Modal
- Album Detail

Halaman Galeri menjadi landing page seluruh Album.

---

# Circular Gallery Behavior

Jenis

- Infinite Circular Gallery

Mendukung

- Auto Rotation
- Infinite Rotation
- Scroll Based Rotation
- Manual Drag
- Touch Gesture
- Smooth Animation

Desktop

- Hover memperlambat rotasi agar Judul Album mudah dibaca.

Mobile

- Radius otomatis diperkecil.
- Jumlah Album disesuaikan demi performa.

---

# CMS Integration

Circular Gallery mengambil data dari Entity Gallery.

Field yang digunakan:

- title
- slug
- cover_image_url
- is_featured
- featured_order

Cover Album dipilih melalui CMS.

Homepage tidak mengambil daftar foto individual.

---

# CTA

Label

```txt
Jelajahi Galeri →
```

Navigasi

```txt
/galeri
```

CTA berada tepat di bawah Circular Gallery.

---

# Animation

Section

- Fade Up

Circular Gallery

- Auto Rotate
- Scroll Rotate
- Smooth Transition

CTA

- Fade Up dengan sedikit delay setelah Gallery muncul.

---

# Responsive Behavior

## Desktop

- Circular Gallery penuh
- Radius besar

## Tablet

- Radius diperkecil

## Mobile

- Radius lebih kecil
- Jumlah Album aktif dikurangi agar animasi tetap ringan
- Mendukung Swipe Gesture

---

# Accessibility

- Seluruh Album dapat diakses menggunakan Keyboard Navigation.
- Seluruh Cover Album memiliki Alt Text.
- Focus State terlihat jelas.
- Kontras memenuhi standar WCAG.

---

# Data States

Mengikuti standar global `DESIGN.md` §16 (Public Website Data States).

**Data Source:** **Dynamic** — Album `PUBLISHED` (cover dari CMS). Lihat *Data Resolution Strategy*, *Loading State*, dan *Empty State Strategy* di atas.

**Error State:** Bila fetch album gagal → Graceful Fallback UI: Circular Gallery memakai album fallback (placeholder gradien) sehingga lingkaran tetap penuh; tinggi section dipertahankan, tanpa pesan error teknis. Komponen `CircularGallery` tetap presentasional (tanpa fetch/fallback/business logic).

---

# Acceptance Criteria

- Header menggunakan Center Layout.
- Homepage menggunakan Circular Gallery 3D.
- Circular Gallery hanya menampilkan Album.
- Album Card hanya berisi Cover Album dan Judul Album.
- Component menggunakan props `albums`.
- Component tidak menggunakan model data demo (`items`, `common`, `binomial`, `photo.by`, dan sejenisnya).
- Seluruh business logic berada pada Homepage Server Component.
- Circular Gallery hanya bertanggung jawab pada rendering dan animasi.
- Data diprioritaskan dari Featured Album, Album Terbaru, kemudian Fallback Album.
- Skeleton hanya muncul ketika data sedang dimuat.
- Fallback hanya digunakan ketika data berhasil dimuat tetapi jumlah Album belum mencukupi.
- Seluruh Album mengarah ke halaman `/galeri`.
- CTA berada di bawah Circular Gallery.
- Homepage tidak menggunakan Lightbox.
- Circular Gallery berjalan otomatis dengan animasi halus pada seluruh ukuran layar.

---

## Catatan Implementasi (2026-06-28)

- **`CircularGallery`** (`widgets/home/ui/CircularGallery.tsx`, client) — komponen presentasional sesuai kontrak (props `albums`, tanpa business logic). Auto-rotate + scroll-based rotation + hover memperlambat rotasi + radius responsif (mengecil di layar sempit). Tiap album `Link` ke `/galeri` (keyboard-focusable + focus ring). Cover kosong → placeholder gradien emerald.
- **`HomeGallery`** (server) — seluruh business logic: fetch `getGalleryAlbums()` + map cover ke URL siap-tampil (`getOptimizedUrl`) + merge fallback bila album < 6.
- **Deviasi dari spec:**
  - Model `GalleryAlbum` belum memiliki `is_featured` / `featured_order` → prioritas data memakai **album terbaru** (`created_at desc`), belum featured-first. Tambah field tersebut bila prioritas featured diperlukan.
  - Manual drag & touch gesture penuh belum diimplementasikan; saat ini auto-rotate + scroll-rotation + hover-slow (sudah mulus di semua ukuran). Skeleton loader belum (homepage server-render, data tersedia saat render).
