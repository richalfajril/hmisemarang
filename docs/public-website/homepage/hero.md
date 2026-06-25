# Hero Section

## Purpose

Hero menjadi titik fokus utama Homepage yang memperkenalkan identitas HMI Cabang Semarang kepada pengunjung dalam beberapa detik pertama setelah Opening Screen selesai.

Hero harus mampu menjelaskan:

* Siapa HMI Cabang Semarang
* Apa perannya
* Seberapa besar jangkauan organisasinya
* Kemana pengguna harus melanjutkan eksplorasi

---

## Layout

Jenis:

```txt
Full Screen Hero
```

Tinggi:

```txt
100vh
```

Struktur:

```txt
Navbar (Transparent)

↓

Eyebrow

↓

Heading

↓

Subheading

↓

CTA

↓

Metrics
```

Semua konten berada di atas overlay dan background image.

---

## Background

Sumber:

```txt
Website Settings CMS
```

Background image dapat diganti melalui CMS tanpa proses deploy.

Jenis:

```txt
Hero Background Image
+
Emerald Gradient Overlay
+
Subtle Islamic Pattern
```

Overlay:

```txt
40%
```

Tujuan:

* Menjaga keterbacaan teks
* Tetap mempertahankan detail gambar

---

## Eyebrow

```txt
HMI Cabang Semarang
```

Posisi:

Di atas Heading.

Gaya:

* Uppercase
* Small Text
* Letter Spacing Lebar
* Semi Bold

---

## Heading

```txt
Membangun Kader Umat
dan Bangsa dari Semarang
```

Gaya:

* Display Heading
* Bold
* Maksimal 2 Baris

---

## Subheading

```txt
HMI Cabang Semarang menjadi ruang kaderisasi, gagasan, dan pengabdian bagi mahasiswa Islam untuk berkontribusi nyata bagi agama dan negara.
```

Tujuan:

Menjelaskan peran organisasi secara singkat.

---

## CTA

### Primary CTA

Label:

```txt
Selengkapnya
```

Aksi:

```txt
Scroll ke About HMI Semarang
```

---

### Secondary CTA

Label:

```txt
Login
```

Aksi:

```txt
/login
```

---

## Metrics

Ditampilkan tepat di bawah CTA.

Format:

```txt
15
Komisariat

12
Korkom

30
Kampus

2500+
Kader
```

Data bersumber dari database.

Jenis:

```txt
Inline Metrics
```

Bukan card.

---

## Navbar Behavior

Saat posisi hero aktif:

```txt
Navbar Transparent
```

Logo:

```txt
White Theme Logo
```

Menu:

```txt
White
```

---

Saat pengguna scroll:

```txt
Navbar Solid Background
```

Logo:

```txt
Dark Theme Logo
```

Menu:

```txt
Dark
```

Transisi:

```txt
Smooth Fade
```

---

## Accessibility

* Kontras teks memenuhi WCAG AA.
* CTA dapat diakses melalui keyboard.
* Background image tidak boleh mengurangi keterbacaan teks.
* Hero tetap terbaca dengan baik pada layar mobile.

---

## Acceptance Criteria

* Hero menggunakan tinggi 100vh.
* Background image dapat dikelola melalui CMS.
* Overlay 40% menjaga keterbacaan.
* Eyebrow menggunakan teks "HMI Cabang Semarang".
* Heading menggunakan kalimat resmi yang telah disetujui.
* CTA Selengkapnya melakukan smooth scroll ke section About.
* CTA Login mengarah ke `/login`.
* Metrics menampilkan Komisariat, Korkom, Kampus, dan Kader.
* Navbar transparan berubah menjadi solid saat scroll.
* Logo otomatis berganti antara versi putih dan hitam sesuai background navbar.