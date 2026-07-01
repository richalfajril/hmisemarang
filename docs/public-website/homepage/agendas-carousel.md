# Homepage Section Specification

## Section 06 — Upcoming Agenda

### Purpose

Section Upcoming Agenda menampilkan agenda HMI Cabang Semarang yang masih relevan untuk diikuti oleh pengunjung.

Agenda diurutkan berdasarkan kegiatan yang akan datang dan masih berada dalam periode publikasi.

---

## User Flow

Pengunjung menyelesaikan section Featured Articles.

↓

Melihat agenda yang sedang atau akan berlangsung.

↓

Memilih salah satu agenda.

↓

Masuk ke halaman detail agenda.

---

## Section Layout

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

Infinite Horizontal Carousel
```

---

## Section Header

### Left Column

#### Eyebrow

```txt
Agenda
```

#### Heading

```txt
Agenda Mendatang
```

#### Subheading

```txt
Ikuti berbagai kegiatan, diskusi, pelatihan, dan agenda HMI Cabang Semarang yang dapat diikuti oleh kader maupun masyarakat.
```

---

### Right Column

CTA

```txt
Agenda Lainnya →
```

Navigasi

```txt
/agenda
```

Desktop:

CTA berada di sisi kanan.

Mobile:

CTA berpindah ke bawah Subheading.

---

# Carousel

Jenis

```txt
Infinite Horizontal Carousel
```

Behavior

- Auto Scroll
- Infinite Loop
- Pause on Hover (Desktop)
- Swipe Gesture (Mobile)
- Manual Drag

---

## Card Design

Jenis

Vertical Event Card.

Layout mengikuti referensi desain yang telah disepakati.

```txt
┌────────────────────────────┐
│                   [ BADGE ]│
│        EVENT IMAGE         │
│                            │
│                            │
├────────────────────────────┤
│                            │
│ Judul Agenda               │
│                            │
│ 📅 15 Juli 2026            │
│ 📍 Aula Fakultas Hukum     │
│                            │
│ 3 Hari Lagi                │
│                            |
|  [    Lihat Detail ->   ]  │
└────────────────────────────┘
```

---

## Featured Image

- Rasio 4 : 5
- Full Width
- Menggunakan Flyer Agenda
- Mengikuti desain referensi

---

## Badge

Posisi

```txt
Top Right
```

Status dihitung otomatis berdasarkan tanggal.

Kemungkinan badge

```txt
Hari Ini

Akan Datang

Selesai
```

Badge selalu tampil di atas gambar.

---

## Countdown

Countdown hanya muncul apabila agenda masih akan datang.

Contoh

```txt
3 Hari Lagi

7 Hari Lagi

Besok
```

Agenda yang telah selesai tidak menampilkan countdown.

---

## Informasi Card

Urutan

- Judul Agenda
- Tanggal
- Lokasi

Homepage tidak menampilkan deskripsi agenda.

---

## Interaction

Seluruh card dapat diklik.

Navigasi

```txt
/agenda/[slug]
```

Hover

- Shadow meningkat
- Image Zoom
- Cursor Pointer

---

## Data Resolution Strategy

Prioritas data

1. Agenda dari CMS.
2. Data fallback apabila jumlah agenda belum mencukupi.

Fallback digunakan selama proses pengembangan maupun ketika CMS belum memiliki cukup data.

---

## Responsive Behavior

Desktop

- Infinite Carousel

Tablet

- Infinite Carousel

Mobile

- Swipe Carousel

---

## Data States

Mengikuti standar global `DESIGN.md` §16 (Public Website Data States).

**Data Source:** **Dynamic** — Agenda `PUBLISHED` dari DB (`start_datetime`, `end_datetime`, `location_name`, `flyer_url`). Status/badge/countdown dihitung dari tanggal. Lihat *Data Resolution Strategy* untuk Success.

**Loading State:** Skeleton kartu agenda (flyer `4:5` + baris teks) sepanjang carousel via `Suspense`, mencegah CLS.

**Success State:** CMS dulu → fallback bila belum cukup (fallback bukan loading).

**Error State:** Fetch gagal → Graceful Fallback UI (kartu fallback / empty state), tinggi section dipertahankan, tanpa pesan teknis.

---

## Acceptance Criteria

- Header menggunakan layout dua kolom.
- CTA mengarah ke halaman `/agenda`.
- Menggunakan Infinite Horizontal Carousel.
- Flyer menggunakan rasio 4:5.
- Badge tampil di kanan atas gambar.
- Badge dihitung otomatis berdasarkan status agenda.
- Countdown hanya muncul untuk agenda yang akan datang.
- Card menampilkan Judul, Tanggal, dan Lokasi.
- Seluruh card dapat diklik menuju halaman detail agenda.
- Data menggunakan strategi CMS terlebih dahulu kemudian fallback apabila diperlukan.

---

## Catatan Implementasi (2026-06-28)

Diimplementasikan di `widgets/home/ui/HomeAgenda.tsx` + `AgendaCarousel.tsx`, card mengikuti referensi gambar user.
- **Carousel** infinite horizontal me-reuse pola rAF `CommissariatCarousel` (auto-scroll, pause-on-hover, drag mouse, swipe touch, loop via doubled array).
- **Card vertical**: flyer `aspect-[4/5]` + badge status kanan-atas (hijau utk "Akan Datang"/"Hari Ini", abu utk "Selesai"); body putih berisi judul (2 baris), 📅 tanggal, 📍 lokasi, countdown, tombol outline full-width "Lihat Detail" (atau "Lihat Dokumentasi" bila selesai).
- **Status, badge, countdown, format tanggal** dihitung otomatis dari `start_datetime`/`end_datetime` via helper pure `shared/lib/agenda.ts` (bukan dari enum workflow). Countdown hanya muncul untuk agenda upcoming.
- Data: `getUpcomingAgendas()` (`status: PUBLISHED`, urut `start_datetime asc`) → fallback hardcoded bila kurang.
