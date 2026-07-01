# ADR 004: Migrasi Media Storage ke Cloudinary

## Status
Accepted

## Context
Awalnya, proyek HMI CMS dirancang menggunakan Supabase Storage (*Buckets*) untuk mengelola penyimpanan dokumen (publik dan privat) serta media gambar. Pendekatan ini dipilih agar seluruh infrastruktur *Backend-as-a-Service* (BaaS) dapat tersentralisasi di Supabase (Autentikasi, Database, dan Storage).
Namun, sering berjalannya waktu dan setelah melakukan tinjauan teknis lebih mendalam, terdapat kebutuhan ekstensif untuk optimasi gambar (pengubahan ukuran, konversi format otomatis ke WebP/AVIF) yang sulit dicapai secara dinamis (secara *on-the-fly*) menggunakan fitur bawaan Next.js `next/image` jika *source* gambarnya berasal dari Supabase Storage tanpa integrasi *loader* kustom yang kompleks atau server *image proxy*. Selain itu, tagihan pemakaian *bandwidth* media di Supabase berpotensi membengkak lebih cepat dibandingkan layanan khusus CDN Media.

## Decision
Kita mengubah arsitektur *Storage* dari Supabase Storage menjadi **Cloudinary**.
Semua kebutuhan penyimpanan berkas, baik itu gambar galeri, foto profil, surat edaran (PDF), hingga verifikasi kader, akan diunggah dan ditangani oleh Cloudinary melalui *Cloudinary Node.js SDK* di Server Actions Next.js.
Untuk mengamankan dokumen rahasia, kita akan menggunakan mekanisme Cloudinary *Access Control* (seperti `type: 'authenticated'` atau `type: 'private'`) dikombinasikan dengan URL terotentikasi (*Signed URLs* Cloudinary) alih-alih *Signed URLs* milik Supabase.

## Consequences
- **Positif:** 
  - Optimasi gambar (kompresi, resolusi, format `webp`) ditangani secara otomatis melalui parameter URL Cloudinary.
  - Beban peladen Vercel dan Supabase berkurang secara signifikan karena media disalurkan lewat CDN global Cloudinary.
  - Tersedia fitur manipulasi gambar bawaan (seperti pemotongan wajah otomatis / *face-detection cropping*) untuk foto profil.
- **Negatif:**
  - Infrastruktur terpecah menjadi tiga layanan utama: Vercel (Hosting), Supabase (Auth & DB), dan Cloudinary (Media).
  - Variabel lingkungan (*Environment Variables*) bertambah (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
  - Harus membangun logika utilitas baru khusus untuk unggahan Cloudinary dan penandatanganan URL privat (*Signed URLs*).

## Roadmap Impact
Perubahan ini **tidak merusak** peta jalan (*roadmap*). Justru, perubahan ini menggantikan target dari `v1.7.0 Media & Files` yang tadinya difokuskan pada manipulasi Supabase Bucket, menjadi manipulasi folder Cloudinary. Tidak ada fitur bisnis yang dihapus atau ditambahkan, hanya perpindahan tulang punggung teknis.
