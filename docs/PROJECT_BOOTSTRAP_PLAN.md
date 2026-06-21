# Project Bootstrap Plan

## Purpose
Dokumen ini mendefinisikan langkah-langkah *bootstrap* proyek dari nol (menggantikan arsitektur *monorepo* yang bermasalah) menjadi sebuah aplikasi **Next.js Single App** monolitik yang mematuhi standar **Feature-Sliced Design (FSD)** secara ketat.

---

## 1. Recommended Final Project Structure

Keseluruhan repositori akan memiliki struktur akar (*root*) yang rata dan sederhana:

```txt
[Repository Root]
├── docs/                 # Seluruh dokumentasi sistem
├── prisma/               # Definisi skema database dan migrasi
├── public/               # Aset statis publik (gambar, font, favicon)
├── src/                  # Kode sumber utama (FSD Architecture)
│   ├── app/
│   ├── pages/
│   ├── widgets/
│   ├── features/
│   ├── entities/
│   └── shared/
├── .env                  # Environment variables lokal
├── .env.example          # Template environment variables
├── .gitignore
├── components.json       # Konfigurasi shadcn/ui
├── middleware.ts         # Next.js middleware (Supabase Auth)
├── next.config.ts        # Konfigurasi Next.js
├── package.json          # Dependensi npm
├── tailwind.config.ts    # Konfigurasi Tailwind CSS
└── tsconfig.json         # Konfigurasi TypeScript
```

---

## 2. Recommended Next.js Initialization

* **Package Manager:** `npm` (Stabil, didukung natively oleh Vercel tanpa perlu konfigurasi ekstra).
* **Command:** 
  `npx create-next-app@latest .`
* **Prompts Configuration:**
  * Would you like to use TypeScript? **Yes**
  * Would you like to use ESLint? **Yes**
  * Would you like to use Tailwind CSS? **Yes**
  * Would you like to use `src/` directory? **Yes**
  * Would you like to use App Router? **Yes**
  * Would you like to customize the default import alias (`@/*`)? **No**

---

## 3. shadcn/ui Installation Plan

* **Initialization Command:**
  `npx shadcn@latest init`
* **Recommended Configuration (Sesuai FSD):**
  * Style: **New York**
  * Base color: **Zinc** (atau sesuai *brand* HMI)
  * CSS variables: **Yes**
  * Where is your global CSS file? **`src/app/globals.css`**
  * Configure the import alias for components: **`@/shared/ui`** *(Penting: Ubah default `components` menjadi `shared/ui` agar sesuai FSD)*
  * Configure the import alias for utils: **`@/shared/lib/utils`**
  * Are you using React Server Components? **Yes**

*(Catatan: Jangan tambahkan bendera `--monorepo`.)*

---

## 4. Prisma Setup Plan

* **Initialization:** `npx prisma init`
* **Folder Location:** `prisma/` di *root*.
* **Schema Location:** `prisma/schema.prisma`
* **Integrasi FSD:** Tipe data yang di-*generate* Prisma (`@prisma/client`) akan langsung digunakan oleh layer `entities` secara natural karena berada dalam satu *workspace*.

---

## 5. Supabase Setup Placement

Sesuai aturan FSD, integrasi layanan pihak ketiga ditempatkan di *layer* `shared`.

* **Browser Client:** `src/shared/api/supabase/client.ts`
* **Server Client:** `src/shared/api/supabase/server.ts`
* **Auth Middleware:** `src/middleware.ts` (Next.js mewajibkan ini diletakkan setara dengan folder `app/` atau `src/`).
* **Storage Helpers:** `src/shared/lib/storage.ts`

---

## 6. Documentation Placement

Struktur final folder `docs/` setelah pembersihan dan penyusunan FSD.

```txt
docs/
├── decisions/
│   ├── 001-authentication.md
│   ├── 002-document-module.md
│   └── 003-database-readiness.md
├── features/
│   └── (Dokumentasi spesifik fitur di masa depan)
├── PRD.md
├── TECH_STACK.md
├── DATABASE_SCHEMA.md
├── ROLE_PERMISSION_MATRIX.md
├── SITEMAP_PUBLIC.md
├── SITEMAP_CMS.md
├── FSD_ARCHITECTURE.md
├── SUPABASE_SETUP.md
├── ENVIRONMENT_VARIABLES.md
├── GIT_WORKFLOW.md
├── DEPLOYMENT.md
├── PROJECT_STRUCTURE_AUDIT.md
├── PROJECT_BOOTSTRAP_PLAN.md
├── DOCUMENTATION_RULES.md
└── CHANGELOG.md
```

---

## 7. Final Bootstrap Checklist

Urutan langkah demi langkah secara pasti dari repositori kosong hingga siap *coding*:

- [ ] **Langkah 1: Bersihkan Repositori**
  Hapus folder bersarang yang terlanjur dibuat (`rm -rf hmisemarang/hmisemarang` atau pindahkan folder dokumentasi terlebih dahulu, lalu kosongkan root). Pastikan hanya folder `docs/` yang tersisa.
- [ ] **Langkah 2: Inisialisasi Next.js**
  Jalankan perintah `create-next-app` menggunakan *flags* TypeScript, Tailwind, ESLint, dan `src/` directory.
- [ ] **Langkah 3: Inisialisasi shadcn/ui**
  Jalankan perintah `shadcn init` dan arahkan alias komponen ke `src/shared/ui` dan utils ke `src/shared/lib/utils`.
- [ ] **Langkah 4: Bangun Kerangka FSD**
  Buat folder-folder kosong di dalam `src/`: `pages`, `widgets`, `features`, `entities`.
- [ ] **Langkah 5: Instalasi Dependensi Inti**
  Instal `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `zustand`, `@tanstack/react-query`.
- [ ] **Langkah 6: Inisialisasi Prisma**
  Jalankan `npx prisma init` dan tempelkan salinan dari `DATABASE_SCHEMA.md` ke dalam `schema.prisma`.
- [ ] **Langkah 7: Konfigurasi File Lingkungan**
  Buat file `.env` dan isi kunci berdasarkan `ENVIRONMENT_VARIABLES.md`.
- [ ] **Langkah 8: Setup Supabase Clients**
  Buat file pembantu Supabase SSR di `src/shared/api/supabase/`.
- [ ] **Langkah 9: Commit Pertama**
  Lakukan commit bersih dengan pesan: `chore: bootstrap project with fsd architecture`.

Aplikasi siap untuk pengembangan!
