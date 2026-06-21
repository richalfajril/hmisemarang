# Otorisasi Lapis-Ganda (Middleware & Application-Level)

## Context
Sistem kepemilikan data HMI Cabang Semarang sangat terkunci: Admin Komisariat eksklusif menatap milik sendiri, sedangkan Cabang mengendalikan seluruhnya. Supabase membawa keahlian otorisasi internal *Postgres* (RLS).

## Problem
Berhadapan dengan *Prisma ORM*, memanfaatkan Row-Level Security (RLS) milik *Supabase/Postgres* mengharuskan injeksi token autentikasi di tingkat transaksi klien Prisma, yang amat rumit dikonfigurasi pada lingkar *Server Actions*.

## Decision
Melangkahi konfigurasi RLS *database* secara fungsional. Keamanan dialihkan menggunakan dua lapis ganda di Aplikasi:
1. *Middleware* pinggiran Next.js (penjaga gerbang) menghalau sesi kedaluwarsa dari rute `/dashboard`.
2. Semua *Server Actions* mewajibkan verifikasi Sesi ulang serta pencocokan parameter `commissariat_id` bersama label `UserRole` pengguna sebelum kueri Prisma berjalan (*Application-Level Authorization*).

## Consequences
Pengembang menanggung bebas beban kerentanan jika lupa membubuhi kode *session verify* di *Server Action*. Karenanya, telah diamanatkan di SKILLS.md bahwa pengecekan Sesi (*Auth*) adalah kode wajib di setiap fungsi peladen (*Server*).

## Related Documents
* `ROLE_PERMISSION_MATRIX.md`
* `SUPABASE_SETUP.md`
* `API_SPECIFICATION.md`
