# Homepage Section Specification

## Section 07 — Call To Action Banner

### Purpose

Section Call To Action (CTA) mengajak pengunjung untuk mengenal HMI Cabang Semarang lebih jauh melalui galeri kegiatan atau menghubungi pengurus untuk memperoleh informasi mengenai program, kegiatan, maupun peluang kolaborasi.

Section ini menjadi penutup utama sebelum pengunjung memasuki bagian Testimoni dan Footer.

---

## User Flow

Pengunjung menyelesaikan Gallery Preview.

↓

Melihat CTA Banner.

↓

Memilih salah satu aksi.

- Melihat Galeri
- Menghubungi HMI Cabang Semarang

---

## Section Layout

```txt
Full Width Banner

────────────────────────────────────────

              Heading

            Subheading

      Button 1     Button 2

────────────────────────────────────────
```

Section menggunakan layout terpusat (center aligned).

---

## Background

Menggunakan warna utama (Primary / Emerald).

Mengikuti identitas visual HMI Cabang Semarang.

Background menggunakan decorative pattern pada sisi kiri atas dan kanan bawah sesuai referensi desain.

Pattern bersifat dekoratif dan tidak mengganggu keterbacaan teks.

---

## Content

### Heading

```txt
Cari Tahu Tentang Kami Lebih Banyak
```

---

### Subheading

```txt
Lihat galeri kegiatan kami atau hubungi kontak untuk informasi lebih lanjut mengenai program dan kolaborasi.
```

---

## Buttons

### Primary Button

Label

```txt
Lihat Galeri
```

Navigasi

```txt
/galeri
```

Style

- Filled Button
- White Background
- Primary Text

---

### Secondary Button

Label

```txt
Hubungi Kami
```

Navigasi

```txt
/kontak
```

Style

- Outline Button
- White Border
- White Text

---

## Animation

Saat section memasuki viewport

- Fade Up
- Sedikit Scale In

Hover Button

Primary

- Shadow meningkat
- Sedikit terangkat

Secondary

- Background berubah semi transparan putih
- Transition halus

---

## Responsive Behavior

### Desktop

Konten berada di tengah dengan dua tombol sejajar.

### Tablet

Ukuran banner menyesuaikan.

### Mobile

Button ditampilkan secara vertikal.

```txt
Lihat Galeri

Hubungi Kami
```

---

## Accessibility

- Kontras warna memenuhi standar WCAG.
- Seluruh tombol dapat diakses menggunakan keyboard.
- Focus state terlihat jelas.

---

## Data States

**Data Source:** **Static** — heading, subheading, label & tujuan tombol di-hardcode (copywriting manual). Sesuai `DESIGN.md` §16, section statis **dirender langsung tanpa Loading maupun Error State**.

---

## Acceptance Criteria

- Banner menggunakan warna utama HMI Cabang Semarang.
- Decorative pattern berada di kiri atas dan kanan bawah.
- Heading berada di tengah.
- Subheading berada di bawah Heading.
- Terdapat dua tombol CTA.
- Tombol "Lihat Galeri" menuju halaman `/galeri`.
- Tombol "Hubungi Kami" menuju halaman `/kontak`.
- Desktop menampilkan tombol secara horizontal.
- Mobile menampilkan tombol secara vertikal.
- Menggunakan animasi Fade Up saat muncul.
