# SUPABASE_SETUP.md

## Purpose
Dokumen ini mendefinisikan arsitektur backend, autentikasi, storage, dan strategi integrasi antara Supabase dan Prisma untuk proyek CMS HMI Cabang Semarang.



---

## 1. Project Architecture

Proyek ini menggunakan arsitektur **Trusted Client**.
* **Database:** PostgreSQL (Hosted by Supabase).
* **ORM:** Prisma ORM.
* **Server:** Next.js Server Actions / API Routes.

**Primary Authorization Rule:**
Kita **TIDAK** menggunakan Supabase Row Level Security (RLS) sebagai layer otorisasi utama. Semua pengecekan hak akses (Role, `commissariat_id`, Workflow Status) dilakukan di level aplikasi (Application Layer) menggunakan Next.js Server Actions. Prisma akan terhubung ke database menggunakan URL koneksi yang memiliki hak akses penuh (Service Role/Pooler), dan aplikasi bertanggung jawab penuh mengamankan endpoint-nya.

---

## 2. Auth Architecture

* **Provider:** Supabase Auth (Email / Password).
* **Token Management:** Supabase SSR (Server-Side Rendering) package untuk mengelola *cookies* autentikasi di Next.js Server Components.

---

## 3. User Synchronization Strategy

Karena skema data kita memiliki relasi yang erat dengan tabel `users` (seperti `commissariat_id` dan `role`), kita harus melakukan sinkronisasi antara tabel `auth.users` milik Supabase dengan tabel `public.users` yang didefinisikan di Prisma.

* **Metode:** Supabase Database Trigger.
* **Alur:**
  1. Ketika akun baru dibuat (via Invite atau Create Account di CMS), data masuk ke `auth.users`.
  2. Trigger akan otomatis menyalin `id`, `email`, dan parameter metadata (`role`, `commissariat_id`) ke tabel `public.users`.
  3. Semua relasi ORM (seperti `articles.created_by`) akan merujuk ke tabel `public.users` ini.

---

## 4. Prisma Integration Strategy

* **Connection Mode:** Prisma terhubung menggunakan **Connection Pooler** dari Supabase (Transaction mode).
* **Direct URL:** Digunakan secara spesifik untuk menjalankan migrasi skema (`prisma migrate`).
* **Client Generation:** Prisma Client di-generate secara lokal dan otomatis di-*cache* oleh Vercel saat deployment.

---

## 5. Migration Workflow

Manajemen perubahan skema database sepenuhnya diatur oleh **Prisma**. Kita tidak menggunakan Supabase Migrations agar ORM dan Database selalu sinkron.

* **Development:** Saat ada perubahan skema di `schema.prisma`, jalankan:
  `npx prisma migrate dev --name deskripsi_perubahan`
* **Production/CI:** Saat proses build di Vercel, *build script* secara otomatis akan menjalankan:
  `npx prisma generate && npx prisma migrate deploy`

---

## 6. Local Development Setup

Untuk menjalankan environment secara lokal:
1. Jalankan `supabase start` (menggunakan Supabase CLI) untuk membuat kontainer Postgres, Auth, dan Storage lokal.
2. Atur URL koneksi database lokal ke berkas `.env`.
3. Jalankan `npx prisma db push` atau `npx prisma migrate dev` untuk membangun skema di database lokal.
4. Buat *trigger* sinkronisasi user secara manual melalui Supabase Studio Local.

---

## 7. Production Setup

Untuk deployment ke lingkungan Production / Staging:
1. Buat proyek baru di dashboard Supabase.
2. Dapatkan *Transaction Connection String* (untuk `DATABASE_URL`) dan *Session Connection String* (untuk `DIRECT_URL`).
3. Jalankan `npx prisma db push` untuk mencocokkan skema dan memicu *Trigger* sinkronisasi di atas.
4. Siapkan *Environment Variables* Cloudinary untuk manajemen media, karena Supabase Storage tidak digunakan lagi.
5. Terapkan skrip SQL untuk *User Synchronization Trigger*.
6. Masukkan *environment variables* ke dalam Vercel Project.
7. Trigger proses deployment Vercel.
