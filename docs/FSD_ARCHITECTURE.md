# FSD Architecture

## Purpose
Dokumen ini mendefinisikan arsitektur **Feature-Sliced Design (FSD)** yang disesuaikan secara khusus untuk proyek CMS HMI Cabang Semarang dengan menggunakan *stack* Next.js App Router, Prisma, Supabase, dan Zustand.

---

## 1. Define Layers

Arsitektur ini menggunakan hierarki *layer* FSD standar dengan beberapa penyesuaian:

1. **`app`**: Layer inisialisasi aplikasi. Berisi *setup* global, *providers* (React Query, Theme), gaya global (CSS), dan definisi rute bawaan Next.js (`layout.tsx`, `page.tsx`). **Dibutuhkan.**
2. **`pages`**: Komposisi UI penuh untuk setiap rute. Menggabungkan *widgets* dan *features* menjadi satu tampilan halaman utuh. **Dibutuhkan.**
3. **`widgets`**: Blok UI independen yang menyatukan berbagai *features* dan *entities*. Contoh: `Header`, `ReviewCenter`, `ArticleList`. **Dibutuhkan.**
4. **`features`**: Logika bisnis spesifik atau interaksi pengguna yang dapat dipanggil (aksi). Contoh: `article-review`, `cadre-verification`. **Dibutuhkan.**
5. **`entities`**: Representasi bisnis (model data) dari domain aplikasi. Berisi komponen *dumb UI* (seperti *card*), tipe data, dan *API calls* dasar. **Dibutuhkan.**
6. **`shared`**: Infrastruktur dasar yang dapat digunakan ulang di seluruh *layer*. Berisi komponen UI generik (shadcn/ui), *hooks*, *utils*, konfigurasi, dan instansiasi klien (Prisma/Supabase). **Dibutuhkan.**

**Layer yang dihilangkan:**
* **`processes`**: Dihilangkan. Alur kerja dalam CMS ini (seperti *Review Workflow*) dapat ditangani secara efektif menggunakan gabungan *widgets* dan *features* tanpa memerlukan layer proses yang terlalu kompleks.

---

## 2. Proposed Folder Structure

```txt
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── api/
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── pages/
│   ├── public/
│   ├── auth/
│   └── dashboard/
├── widgets/
│   ├── layout/
│   ├── review-center/
│   └── article-showcase/
├── features/
│   ├── auth/
│   ├── content-review/
│   ├── cadre-verification/
│   └── profile-management/
├── entities/
│   ├── article/
│   ├── agenda/
│   ├── commissariat/
│   ├── user/
│   └── review-history/
└── shared/
    ├── api/
    ├── config/
    ├── constants/
    ├── hooks/
    ├── lib/
    ├── schemas/
    ├── types/
    ├── ui/
    └── utils/
```

---

## 3. Entity Mapping

Entitas dipetakan langsung dari `DATABASE_SCHEMA.md`. Setiap folder entitas (misal: `src/entities/article`) memiliki struktur internal:
* `model/`: Definisi tipe data (Zod schemas untuk entitas), Zustand stores untuk *state* UI entitas.
* `api/`: Fungsi pengambilan data (Queries).
* `ui/`: Komponen UI murni (misal: `ArticleCard`, `ArticleRow`).

**Daftar Entitas:**
* `article`
* `agenda`
* `commissariat`
* `profile-submission`
* `gallery`
* `document`
* `user`
* `organization` (mencakup Period, Position, Board Member)
* `taxonomy` (mencakup Category, Tag)
* `notification`
* `audit-log`

---

## 4. Feature Mapping

Fitur adalah modul interaktif (aksi) yang beroperasi pada entitas.

* **`content-review`** (Dependencies: `article`, `agenda`, `profile-submission`, `review-history` entities)
  * Responsibility: Menangani logika *Approve*, *Reject*, dan *Request Revision* beserta input *Revision Notes*.
* **`cadre-verification`** (Dependencies: `commissariat` entity)
  * Responsibility: Menangani unggahan file Excel dan validasi verifikasi kader.
* **`profile-management`** (Dependencies: `commissariat`, `profile-submission` entities)
  * Responsibility: Logika *Edit Profile* dan *Submit for Review* untuk ADMIN_KOMISARIAT.
* **`article-management`** (Dependencies: `article` entity)
  * Responsibility: Logika *Create*, *Edit*, *Soft Delete*, dan *Publish* artikel.
* **`agenda-management`** (Dependencies: `agenda` entity)
  * Responsibility: Logika form pembuatan dan pengaturan jadwal agenda.

---

## 5. Widget Mapping

**Public Website:**
* `HeroBanner`: Menggabungkan pengaturan dari `website_settings`.
* `ArticleCarousel`: Menampilkan daftar artikel publik terbaru.
* `AgendaCarousel`: Menampilkan daftar agenda publik yang akan datang.
* `PublicNavbar` & `PublicFooter`: Navigasi publik.

**CMS Dashboard:**
* `ReviewCenter`: Menampilkan daftar konten yang berstatus `SUBMITTED`. Menggunakan fitur `content-review`.
* `DashboardStats`: Menampilkan jumlah kader terverifikasi dan jumlah konten.
* `RecentActivity`: Menampilkan gabungan data `audit-log`.
* `NotificationCenter`: *Dropdown* lonceng notifikasi.

*Ownership Rule*: Widget tidak boleh memiliki logika mutasi data yang kompleks. Mutasi data diserahkan ke layer `features`.

---

## 6. Shared Layer

* **`api/`**: Tempat instansiasi Prisma Client dan Supabase Client (Server & Browser).
* **`config/`**: Variabel lingkungan (`env.ts` yang divalidasi dengan Zod) dan konfigurasi statis situs.
* **`constants/`**: Konstanta global, *magic numbers*, opsi menu statis.
* **`hooks/`**: React hooks global (misal: `useDebounce`, `useMediaQuery`).
* **`lib/`**: Konfigurasi *library* eksternal (misal: format tanggal `date-fns`, format mata uang).
* **`schemas/`**: Skema validasi Zod generik yang digunakan di banyak entitas.
* **`types/`**: Definisi tipe TypeScript global.
* **`ui/`**: Komponen UI dasar yang tidak terikat entitas (diisi oleh shadcn/ui seperti Button, Input, Modal).
* **`utils/`**: Fungsi pembantu (misal: `cn()` untuk penggabungan *class* Tailwind).

---

## 7. Server Actions Strategy

Dengan arsitektur Next.js App Router, mutasi data dilakukan menggunakan **Server Actions**.

* **Lokasi:** Server Actions diletakkan di layer tempat aksi tersebut terjadi.
  * Mutasi entitas generik: `entities/{entity}/api/actions.ts`.
  * Mutasi fitur kompleks: `features/{feature}/api/actions.ts`.
* **Naming Convention:** Dimulai dengan kata kerja (*verb*), misal: `createArticleAction`, `approveContentAction`.
* **Ownership Rules:** Server Action **wajib** memeriksa otorisasi (cek *role* pengguna dan validasi kepemilikan/batasan *commissariat_id*) sebelum mengeksekusi Prisma ORM, sebagai implementasi dari prinsip *Application-Level Authorization*.

---

## 8. Prisma Integration

* **Instansiasi:** Klien tunggal Prisma (`prisma`) diinisiasi di `shared/api/prisma.ts`.
* **Akses Data:** Kueri langsung ke database menggunakan Prisma **hanya boleh** dilakukan dari dalam fungsi Server Actions, Next.js Route Handlers (`app/api`), atau Server Components. Client Components sama sekali tidak boleh (dan tidak bisa) mengakses Prisma.
* **Repository Pattern:** Logika Prisma dienkapsulasi di dalam `api/` atau `model/` pada layer `entities` atau `features`.

---

## 9. Supabase Integration

* **Instansiasi Client:** Disimpan di `shared/api/supabase/server.ts` dan `client.ts` menggunakan `@supabase/ssr`.
* **Auth:** Fitur login (Server Actions) diletakkan di `features/auth/api/actions.ts`. Middleware Next.js (`proxy.ts` di *root* proyek) memvalidasi token dari *cookies* untuk memproteksi rute CMS `/dashboard`.
* **Storage:** Logika unggah/unduh file diletakkan di `shared/lib/storage.ts`. Server Actions akan berinteraksi dengan API Cloudinary SDK. Untuk dokumen rahasia, kita menerbitkan URL terotentikasi (*Signed URLs*) dari Cloudinary.

---

## 10. State Management Strategy

* **Zustand:** Digunakan eksklusif untuk **Client UI State** yang kompleks. Contoh: Menyimpan status langkah-langkah pada *multi-step form* pendaftaran, atau mengelola status bukaan *sidebar* navigasi.
* **TanStack Query (React Query):** Digunakan untuk **Server State**. Cocok untuk komponen klien (Client Components) yang membutuhkan *data fetching* dinamis, *caching*, *polling* notifikasi, atau navigasi paginasi tabel secara *real-time*.

---

## 11. Import Rules

Hierarki lapisan mematuhi aturan standar FSD: lapisan atas hanya boleh mengimpor lapisan di bawahnya, dan dilarang mengimpor arah terbalik (lapisan bawah dilarang mengimpor lapisan atas).

* ✅ `app` → dapat mengimpor SEMUA layer di bawahnya.
* ✅ `pages` → `widgets`, `features`, `entities`, `shared`.
* ✅ `widgets` → `features`, `entities`, `shared`.
* ✅ `features` → `entities`, `shared`.
* ✅ `entities` → `shared`.
* ❌ DILARANG KERAS: `shared` mengimpor `entities`, `entities` mengimpor `features`.

---

## 12. Route Mapping

**Next.js App Router (`src/app`):**

* **Public Website:**
  * `/` (Hero, Latest Articles)
  * `/artikel`, `/artikel/[slug]`
  * `/agenda`, `/agenda/[slug]`
  * `/komisariat`, `/komisariat/[slug]`
* **Authentication:**
  * `/login`, `/forgot-password`, `/reset-password`
* **CMS Dashboard:**
  * `/dashboard`
  * `/dashboard/articles/*`
  * `/dashboard/review-center`
  * `/dashboard/settings`

Masing-masing halaman *route* di dalam folder `app/` di atas pada dasarnya akan merender komponen komposisi dari `src/pages`.

---

## 13. Scalability Review

* **36+ Commissariats & Thousands of Logs:** Skalabilitas terjamin karena sistem pagination diurus oleh React Query/Prisma `skip`/`take`. Komponen UI tidak akan menahan memori klien.
* **Future Modules:** Jika kelak ingin menambahkan modul "E-Commerce", kita cukup menambahkan fitur baru di `features/e-commerce` dan entitas baru di `entities/product`. FSD mencegah fitur baru memengaruhi *logic* fitur lama.
* **Future Contributors:** FSD memiliki kurva pembelajaran di awal, namun membuat kode menjadi sangat *predictable*. Struktur folder memandu *developer* baru ke mana mereka harus menempatkan logika komponen.

---

## 14. Final Verdict

**Arsitektur FSD sangat ideal dan SIAP DITERAPKAN untuk CMS HMI Semarang.**

Alasannya:
Aplikasi ini memiliki pembagian peran yang sangat ketat (*Scoped Access* untuk Komisariat vs *Global Access* untuk Cabang) dan alur kerja (*Workflow*) persetujuan yang rumit. Dengan memisahkan elemen dasar menjadi `entities` dan mengelompokkan logika mutasi ke `features`, kode dari komponen UI (*Widget* dan *Pages*) tetap bersih. Pendekatan **Server Actions** Next.js juga menyatu sempurna dengan skema lapisan FSD ini, di mana batas antara operasi server dan komponen klien terisolasi dengan rapi.
