# Homepage Section Specification

## Section 04 — About HMI Cabang Semarang

### Purpose

Section ini memberikan pengenalan singkat mengenai HMI Cabang Semarang sebagai organisasi yang menaungi komisariat HMI di berbagai perguruan tinggi di Kota Semarang.

Section ini menjadi jembatan antara Hero dan konten publik dengan menjelaskan identitas, peran, serta komitmen organisasi secara ringkas sebelum pengunjung menjelajahi artikel, agenda, dan halaman lainnya.

---

## User Flow

Pengunjung menyelesaikan Hero Section.

↓

Mengenal HMI Cabang Semarang melalui ringkasan profil organisasi.

↓

Memilih untuk membaca profil lengkap melalui halaman Profil.

---

## Section Layout

Jenis:

```txt
Split Layout (50 : 50)
```

Struktur:

```txt
┌─────────────────────────────────────────────────────────────┐

Left Column                     Right Column

Eyebrow                         Featured Image

Heading

Description

Core Values

CTA

└─────────────────────────────────────────────────────────────┘
```

Desktop menggunakan dua kolom.

Mobile berubah menjadi satu kolom dengan gambar berada di bawah konten.

---

## Left Column

### Eyebrow

```txt
Tentang Kami
```

---

### Heading

```txt
Tentang HMI Cabang Semarang
```

---

### Description

Paragraph 1

> HMI Cabang Semarang merupakan kepengurusan cabang dari Himpunan Mahasiswa Islam (HMI) yang menaungi komisariat-komisariat HMI di berbagai perguruan tinggi di Kota Semarang. Sebagai bagian dari organisasi mahasiswa Islam yang didirikan pada 5 Februari 1947, HMI Cabang Semarang berkomitmen membina kader yang berlandaskan nilai-nilai keislaman, keindonesiaan, dan intelektualitas, serta berorientasi pada terwujudnya insan akademis, pencipta, pengabdi, yang bernafaskan Islam dan bertanggung jawab atas terwujudnya masyarakat adil dan makmur yang diridai Allah SWT.

Paragraph 2

> Dalam menjalankan perannya, HMI Cabang Semarang aktif menyelenggarakan kaderisasi, kajian ilmiah, advokasi kebijakan publik, pengabdian masyarakat, serta membangun kemitraan strategis dengan berbagai pemangku kepentingan. Melalui semangat intelektual, kepemimpinan, dan pengabdian, HMI Cabang Semarang terus berupaya melahirkan kader-kader yang adaptif terhadap perkembangan zaman, memiliki integritas moral, serta mampu memberikan kontribusi nyata bagi kemajuan kampus, daerah, dan bangsa.

---

### Core Values

Ditampilkan sebagai highlight sederhana.

```txt
✓ Yakin

✓ Usaha

✓ Sampai
```

Core Values bukan tombol maupun badge, melainkan elemen visual pendukung untuk memperkuat identitas organisasi.

---

### CTA

Label

```txt
Lihat Profil Lengkap →
```

Navigasi

```txt
/profil
```

---

## Right Column

### Featured Image

Sumber utama:

CMS Website Settings.

Administrator Cabang dapat mengganti gambar tanpa melakukan deploy aplikasi.

Selama proses pengembangan atau ketika gambar belum tersedia, gunakan placeholder berwarna abu-abu.

```txt
Priority:

CMS Image

↓

Placeholder
```

---

## Background

Jenis

```txt
Light Gradient
```

Background menggunakan gradasi terang yang sangat halus agar memberikan transisi visual dari Hero menuju section berikutnya tanpa mengganggu fokus pembaca.

---

## Animation

Saat section memasuki viewport:

- Fade Up
- Smooth Transition

Animasi hanya dijalankan satu kali ketika pertama kali terlihat.

---

## Responsive Behavior

### Desktop

- Split Layout 50 : 50
- Teks di kiri
- Gambar di kanan

### Tablet

- Rasio tetap dua kolom dengan penyesuaian lebar.

### Mobile

- Seluruh konten menjadi satu kolom.
- Gambar dipindahkan ke bawah konten.

---

## Acceptance Criteria

- Menggunakan layout dua kolom pada Desktop.
- Kolom kiri berisi Eyebrow, Heading, Description, Core Values, dan CTA.
- Kolom kanan menampilkan Featured Image.
- Featured Image berasal dari CMS.
- Placeholder digunakan apabila gambar belum tersedia.
- CTA mengarah ke halaman `/profil`.
- Core Values menampilkan "Yakin", "Usaha", dan "Sampai".
- Background menggunakan light gradient.
- Section menggunakan animasi Fade Up ketika muncul.
