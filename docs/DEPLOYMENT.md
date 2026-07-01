# DEPLOYMENT.md

## Purpose
Dokumen ini menjelaskan strategi *deployment*, pengelolaan *environment*, infrastruktur hosting, dan tata cara migrasi basis data (Prisma) untuk proyek CMS HMI Semarang.

---

## 1. Infrastructure

Aplikasi ini menggunakan infrastruktur berbasis *cloud* modern yang terdesentralisasi:

```txt
GitHub (Source Control)
          ↓
Vercel (Hosting & CI/CD)
          ↓
Supabase (Database, Auth, Storage)
```

---

## 2. Environments

Sistem beroperasi pada dua *environment* utama:

* **Development (Staging):** Tempat pengujian fitur baru sebelum dirilis ke publik.
* **Production:** Lingkungan publik yang diakses oleh pengguna dan admin cabang sesungguhnya.

---

## 3. Vercel Configuration

Konfigurasi domain dan pemetaan *branch* diatur sepenuhnya dari dalam proyek Vercel yang sama.

* **Production Branch:** `production`
* **Production Domain:** `hmisemarang.vercel.app` (serta custom domain masa depan)
* **Development Branch:** `development`
* **Development Domain:** `dev-hmisemarang.vercel.app` (diset sebagai *Branch Domain* di Vercel)

Setiap Pull Request ke cabang `development` juga akan secara otomatis membuat URL *Preview* sementara (Ephemeral Preview).

---

## 4. Environment Variables Mapping

Untuk pemetaan kunci secara rinci, lihat dokumen bawaan:
👉 **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)**

Pastikan `Preview Environment` di Vercel menunjuk ke proyek Supabase *Staging*, sedangkan `Production Environment` menunjuk ke proyek Supabase *Production*.

---

## 5. Database Deployment Strategy

Kami menggunakan **Prisma ORM**. Karena manipulasi *database* sangat riskan di sistem berbasis CMS, **TIDAK disarankan** menjalankan perintah migrasi (`prisma migrate deploy`) secara otomatis di *build command* Vercel pada fase produksi.

**Alur Deployment Database yang Direkomendasikan:**
1. Sebelum *merge* PR rilis ke `production`, periksa apakah ada *file* migrasi baru di direktori `prisma/migrations`.
2. Jika ada, jalankan perintah migrasi ke database Supabase Production secara manual (melalui mesin lokal *admin* atau GitHub Actions yang dikendalikan manual):
   `npx prisma migrate deploy`
3. Setelah migrasi berhasil di database, *merge* PR ke `production`.
4. Vercel akan membaca skema *database* terbaru yang sudah termigrasi dan membangun aplikasi Next.js.

---

## 6. Storage Deployment Notes

Setiap menyiapkan *environment* baru (misalnya saat memisahkan Dev dan Prod), pastikan Anda melakukan prapengaturan *Cloudinary* dan *Supabase Triggers* sesuai pedoman di:
👉 **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

---

## 7. Release Process

Alur hidup utuh dari pengembang ke *production*:

```txt
Developer (Local `feat/*`)
       ↓ (Push & PR)
`development` Branch (Vercel CI/CD berjalan)
       ↓ (Merge)
Testing di dev-hmisemarang.vercel.app
       ↓ (Migrasi DB Manual jika diperlukan)
`production` Branch (PR Release)
       ↓ (Merge & Deploy)
Live di hmisemarang.vercel.app
```

---

## 8. Rollback Process

Jika terjadi insiden, proses *rollback* melibatkan 3 lapisan infrastruktur:

* **Code Rollback:**
  Gunakan fitur "Revert PR" pada GitHub cabang `production`.
* **Database Rollback:**
  Lakukan *downgrade* menggunakan file *migration down* (jika diatur) atau *restore* dari *Backup* Supabase (PITR / Point-In-Time Recovery) melalui *dashboard* Supabase jika tabel krusial rusak.
* **Vercel Rollback:**
  Gunakan tombol **Instant Rollback** pada tab *Deployments* di dasbor Vercel untuk mengembalikan status *frontend* sembari tim infrastruktur memulihkan API / *database*.

---

# Readiness Assessment

Are we ready for:
**API_SPECIFICATION.md**

**YES**

### Penjelasan:
Semua lapisan "Engineering Foundation" kini telah selesai, lengkap, dan terdokumentasi dengan sangat baik. 
1. `DATABASE_SCHEMA.md` menjamin bentuk data.
2. `SUPABASE_SETUP.md` menjamin penempatan dan konfigurasi layanan *backend*.
3. `ENVIRONMENT_VARIABLES.md` menjamin pengelolaan *secrets*.
4. `FSD_ARCHITECTURE.md` memastikan pembagian *layering* kode *frontend*.
5. `GIT_WORKFLOW.md` dan `DEPLOYMENT.md` menutup siklus pengelolaan rilis perangkat lunak (CI/CD).

Karena fondasi penyimpanan data, arsitektur *folder*, dan alur rilis sepenuhnya sudah dikunci dan dipahami, merancang rincian antarmuka API (Server Actions & Data Fetching) kini menjadi langkah yang logis dan tidak akan menemui hambatan arsitektural. Kami siap!
