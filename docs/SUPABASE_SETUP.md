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

## 4. Storage Bucket Strategy

Manajemen file menggunakan Supabase Storage. File dikelompokkan ke dalam 3 *bucket* berdasarkan visibilitas dan keamanannya:

### 1. `public-media`
* **Visibility:** Public
* **Purpose:** Menyimpan media visual publik seperti logo komisariat, flyer agenda, foto galeri, dan foto pengurus.
* **Upload Permissions:** Hanya Authenticated Users (via Application Layer).
* **Access Permissions:** Public (Siapa saja dapat melihat/mengunduh gambar).

### 2. `secure-documents`
* **Visibility:** Private
* **Purpose:** Menyimpan file PDF Modul Dokumen (Publik). Meskipun dokumen ini ditujukan untuk publik, pengunduhan akan dilayani melalui Application Layer untuk keperluan *tracking* atau pembatasan tertentu.
* **Upload Permissions:** Authenticated Users (ADMIN_CABANG via Application Layer).
* **Access Permissions:** Private (Hanya dapat diakses melalui Application Layer menggunakan Supabase Admin Client atau Signed URL).

### 3. `secure-verifications`
* **Visibility:** Private
* **Purpose:** Menyimpan file Excel verifikasi kader. Ini adalah dokumen sangat rahasia.
* **Upload Permissions:** Authenticated Users (ADMIN_KOMISARIAT via Application Layer).
* **Access Permissions:** Private (Hanya dapat diakses oleh SYSTEM_ADMIN dan ADMIN_CABANG, atau uploader-nya sendiri via Application Layer).

---

## 5. Prisma Integration Strategy

* **Connection Mode:** Prisma terhubung menggunakan **Connection Pooler** dari Supabase (Transaction mode).
* **Direct URL:** Digunakan secara spesifik untuk menjalankan migrasi skema (`prisma migrate`).
* **Client Generation:** Prisma Client di-generate secara lokal dan otomatis di-*cache* oleh Vercel saat deployment.

---

## 6. Migration Workflow

Manajemen perubahan skema database sepenuhnya diatur oleh **Prisma**. Kita tidak menggunakan Supabase Migrations agar ORM dan Database selalu sinkron.

* **Development:** Saat ada perubahan skema di `schema.prisma`, jalankan:
  `npx prisma migrate dev --name deskripsi_perubahan`
* **Production/CI:** Saat proses build di Vercel, *build script* secara otomatis akan menjalankan:
  `npx prisma generate && npx prisma migrate deploy`

---

## 7. Local Development Setup

Untuk menjalankan environment secara lokal:
1. Jalankan `supabase start` (menggunakan Supabase CLI) untuk membuat kontainer Postgres, Auth, dan Storage lokal.
2. Atur URL koneksi database lokal ke berkas `.env`.
3. Jalankan `npx prisma db push` atau `npx prisma migrate dev` untuk membangun skema di database lokal.
4. Buat *trigger* sinkronisasi user secara manual melalui Supabase Studio Local.

---

## 8. Production Setup

Untuk deployment ke lingkungan Production / Staging:
1. Buat proyek baru di dashboard Supabase.
2. Dapatkan *Transaction Connection String* (untuk `DATABASE_URL`) dan *Session Connection String* (untuk `DIRECT_URL`).
3. Buat *Storage Buckets* sesuai spesifikasi di atas dan atur konfigurasinya menjadi Public/Private.
4. Terapkan skrip SQL untuk *User Synchronization Trigger*.
5. Masukkan *environment variables* ke dalam Vercel Project.
6. Trigger proses deployment Vercel.
