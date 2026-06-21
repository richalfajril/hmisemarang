# ENVIRONMENT_VARIABLES.md

## Purpose
Dokumen ini menguraikan seluruh daftar *environment variables* yang wajib dikonfigurasi dalam lingkungan pengembangan (Local/Dev) maupun produksi (Vercel).

**PERHATIAN:**
* Jangan pernah menyimpan *secret* (token, password, key asli) ke dalam kode sumber (`.env` yang di-commit).
* Nilai di bawah ini hanyalah *placeholder* / contoh.

---

## 1. Database

Variabel ini digunakan oleh Prisma ORM untuk melakukan koneksi ke PostgreSQL.

* **Name:** `DATABASE_URL`
* **Required:** Yes
* **Example:** `postgres://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
* **Purpose:** URL koneksi utama menggunakan **Connection Pooler** (Transaction Mode). Digunakan oleh Prisma Client untuk eksekusi *query* aplikasi sehari-hari.

* **Name:** `DIRECT_URL`
* **Required:** Yes
* **Example:** `postgres://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
* **Purpose:** URL koneksi langsung (Session Mode). Hanya digunakan untuk mengeksekusi `prisma migrate deploy` atau sinkronisasi skema karena migrasi tidak mendukung *pgbouncer* / pooler.

---

## 2. Supabase

Variabel utama yang dibutuhkan klien aplikasi untuk berinteraksi dengan API Supabase.

* **Name:** `NEXT_PUBLIC_SUPABASE_URL`
* **Required:** Yes
* **Example:** `https://abcdefghijklmnopqr.supabase.co`
* **Purpose:** URL utama proyek Supabase. Diakses baik dari Server maupun Client browser.

* **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* **Required:** Yes
* **Example:** `eyJhbGciOiJIUzI1NiIsInR5c...`
* **Purpose:** *Key* publik yang aman diletakkan di sisi klien untuk inisialisasi Supabase Client (untuk Auth Login dan Storage publik).

* **Name:** `SUPABASE_SERVICE_ROLE_KEY`
* **Required:** Yes
* **Example:** `eyJhbGciOiJIUzI1NiIsInR5c...`
* **Purpose:** Kunci admin rahasia. Digunakan di Application Layer (Server Actions) untuk mem-bypass RLS, sinkronisasi pengguna rahasia, atau mengakses dokumen / verifikasi *bucket* private secara aman. **JANGAN PERNAH MENGEKSPOS INI KE KLIEN.**

---

## 3. Auth

Karena manajemen sesi pengguna diserahkan kepada klien dan server secara bersamaan, Next.js membutuhkan *environment variable* untuk keamanan tambahan jika diperlukan (tergantung implementasi package).

* **Name:** `NEXT_PUBLIC_SITE_URL`
* **Required:** Yes
* **Example:** `http://localhost:3000` (Local) / `https://hmisemarang.vercel.app` (Prod)
* **Purpose:** Digunakan untuk mengarahkan pengguna kembali ke aplikasi setelah verifikasi email, reset *password*, atau pembuatan *magic link*.

---

## 4. Storage

Meskipun secara teknis URL *storage* dapat ditarik menggunakan Supabase Client, menyimpan nama *bucket* di konfigurasi global memudahkan fleksibilitas dan keamanan.

* **Name:** `NEXT_PUBLIC_MEDIA_BUCKET`
* **Required:** Yes
* **Example:** `public-media`
* **Purpose:** Nama bucket untuk gambar, logo, dan flyer.

* **Name:** `SECURE_DOCUMENTS_BUCKET`
* **Required:** Yes
* **Example:** `secure-documents`
* **Purpose:** Nama bucket untuk file dokumen yang dilayani melalui jalur aplikasi (bersifat rahasia bagi klien).

* **Name:** `SECURE_VERIFICATIONS_BUCKET`
* **Required:** Yes
* **Example:** `secure-verifications`
* **Purpose:** Nama bucket khusus verifikasi kader, murni diakses melalui jalur *service role*.

---

## 5. Deployment

* **Name:** `VERCEL_URL`
* **Required:** No (Otomatis disediakan oleh Vercel)
* **Example:** `hmisemarang-git-development-richal.vercel.app`
* **Purpose:** Variabel sistem Vercel yang menyediakan URL dinamis untuk environment *Preview* atau cabang *Development*.

---

# Readiness Assessment

Are we ready for:
**FSD_ARCHITECTURE.md**

**YES**

### Alasan:
1. **Database Schema** sudah solid dan *blocker* arsitektur (seperti *draft vs published data*) sudah ditangani.
2. **Setup Lingkungan & DevOps** (`SUPABASE_SETUP.md` & `ENVIRONMENT_VARIABLES.md`) telah terdefinisi secara komprehensif.
3. Arsitektur **Feature-Sliced Design (FSD)** kini memiliki fondasi yang kuat, di mana kita sudah tahu dengan pasti layer mana yang bertanggung jawab melakukan inisiasi koneksi *database* (Prisma) dan mengurus kunci lingkungan (*Shared Layer*).
4. Pemisahan antara *Application-Level Authorization* dengan *Public Storage* memberikan panduan yang sangat jelas tentang bagaimana merancang API Specifications ke depannya.

Kita resmi siap merancang arsitektur struktur direktori aplikasi!
