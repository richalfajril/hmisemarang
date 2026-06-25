# Homepage Section Specification

## Section 01 — Opening Screen

### Purpose

Opening Screen berfungsi sebagai elemen branding awal yang memperkenalkan identitas khas HMI sebelum pengunjung memasuki halaman utama website.

Section ini tidak dimaksudkan sebagai loading screen, melainkan sebagai pengalaman visual singkat yang memperkuat slogan organisasi:

**YAKIN • USAHA • SAMPAI**

---

## User Flow

Pengunjung membuka website.

↓

Opening Screen tampil otomatis.

↓

Kata-kata muncul secara bergantian dengan efek fade.

↓

Setelah seluruh animasi selesai, layar melakukan fade transition menuju Homepage.

↓

Opening Screen tidak ditampilkan kembali selama session browser yang sama.

---

## Visual Specification

### Background

Jenis:

```txt
Emerald Gradient + Subtle Islamic Pattern
```

Karakteristik:

- Dominan warna emerald.
- Menggunakan gradasi gelap ke terang.
- Memiliki pola islami/geometris yang sangat halus.
- Pattern tidak boleh mengganggu keterbacaan teks.

---

### Content

Posisi:

```txt
Horizontal Center
Vertical Center
```

Konten:

```txt
YAKIN
USAHA
SAMPAI
```

Warna:

```txt
White
```

Typography:

```txt
Bold
Uppercase
Large Display Size
```

Logo HMI:

```txt
Tidak ditampilkan
```

---

## Animation Specification

### Sequence

Tahap 1:

```txt
YAKIN
```

Fade In

↓

Fade Out

---

Tahap 2:

```txt
USAHA
```

Fade In

↓

Fade Out

---

Tahap 3:

```txt
SAMPAI
```

Fade In

↓

Fade Out

---

### Timing

Per kata:

```txt
± 800 ms
```

Transisi:

```txt
± 200 ms
```

Total Durasi:

```txt
± 2–3 detik
```

---

## Transition to Homepage

Jenis:

```txt
Fade Transition
```

Durasi:

```txt
300–500 ms
```

Setelah animasi selesai:

```txt
Opening Screen
↓
Fade Out
↓
Homepage Hero Section
```

---

## Session Rules

Opening Screen hanya muncul:

```txt
1 kali per browser session
```

Implementasi:

```txt
sessionStorage
```

Contoh:

homepage pertama:

```txt
Opening Screen tampil
```

membuka artikel:

```txt
Tidak tampil
```

refresh halaman:

```txt
Tidak tampil
```

tab browser baru:

```txt
Tampil kembali
```

---

## Accessibility

- Tidak menggunakan audio.
- Tidak menggunakan efek berkedip cepat.
- Animasi harus tetap dapat dilewati oleh pengguna yang mengaktifkan reduced motion.
- Kontras teks minimal memenuhi WCAG AA.

---

## Acceptance Criteria

- Background menggunakan emerald gradient dengan pattern islami halus.
- Kata YAKIN, USAHA, dan SAMPAI muncul bergantian menggunakan fade animation.
- Tidak ada logo HMI pada Opening Screen.
- Total durasi animasi sekitar 2–3 detik.
- Setelah selesai melakukan fade ke Homepage.
- Hanya muncul sekali dalam satu browser session.
- Tidak menggunakan audio.
