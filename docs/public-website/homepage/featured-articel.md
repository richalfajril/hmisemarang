# Homepage Section Specification

## Section 05 — Featured Articles

### Purpose

Section Featured Articles menampilkan artikel unggulan dan artikel terbaru dari HMI Cabang Semarang sebagai media penyebaran gagasan, informasi, serta publikasi kegiatan organisasi.

Section ini bertujuan menarik pengunjung untuk membaca lebih lanjut melalui halaman artikel tanpa menampilkan terlalu banyak konten.

---

## User Flow

Pengunjung menyelesaikan section About HMI Cabang Semarang.

↓

Melihat artikel unggulan yang ditampilkan secara lebih dominan.

↓

Melihat artikel terbaru lainnya.

↓

Masuk ke halaman detail artikel atau halaman daftar artikel.

---

## Section Layout

Struktur:

```txt
Section Header
├── Left
│   ├── Eyebrow
│   ├── Heading
│   └── Subheading
│
└── Right
    └── CTA

↓

Featured Article Carousel

↓

Pagination Dots

↓

Secondary Articles Grid
```

---

## Section Header

### Left Column

#### Eyebrow

```txt
Artikel
```

#### Heading

```txt
Artikel Pilihan
```

#### Subheading

```txt
Ikuti berbagai kajian, opini, berita, dan informasi terbaru dari HMI Cabang Semarang.
```

---

### Right Column

CTA

```txt
Jelajahi Artikel →
```

Navigasi

```txt
/artikel
```

Desktop:

CTA berada sejajar dengan Heading.

Mobile:

CTA berada di bawah Subheading.

---

# Featured Article

## Layout

Menampilkan satu artikel unggulan dengan ukuran paling besar.

Layout mengikuti referensi desain yang telah disepakati.

Komponen:

- Featured Image
- Category
- Title
- Excerpt
- Publication Date

---

## Carousel

Jenis

```txt
Single Item Carousel
```

Behavior

- Auto Play
- Infinite Loop
- Fade Animation
- Pause on Hover (Desktop)

Interval

```txt
5 Seconds
```

---

## Pagination

Posisi

Di bawah Featured Article.

Jenis

```txt
Pagination Dots
```

Contoh

```txt
● ○ ○ ○
```

Dot aktif mengikuti artikel yang sedang ditampilkan.

Klik pada dot akan berpindah ke artikel terkait.

Tidak menggunakan tombol Previous maupun Next.

---

## Secondary Articles

Di bawah Featured Carousel ditampilkan dua artikel lainnya.

Layout

```txt
┌───────────────┐ ┌───────────────┐

Image

Category • Date

Title

Excerpt

└───────────────┘ └───────────────┘
```

---

## Card Design

Jenis

Vertical Editorial Card.

Featured Image

```txt
4 : 3
```

Komponen

- Featured Image
- Category
- Publication Date
- Title
- Excerpt

Seluruh card dapat diklik.

---

## Metadata

Homepage hanya menampilkan metadata sederhana.

Format

```txt
Category • Publication Date
```

Contoh

```txt
Kajian • 15 Juli 2026
```

Homepage tidak menampilkan:

- Author
- Reading Time
- Views

Informasi tersebut hanya tersedia pada halaman detail artikel.

---

## Excerpt

Excerpt digunakan sebagai ringkasan singkat isi artikel.

Panjang

```txt
Maximum 2 Lines
```

Apabila melebihi batas, gunakan ellipsis.

---

## Hover Interaction

Desktop

- Image Zoom
- Shadow meningkat
- Cursor Pointer

Mobile

- Tap langsung menuju halaman artikel.

---

## Data Resolution Strategy

Prioritas data

1. Featured Article dari CMS.
2. Artikel terbaru dari CMS.
3. Fallback Data apabila jumlah artikel belum mencukupi.

Fallback hanya digunakan selama proses pengembangan atau ketika CMS belum memiliki cukup konten.

---

## Responsive Behavior

### Desktop

- Featured Carousel penuh
- Dua Secondary Card berjajar

### Tablet

- Featured Carousel
- Dua Card dengan ukuran menyesuaikan

### Mobile

- Featured Carousel
- Secondary Card menjadi satu kolom

---

## Data States

Mengikuti standar global `DESIGN.md` §16 (Public Website Data States).

**Data Source:** **Dynamic** — Artikel `PUBLISHED` dari DB (`category`, `published_at`). Lihat *Data Resolution Strategy* di atas untuk Success.

**Loading State:** Skeleton bento (1 besar + 2 kartu) mengikuti layout aktual via `Suspense`, mencegah CLS.

**Success State:** CMS dulu → fallback bila jumlah < kebutuhan (fallback bukan loading).

**Error State:** Fetch gagal → Graceful Fallback UI (kartu fallback / empty state), tinggi section dipertahankan, tanpa pesan teknis.

---

## Acceptance Criteria

- Header menggunakan layout dua kolom.
- Featured Article menggunakan carousel satu item.
- Carousel menggunakan Fade Animation.
- Carousel berganti otomatis setiap 5 detik.
- Pagination menggunakan bulatan (Dots).
- Tidak menggunakan tombol Previous maupun Next.
- Menampilkan dua artikel sekunder di bawah Featured Carousel.
- Metadata hanya menampilkan Category dan Publication Date.
- Excerpt maksimal dua baris.
- Seluruh card dapat diklik menuju halaman detail artikel.
- Data menggunakan strategi CMS terlebih dahulu kemudian fallback apabila diperlukan.

---

## Catatan Implementasi

**Layout mengikuti referensi gambar user (2026-06-28)** — berbeda dari spec carousel.

Implementasi (`widgets/home/ui/HomeArticles.tsx` + `FeaturedCarousel.tsx`):
- **Bento layout**: kiri (`lg:col-span-2`) = `FeaturedCarousel` single-item; kanan = 2 card sekunder bertumpuk.
- **`FeaturedCarousel`** (client): single-item carousel sesuai spec — auto-play 5 detik, infinite loop (`(i+1) % len`), **fade animation** (crossfade opacity, slide absolute), pause on hover. **Pagination dots** di bawah card (dot aktif melebar, klik → pindah slide; tanpa tombol prev/next).
- Card sekunder dua varian: punya gambar → image overlay; tanpa gambar → card hijau solid (`bg-primary`).
- Data: query `take: 5` → 3 artikel pertama untuk carousel, 2 berikutnya untuk sekunder; fallback 5 hardcoded.

Sesuai spec: strategi data CMS → fallback, metadata `Kategori • Tanggal`, excerpt maksimal 2 baris, semua card clickable ke `/artikel/[slug]`, header dua kolom dengan CTA `/artikel`, hover image-zoom + shadow, carousel fade + auto-play 5s + pause hover, pagination dots tanpa prev/next.

Deviasi kecil: tata letak mengikuti referensi bento user (carousel besar di kiri + 2 sekunder di kanan), bukan carousel penuh dengan grid sekunder terpisah di bawah. "Featured" = artikel `PUBLISHED` terbaru (model `Article` tak punya flag `is_featured`).
