# Homepage Section Specification

# Section 08 — Kata Mereka Tentang HMI

## Purpose

Section **Kata Mereka Tentang HMI** menampilkan kutipan inspiratif dari tokoh, alumni, akademisi, mitra, maupun pihak lain mengenai HMI.

Section ini menjadi penutup emosional Homepage sebelum Footer sekaligus memperkuat kepercayaan (Social Proof) terhadap HMI Cabang Semarang.

Seluruh konten dikelola melalui CMS.

---

# User Flow

Pengunjung menyelesaikan CTA Banner.

↓

Melihat berbagai kutipan inspiratif.

↓

Membaca beberapa testimoni melalui Infinite Carousel.

↓

Melanjutkan ke Footer.

---

# Section Layout

```txt
Eyebrow

Heading

Subheading

↓

Infinite Testimonial Carousel
```

Seluruh section menggunakan **Center Layout**.

---

# Section Header

## Eyebrow

```txt
Kata Mereka
```

---

## Heading

```txt
Apa Kata Mereka Tentang HMI?
```

---

## Subheading

```txt
Pandangan, pengalaman, dan inspirasi dari berbagai tokoh mengenai HMI sebagai organisasi kader, intelektual, dan pengabdian.
```

---

# Testimonial Carousel

Homepage menggunakan **Infinite Carousel**.

Carousel berjalan otomatis dan terus berulang.

Pengunjung tetap dapat melakukan drag maupun swipe.

---

# Testimonial Card

Setiap Card terdiri dari:

```txt
❝

Quote

────────────────────────

○ Avatar

Nama
Title
```

Layout mengikuti desain referensi yang telah disepakati.

---

# Quote

Quote menjadi fokus utama pada Card.

Panjang maksimum:

- 4 baris

Apabila melebihi batas, Quote dipotong menggunakan line clamp.

---

# Profile

Avatar berasal dari CMS.

Setiap Card menampilkan:

- Foto Profil
- Nama
- Title

Contoh:

```txt
Prof. Drs. H. Lafran Pane

Pendiri HMI • Pahlawan Nasional
```

---

# Data Source

Section ini menggunakan **Dynamic Data**.

Prioritas data:

1. CMS
2. Fallback Data

Fallback hanya digunakan apabila jumlah Testimoni belum mencukupi.

---

# CMS Integration

Section ini menggunakan modul CMS:

```txt
Testimoni
```

Role yang dapat mengelola:

- SYSTEM_ADMIN
- ADMIN_CABANG

---

# Entity

```ts
export interface Testimonial {
  id: string;

  photoUrl: string;

  quote: string;

  name: string;

  title: string;

  featured: boolean;

  displayOrder: number;

  isPublished: boolean;

  createdAt: Date;

  updatedAt: Date;
}
```

---

# Homepage Data Strategy

Prioritas data:

1. Featured Testimonial
2. Display Order
3. Fallback Data

Homepage hanya mengambil Testimoni dengan status:

```txt
Published
```

---

# Design System Contract

Testimonial Carousel merupakan reusable component.

Komponen hanya bertanggung jawab terhadap:

- Rendering Card
- Carousel Animation
- User Interaction

Komponen tidak melakukan:

- Fetching Data
- Sorting
- Filtering
- Business Logic
- Fallback Logic

Seluruh business logic dilakukan pada Homepage Server Component.

---

# Component API

```ts
export interface Testimonial {
  id: string;
  photoUrl: string;
  quote: string;
  name: string;
  title: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}
```

Homepage menggunakan:

```tsx
<TestimonialCarousel testimonials={testimonials} />
```

---

# Loading State

Menggunakan Skeleton Card.

Skeleton mengikuti ukuran Card sehingga tidak menyebabkan Cumulative Layout Shift (CLS).

---

# Success State

Prioritas:

CMS

↓

Fallback Data (Jika diperlukan)

---

# Error State

Apabila proses pengambilan data gagal:

Menampilkan Placeholder Card sederhana.

Layout Homepage tetap terjaga.

Tidak menampilkan pesan error teknis kepada pengguna.

---

# Carousel Behavior

Mendukung:

- Infinite Loop
- Auto Play
- Drag Gesture
- Swipe Gesture
- Smooth Animation

Desktop

Hover menghentikan Auto Play sementara.

---

# Animation

Section

- Fade Up

Carousel

- Smooth Transition

Card

- Fade Animation

Animasi mengikuti standar seluruh Homepage.

---

# Responsive Behavior

## Desktop

- Menampilkan 3 Card

## Tablet

- Menampilkan 2 Card

## Mobile

- Menampilkan 1 Card

Carousel tetap berjalan secara Infinite.

---

# Accessibility

- Avatar memiliki Alt Text.
- Quote dapat dibaca oleh Screen Reader.
- Keyboard Navigation didukung.
- Focus State terlihat jelas.
- Kontras warna memenuhi standar WCAG.

---

# Catatan Implementasi (2026-06-28)

Diimplementasikan: `widgets/home/ui/HomeTestimonials.tsx` (server, business logic) + `TestimonialCarousel.tsx` (client, presentasional — infinite marquee, auto-play, pause-on-hover, drag, swipe; card: Quote icon, quote italic `line-clamp-4`, avatar + nama + title).

**Modul CMS "Kata Mereka" sudah dibangun (2026-06-28):**
- **DB**: model `Testimonial` (`prisma/schema.prisma`) — `photo_url, quote, name, title, featured, display_order, is_published`, audit fields. `prisma db push`.
- **Entity**: `entities/testimonial/model/schema.ts` (Zod: nama/title/kutipan/foto wajib, display_order int ≥0).
- **Feature**: `features/testimonial-management` — `saveTestimonialAction` (create/update), `deleteTestimonialAction`, `togglePublishTestimonialAction` (semua: auth SYSTEM_ADMIN/ADMIN_CABANG → Zod → Prisma → Audit Log). UI `TestimonialForm` (ImageUploader avatar + nama/title/kutipan/featured/display_order/status) & `TestimonialList` (tabel foto/nama/title/featured/published/order/updated + aksi edit/publish-toggle/delete + cari nama).
- **Dashboard**: route `/dashboard/testimonials` (+`/new`, `/[id]/edit`), guard ADMIN_CABANG/SYSTEM_ADMIN. Sidebar grup "Konten" → item "Kata Mereka" (`QuoteIcon`, role ADMIN_CABANG_ONLY).
- **Public**: `getTestimonials()` query `is_published && featured`, urut `display_order asc` → `updated_at desc`, map `photo_url`→`getOptimizedUrl`. Fallback dipakai bila belum ada data.

Loading (Suspense + `TestimonialsSkeleton`) & Error (query `try/catch` → fallback) sesuai standar `DESIGN.md` §16. Komponen UI homepage tetap presentasional (props only).

---

# Acceptance Criteria

- Header menggunakan Center Layout.
- Carousel menggunakan Infinite Auto Play.
- Card mengikuti desain referensi.
- Quote berada di bagian atas Card.
- Avatar berada di kiri bawah.
- Nama dan Title berada di kanan Avatar.
- Data berasal dari CMS.
- Homepage hanya menampilkan Testimoni yang berstatus Published.
- Prioritas menampilkan Featured Testimonial sesuai Display Order.
- Mendukung Loading, Success, dan Error State.
- Skeleton digunakan ketika Loading.
- Fallback digunakan apabila jumlah data belum mencukupi.
- Carousel mendukung Auto Play, Drag, Swipe, dan Infinite Loop.
- Hover menghentikan Auto Play sementara pada Desktop.
- Seluruh business logic berada pada Homepage Server Component.
- Component hanya menerima Presentation Ready Data melalui props.
- Section mengikuti standar animasi Homepage.
