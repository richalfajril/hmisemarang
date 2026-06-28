# Homepage Section Specification

## Section 03 — Commissariat Carousel

### Purpose

Section ini memperkenalkan seluruh Komisariat HMI Cabang Semarang kepada pengunjung sebagai representasi jaringan kaderisasi yang tersebar di berbagai perguruan tinggi.

Section ini bertujuan menunjukkan cakupan organisasi sekaligus memberikan akses cepat menuju halaman profil masing-masing komisariat.

---

## User Flow

Pengunjung menyelesaikan Hero Section.

↓

Melihat daftar komisariat melalui Infinite Carousel.

↓

Memilih salah satu komisariat.

↓

Masuk ke halaman detail komisariat.

---

## Section Layout

Struktur section:

```txt
Section Header
│
├── Left
│   ├── Eyebrow
│   ├── Heading
│   └── Subheading
│
└── Right
    └── CTA
```

Di bawah Section Header:

```txt
Infinite Carousel
```

---

## Section Header

### Left Column

#### Eyebrow

```txt
Komisariat
```

---

#### Heading

```txt
Komisariat HMI Cabang Semarang
```

---

#### Subheading

```txt
HMI Cabang Semarang menaungi berbagai komisariat di berbagai perguruan tinggi.
```

---

### Right Column

CTA:

```txt
Lihat Seluruh Komisariat →
```

Aksi:

```txt
/komisariat
```

Desktop:

CTA berada sejajar dengan Heading.

Mobile:

CTA berpindah ke bawah Subheading.

---

## Carousel

Jenis:

```txt
Infinite Carousel
```

Behavior:

- Auto Scroll
- Manual Drag
- Swipe pada Mobile
- Pause ketika Hover (Desktop)
- Loop tanpa akhir

Urutan data:

```txt
Alphabetical
```

Berdasarkan nama komisariat.

---

## Card Design

Jenis:

```txt
Landscape Card
```

Layout:

```txt
┌─────────────────────────────────────────────┐
│             │                               │
│    LOGO     │ Nama Komisariat               │
│             │ Universitas                   │
│             │ 👥 185 Kader                  │
│             │                               │
└─────────────────────────────────────────────┘
```

---

## Card Layout

### Left Column

Logo Komisariat.

Bentuk:

```txt
Rounded Square
```

Logo menggunakan rasio asli tanpa dipotong menjadi lingkaran.

---

### Right Column

Stack Layout.

Urutan:

1. Nama Komisariat
2. Nama Perguruan Tinggi
3. Jumlah Kader Terverifikasi

Contoh:

```txt
Komisariat UNDIP

Universitas Diponegoro

👥 185 Kader
```

---

## Interaction

Seluruh card dapat diklik.

Tujuan:

```txt
/komisariat/[slug]
```

Hover (Desktop):

- Shadow meningkat
- Card sedikit terangkat
- Cursor berubah menjadi pointer

Mobile:

- Tap langsung menuju halaman detail.

---

## Empty State

Jika belum terdapat data komisariat:

- Menampilkan data fallback sementara (hardcoded).
- Setelah CMS aktif sepenuhnya, fallback digantikan data dari database.

---

## Data Source

Seluruh data berasal dari CMS.

Field yang digunakan:

- Logo
- Nama Komisariat
- Nama Perguruan Tinggi
- Jumlah Kader Terverifikasi
- Slug

---

## Acceptance Criteria

- Header menggunakan layout dua kolom.
- Kolom kiri berisi Eyebrow, Heading, dan Subheading.
- Kolom kanan berisi CTA "Lihat Seluruh Komisariat".
- CTA menuju halaman `/komisariat`.
- Carousel menggunakan Infinite Loop.
- Card berbentuk Landscape.
- Logo menggunakan Rounded Square.
- Informasi card ditampilkan dalam stack vertikal.
- Seluruh card dapat diklik menuju halaman detail komisariat.
- Desktop mendukung hover animation.
- Mobile mendukung swipe gesture.
- Data diurutkan berdasarkan alfabet.
- Mendukung fallback data sebelum integrasi CMS selesai.

---

## Catatan Implementasi

**Keputusan: Section terpisah diganti dengan strip di hero bottom (2026-06-27)**

Section komisariat terpisah (header dua kolom + landscape card) tidak diimplementasikan. Sebagai gantinya, carousel komisariat diintegrasikan langsung ke dalam `HomeHero` sebagai strip identitas di `absolute bottom-0`.

Perubahan dari spec:
- Tidak ada section header (eyebrow, heading, subheading, CTA)
- Card landscape diganti dengan item pill: logo rounded square (48×48) + nama komisariat bold putih
- Tidak ada info kampus atau jumlah kader pada item carousel
- Carousel ditempatkan di overlay bawah hero, bukan section tersendiri di bawah hero

Alasan: desain lebih ringan dan tetap memberikan identitas jaringan komisariat tanpa memecah visual hero.

Section komisariat lengkap (dengan header + landscape card) dapat diimplementasikan sebagai Fase 2 homepage jika diperlukan.
