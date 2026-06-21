# Project Overview
Peta jalan ini bertindak sebagai kemudi rekayasa (*Project Progress Tracker* dan *Product Roadmap*) untuk ekosistem HMI Cabang Semarang. Memandu pembangunan situs web publik dinamis dan sistem manajemen konten (CMS) tersentralisasi yang mematuhi batasan *role-based access control* (RBAC) ketat.

## Guiding Principles
* **Documentation-Driven Development:** Kode tidak ditulis sebelum didesain; arsitektur tidak diubah tanpa pembaruan ADR (*Architecture Decision Record*).
* **Security by Isolation:** Isolasi ketat data menggunakan otoritas *Scoped Access* level peladen, mencegah akses lintas-komisariat.
* **Progressive Enhancement:** Memaksimalkan fitur asli *Web Standards* (form tanpa-JS dari *Next.js Server Actions*) untuk kapabilitas stabil, ditopang dengan UI *optimistic updates*.

## Technical Goals
* Merilis aplikasi FSD (*Feature-Sliced Design*) yang memiliki struktur sangat skalabel namun *low-maintenance* untuk diwariskan ke kepengurusan berikutnya.
* Mencapai standar kecepatan *Core Web Vitals* optimal dengan merender elemen secara pasif ke DOM dan mengandalkan pendelegasian komponen statis.

## Current Version
**v1.9.0-dev** (Dashboard UI Upgrade — Sidebar Navigation)

---

<details open>
<summary><h2>v1.0.0 Foundation</h2></summary>

**Focus:** Inisialisasi infrastruktur lokal, peladen, dan Basis Data.
**Target:** Lingkungan pengembangan mapan; aplikasi bisa dikompilasi, terhubung ke *Postgres*, dan dirender oleh peramban lokal.
**Dependencies:** Persetujuan dokumen `TECH_STACK.md` & `DATABASE_SCHEMA.md`.

### Features
**CMS Cabang**
* Integrasi *shadcn/ui* Preset Radix-Vega.
* Penanganan Eror Fundamental (404, 500, *Forbidden*, *Empty States*).

### Checklist
* `[x]` **UI Tasks:** Instalasi *shadcn/ui* & Tailwind v4. Pengaturan map FSD.
* `[x]` **UI Tasks:** Upgrade tata letak Dashboard menggunakan `dashboard-01` shadcn — `AppSidebar`, `SidebarProvider`, `SiteHeader` dengan navigasi HMI lengkap, active state, dan `NavUser` dengan logout.
* `[x]` **Database Tasks:** `npx prisma db push` skema primer dan ciptakan berkas *Seeder* untuk entri akun `SYSTEM_ADMIN`.
* `[x]` **Permission Tasks:** Inisiasi peladen Supabase (Klien, SSR, Middleware) untuk memagari rute dasar `/dashboard`.

### Deliverables
* Repositori *codebase* tersetup penuh.
* *Database schema* bersinar di mesin lokal/awan Supabase.

### Success Criteria
* Perintah `npm run dev` tereksekusi tanpa kesalahan linting (*build pass*).
* Semua *Middleware* berhasil menendang pengguna tanpa-sesi yang iseng mengakses `/dashboard` keluar ke `/login`.
* Halaman peringatan eror kustom (bukan bawaan Next.js) muncul dengan rapi ketika pengguna dipaksa masuk rute ilegal.
</details>

---

<details>
<summary><h2>v1.1.0 Authentication & User Management</h2></summary>

**Focus:** Modul Otentikasi, pembuatan sesi admin, dan hak pendelegasian kontrol.
**Target:** Administrator (Sistem & Cabang) dapat masuk, mengolah, dan mencabut akun Admin Komisariat.
**Dependencies:** `v1.0.0 Foundation`.

### Features
**CMS Cabang**
* Antarmuka Manajemen Pengguna (`features/user-management`).
* Fitur Penyetelan Ulang Kata Sandi Paksa (*Force Password Reset*).
* Pemantauan Kedaluwarsa Sesi (*Session Timeout Handling*).
**Public Website**
* Halaman muka Gerbang Log Masuk (`/login`).

### Checklist
* `[x]` **Database Tasks:** Operasi CRUD untuk entitas Otentikasi dan *Users*.
* `[x]` **API Tasks:** Integrasi login/logout via *Server Actions* tanpa-API rute konvensional.
* `[x]` **API Tasks:** Logika penciptaan akun dengan `commissariat_id` terikat.
* `[x]` **UI Tasks:** Penanganan dialog peringatan ketika sesi kedaluwarsa dan logika `redirect` pasca-login.
* `[x]` **UI Tasks:** Tabel Daftar Pengguna untuk Cabang.

### Deliverables
* Pintu masuk aman (`/login`). Dasbor Manajemen Akses.

### Success Criteria
* Percobaan login (*Login attempt*) sukses menyimpan *cookie* sesi rahasia Supabase.
* Cabang mampu mengeluarkan perintah pengarsipan dan mencabut akses (`revoke`) milik komisariat nakal.
</details>

---

<details>
<summary><h2>v1.2.0 Master Data</h2></summary>

**Focus:** Pembentukan struktur tulang (*Master Data Entities*) penopang relasi konten.
**Target:** Penyelesaian form pengaturan absolut (Settings, Kategori, Profil Cabang).
**Dependencies:** `v1.1.0` (Otentikasi).

### Features
**CMS Cabang**
* Website Settings (Tunggal / *Singleton*).
* Taxonomy Management (CRUD Kategori dan Tag).
* Organization Management (Periode dan Pengurus).

### Checklist
* `[x]` **Database Tasks:** Relasi referensial untuk `periods`, `categories`, dan `website_settings`.
* `[x]` **API Tasks:** Validasi *Zod* ketat untuk mencegah form isian web publik kosong.
* `[x]` **UI Tasks:** Pembuatan form panjang menggunakan *React Hook Form* untuk SEO dan Profil Cabang.

### Deliverables
* Dasbor pengelolaan pengaturan SEO dan Daftar Ketaksonomian.

### Success Criteria
* Penambahan kategori baru secara instan tampil (*revalidated*) tanpa menuntut muat ulang server.
</details>

---

<details>
<summary><h2>v1.3.0 Observability</h2></summary>

**Focus:** Menanam mata dan telinga sistem (*Logging* & Pesan).
**Target:** Transaksi terekam ke dalam Audit Log, kerangka lonceng notifikasi terbangun pasif.
**Dependencies:** Master Data (`v1.2.0`).

### Features
**CMS Cabang**
* Tabel *Audit Log Viewer* (Mode Pembacaan Mutlak).
* Bel *Notifications* (Penerima).
**CMS Komisariat**
* Bel *Notifications* (Penerima).

### Checklist
* `[x]` **Database Tasks:** Fungsi injeksi pasif *Append-Only* ke `audit_logs`.
* `[x]` **UI Tasks:** Tabel jejak aktivitas (*Audit Table*) dengan *IP Tracker* sederhana.
* `[x]` **API Tasks:** Konfigurasi pemanggilan berkala Lonceng *header* melalui TanStack Query.

### Deliverables
* Mata-mata log aktivitas bekerja tanpa terlihat dari pengguna (`background trace`).
* Antarmuka pusat notifikasi di *header* CMS.

### Success Criteria
* Menambahkan Kategori di `v1.2.0` langsung merefleksikan catatan *`"Action: CREATE_CATEGORY"`* di Audit Log secara ajaib.
</details>

---

<details>
<summary><h2>v1.4.0 Core Content (Drafting)</h2></summary>

**Focus:** Penciptaan draf entitas utama (Artikel dan Agenda).
**Target:** Pengguna dapat menumpuk dan mendesain draf di sisi server.
**Dependencies:** `v1.3.0` dan Ketersediaan Taksonomi (`v1.2.0`).

### Features
**CMS Komisariat**
* Penyuntingan Artikel (*Article Composer* Tiptap).
* Form Penjadwalan Agenda (*Event Scheduler*).

### Checklist
* `[x]` **UI Tasks:** Mengintegrasikan pustaka Tiptap ke dalam wujud komponen FSD stabil.
* `[x]` **API Tasks:** Komputasi status tenggat pendaftaran agenda asinkron.
* `[x]` **Permission Tasks:** Memagari form agar Admin Komisariat hanya bisa melihat tulisan miliknya (kunci RLS aplikasi berdasar *User Session*).

### Deliverables
* Modul Redaksi Tiptap dan Kalender Formulir Agenda.

### Success Criteria
* Tabel Artikel dapat menampung teks *Rich-HTML* Tiptap secara komprehensif tanpa terhapus peramban web (*sanitized HTML*).
</details>

---

<details>
<summary><h2>v1.5.0 Review Workflow</h2></summary>

**Focus:** Sistem birokrasi persetujuan terpusat (*Approve/Reject*).
**Target:** Menyambungkan modul Draf (`v1.4.0`) kepada rantai Notifikasi (`v1.3.0`) via palu persetujuan Cabang.
**Dependencies:** `v1.4.0` Core Content.

### Features
**CMS Cabang**
* *Review Center* polimorfik (Kanban Antrean Persetujuan Artikel, Agenda, Profil, Kader).
**CMS Komisariat**
* Panel Riwayat Tinjauan (*Revision Notes*).

### Checklist
* `[x]` **Database Tasks:** Pembungkusan fungsi *Prisma Transaction* anti-*race-condition*.
* `[x]` **API Tasks:** Logika penciptaan *Review History* merangkap lompatan kueri mutasi status (DRAFT -> PUBLISHED).
* `[x]` **UI Tasks:** Panel telaah konten ganda (*Split Screen*).

### Deliverables
* Meja pengadilan (*Review Center*) tempat Cabang menyetujui, menolak, atau mengembalikan dengan catatan atas draf masuk.

### Success Criteria
* Cabang menekan `Approve` → Status Artikel menjadi `PUBLISHED` + Notifikasi hijau muncul di dasbor Komisariat + Audit Log mencatat `APPROVED_ARTICLE` secara *Atomic* (Tidak ada yang gagal).
</details>

---

<details>
<summary><h2>v1.6.0 Commissariat Modules</h2></summary>

**Focus:** Kepatuhan dan pelengkapan atribut individu organisasi dasar.
**Target:** Admin Komisariat dapat mengubah identitas kepengurusannya dan menyetorkan absensi.
**Dependencies:** `v1.5.0 Review Workflow` (karena profil ini wajib ditinjau).

### Features
**CMS Komisariat**
* Form Perubahan Profil Ganda (Draf & Tayang).
* *Cadre Verification Uploader* (Excel Berkas Validasi).

### Checklist
* `[x]` **Database Tasks:** Modifikasi *record* duplikasi data dari draf ditarik menimpa tabel tayang profil.
* `[x]` **Storage Tasks:** Penampungan fail verifikasi kader Excel ke Cloudinary menggunakan skema akses terotentikasi (*Secure Signed URLs*).
* `[x]` **Permission Tasks:** Cabang berhak membaca Excel rahasia via skema *Signed URLs* Cloudinary.

### Deliverables
* Form mutasi identitas sosial organisasi tingkat bawah dan alat kepatuhan administrasi tertutup.

### Success Criteria
* Pembaruan profil draf *TIDAK* merusak nama profil orisinal sebelum Cabang mengeklik "Setuju" di *Review Center*.
</details>

---

<details>
<summary><h2>v1.7.0 Media & Files</h2></summary>

**Focus:** Deposito gambar, rak buku dokumen organisasi publik, dan galeri kolektif.
**Target:** Penyediaan memori awan tak terbatas untuk media CMS via Cloudinary.
**Dependencies:** Konfigurasi *Environment* Cloudinary (`CLOUDINARY_URL`).

### Features
**CMS Cabang**
* Manajemen Album Galeri Publik.
* Penempatan repositori `Document Management` (*PDF/Surat Edaran*).

### Checklist
* `[x]` **Storage Tasks:** Operasi batas ukuran maksimal 5MB per media untuk memproteksi kelebihan tagihan peladen.
* `[x]` **Storage Tasks:** Penanganan siklus hidup media (*Replace file* saat *update*, *Delete file* fisik awan via *Destroy API* Cloudinary saat *record* dihapus).
* `[x]` **API Tasks:** Kueri *Cloudinary Node.js SDK* (*Upload/Remove asset*).
* `[x]` **UI Tasks:** Papan jatuhkan berkas (*Drag and drop zone*) masal.

### Deliverables
* Ruang penyimpanan berkas interaktif dan terkelompok (*Folder-like albums*) yang dikelola sepihak oleh Cabang tanpa perlu masuk *Review Center*.

### Success Criteria
* Gambar yang disuntik dari `Tiptap` atau `Gallery` diotomatisasi kompresinya (ekstensi modern `webp`/`avif`) lewat URL Cloudinary secara optis. Kegagalan penghapusan arsip media tak menyisakan fail yatim piatu yang membengkak di *Cloudinary*.
</details>

---

<details>
<summary><h2>v1.8.0 Dashboard & Search</h2></summary>

**Focus:** Menyatukan porsi komputasi untuk kemudahan navigasi puncak.
**Target:** Administrator (Cabang/Komisariat) dapat merangkum analitik bulanan dan menelusuri segalanya.
**Dependencies:** Kesediaan data melimpah dari modul sebelumnya.

### Features
**CMS Cabang**
* *Global Search (Command Menu)* lintas modul (Artikel, Agenda, Dokumen, Komisariat, Organisasi).
* *Dashboard Overview Analytics & Top 5 Leaderboard*.
**CMS Komisariat**
* Dasbor ringkas aktivitas pribadi.

### Checklist
* `[x]` **Database Tasks:** Operasi komputasi agregasi untuk menduduki *Top 5 Commissariats* (Terbanyak Publikasi).
* `[x]` **API Tasks:** Telusur cerdas *debounced* mencakup artikel, agenda, dokumen, komisariat, dan struktur organisasi berdasarkan relevansi.
* `[x]` **UI Tasks:** *Command Palette (Dialog)* pintasan kibor `Ctrl+K`.
* `[x]` **UI Tasks:** Standarisasi padding, margin, tombol back, serta implementasi RSC streaming tanpa placeholder kerangka di dasbor.

### Deliverables
* Indikator *Metrics Dashboard* elegan dan pencarian omnibox super cepat (*Search everything*).

### Success Criteria
* Pencarian global responsif membuahkan hasil akurat hitungan mikrodetik dengan navigasi yang dialihkan mulus oleh rute FSD.
</details>

---

<details>
<summary><h2>v1.9.0 Public Website</h2></summary>

**Focus:** Perakitan bingkai luar eksternal (*Frontend Client*).
**Target:** Seluruh rakyat umum mampu menikmati hasil pengarsipan CMS melalui halaman yang *SEO Friendly*.
**Dependencies:** Konten CMS `v1.8.0`.

### Features
**Public Website**
* Halaman Beranda (Hero, Slider).
* Halaman Direktori Bersortir (`/struktur`, `/komisariat`, `/dokumen`, `/galeri`).
* Detail Baca Interaktif (`/artikel/[slug]`, `/agenda/[slug]`).
* Infrastruktur SEO Dibalik Layar (`robots.txt`, `sitemap.xml`).

### Checklist
* `[ ]` **UI Tasks:** Pembangunan komponen *Pagination* (*Infinite Scroll* atau Angka), panel *Filtering*, dan sakelar *Sorting* (Tanggal Terbit).
* `[ ]` **UI Tasks:** Menginjeksi kelas *Tailwind v4* khusus dan desain visual ciamik (Glassmorphism, dsb).
* `[ ]` **API Tasks:** Menyusun API Metadata dinamis untuk pratinjau sosial media (*OpenGraph* Facebook/WhatsApp).
* `[ ]` **API Tasks:** Kompilasi fungsi `sitemap.ts` Next.js (*Dynamic Sitemap Metadata Route*).

### Deliverables
* Tatanan perwajahan web HMI yang lengkap, cantik, dan diindeks secara otomatis oleh *Google*.

### Success Criteria
* Interaksi direktori dokumen tidak memuat ulang halaman (*No hard reload*) berkat sinkronisasi penelusuran URL bawaan. `sitemap.xml` menjabarkan seluruh URL dinamis terbaru dengan tepat.
</details>

---

<details>
<summary><h2>v1.10.0 QA & Production Launch</h2></summary>

**Focus:** Validasi, pembersihan kuman sistem (*bug*), stabilitas peladen, dan distribusi awan.
**Target:** CMS dapat diakses lintas gawai, bebas *error*, tangguh (*resilient*), dan dilarikan ke ranah Vercel Production.
**Dependencies:** Keseluruhan kode tuntas di `v1.9.0`.

### Features
**CMS & Public Web**
* Penyelamatan Data Akhir & Penembusan Validasi Server Vercel.
* Infrastruktur Pertahanan Produksi (*Production Readiness*).

### Checklist
* `[ ]` **Testing Tasks:** Audisi manual secara *End-to-End* pada lintas level peramban. Mencoba meretas aplikasi dengan login beda agen (*Session Hacking/Security Review*).
* `[ ]` **Testing Tasks:** Menjalankan audit Google *Lighthouse* (Target Performa > 90).
* `[ ]` **Database Tasks:** Penyiapan jadwal *Automated Backups* harian di konsol Supabase & gladi resik prosedur *Restore*.
* `[ ]` **Database Tasks:** Konfigurasi akhir rantai koneksi Prisma menggunakan `pgbouncer` atau Supabase *Pooler Connection* khusus (*Supavisor*).
* `[ ]` **UI Tasks:** Tautkan nama ranah (*Custom Domain*) di *Vercel Deployment*.
* `[ ]` Sistematisasi *Environment Validation* (*Push Env Variables* riil ke dalam sistem kompilasi Vercel).

### Deliverables
* Proyek *Go Live* secara permanen tanpa kelambatan *Cold Start*.

### Success Criteria
* Semua halaman berinteraksi nol-gesekan tanpa kegagalan *Server 500 error*. Peringkat *Lighthouse* tercapai sempurna. Situs diluncurkan kepada khalayak awam.
</details>

---

## Adjustments (Unplanned Features)
*(Area ini difungsikan murni untuk mencatat secara historis semua tugas ad-hoc atau perombakan darurat yang memaksa masuk di tengah-tengah rentang masa iterasi. Kosong secara baku).*
- **Dashboard Layout & Performance Refactoring (2026-06-22):** Refaktorisasi padding, margin, back button terpadu, dan rendering non-blocking dengan Suspense.
- **Dashboard Loading Placeholder Removal (2026-06-22):** Menghapus placeholder kerangka dari fallback `Suspense` dan `loading.tsx` sambil mempertahankan pola App Shell.
- **FSD Safe Refactoring & Codebase Cleanup (2026-06-22):** Penyelarasan arsitektur kode FSD (pemindahan widget & layout, penyelarasan nama file/folder actions.ts & schema.ts, pembersihan file usang).

## Backlog
*(Area persemayaman seluruh antrean harapan dan daftar cita-cita (wishlist) pengembangan masa depan yang dikaji bernilai namun ditendang dari gerbong utama MVP untuk mempertahankan rentang fokus waktu tim).*
- **Bulk Archive Articles & Agenda:** Kapabilitas pengarsipan serentak (*mass action*).
- **Orphan Media Cleanup:** Panel antarmuka penyapu arsip fail gambar/dokumen yang tidak lagi terikat pada satupun referensi data (menghindari kebocoran tagihan Supabase).
- **Sistem Laporan Analitik Pengunjung Situs Web** (Integrasi *Google Analytics / Vercel Web Analytics*).
- **Pendaftaran (*Login*) Otomatis Otentikasi Pihak Ketiga** (*Google SSO / OAuth*).

## Out of Scope
*(Batas demarkasi tegas yang secara saklek memblokade proyeksi pelebaran skop (Scope Creep Guard) agar tim pengembang memiliki garis mutlak prioritas MVP).*
- **Bulk Delete Operations:** Menghapus data masal dinilai terlalu riskan dan tidak diizinkan dalam MVP ini (Suntingan wajib satu per satu).
- **Native Mobile Apps:** Mengkompilasi CMS ini menjadi berkas `.apk` (Android) atau `.ipa` (iOS) secara mandiri.
- **REST API Pasokan Pihak Ketiga:** Menyediakan soket API (`/api/v1/articles`) untuk diumpankan bebas ke aplikasi atau pengembang web pihak eksternal. (Sistem dirancang mandiri merender data *Next.js Server Actions* tanpa bertindak sebagai gerbang agregator API umum).
- **Pengiriman Pesan WhatsApp Resmi:** Melancarkan perizinan Meta WA Business (*Green Tick*) untuk integrasi notifikasi ulasan masuk CMS tidak ditangani pada fase pertama ini.
