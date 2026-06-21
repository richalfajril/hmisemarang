# Features Discovery

## Purpose
Dokumen ini mendefinisikan pembagian fungsional aplikasi ke dalam blok-blok *Features* dan *Entities* berdasarkan prinsip Feature-Sliced Design (FSD). Pemetaan ini didapatkan dari hasil sintesis `SITEMAP_CMS.md`, `DATABASE_SCHEMA.md`, dan `FSD_ARCHITECTURE_REVIEW.md`.

Dokumen ini wajib dijadikan acuan saat menamai dan menempatkan komponen maupun *Server Actions* ke dalam struktur direktori `src/features` dan `src/entities`.

---

## 1. Domain Entities (`src/entities`)

*Entities* adalah model bisnis pasif. Mereka tidak tahu menahu soal alur kerja (seperti *Approve*/*Reject*), melainkan hanya peduli pada representasi data dan komponen UI pasif murni (*dumb components* seperti `ArticleCard`, `UserAvatar`).

1. **`user`**: Akun CMS, *Roles* (SYSTEM_ADMIN, ADMIN_CABANG, ADMIN_KOMISARIAT).
2. **`article`**: Entitas konten artikel, meta-data, dan relasi kompositnya.
3. **`agenda`**: Entitas jadwal, lokasi, *flyer*, dan tautan pendaftaran.
4. **`commissariat`**: Profil terbit (*published*) dari organisasi komisariat.
5. **`profile-submission`**: Entitas draf profil komisariat yang sedang dalam masa peninjauan.
6. **`cadre-verification`**: Representasi pengajuan validasi kader (berkas Excel).
7. **`gallery`**: Entitas Album dan kumpulan Foto.
8. **`document`**: Entitas berkas publik (PDF/Word) yang siap diunduh.
9. **`organization`**: Kepengurusan (Mencakup entitas turunan: *Periods*, *Positions*, *Board Members*).
10. **`taxonomy`**: Klasifikasi data (Mencakup entitas turunan: *Article Categories*, *Article Tags*, *Document Categories*).
11. **`notification`**: Sistem pesan peringatan untuk pengguna.
12. **`audit-log`**: Observability entity. Rekam jejak aktivitas mutasi sistem (tidak bisa diubah).
13. **`website-settings`**: Singleton configuration entity. Pengaturan tunggal konfigurasi aplikasi (SEO, Logo, Alamat). Bukan entitas bisnis standar.

---

## 2. Interactive Features (`src/features`)

*Features* adalah fungsi aktif yang dijalankan pengguna. Fitur dapat memanipulasi banyak entitas sekaligus (misal: fitur `content-review` akan memutasi entitas `article`, membuat entitas `review-history`, dan mengirim entitas `notification`).

### A. Authentication & Access
* **`auth`**
  * *Actions:* Login, Lupa Password, Reset Password.
  * *Dependencies:* `user` entity.

### B. Core Content Modules
* **`article-management`**
  * *Actions:* Buat Draf, Edit Artikel, Hapus (*Soft Delete*), *Submit for Review*, *Archive*.
  * *Dependencies:* `article`, `taxonomy` entities.
* **`agenda-management`**
  * *Actions:* Buat Jadwal, Edit, Unggah *Flyer*, Kelola Tautan Pendaftaran (*Agenda Links*).
  * *Dependencies:* `agenda` entity.
* **`gallery-management`**
  * *Actions:* Buat Album, Unggah Foto, Urutkan Foto (*Sort*), Jadikan *Cover*.
  * *Dependencies:* `gallery` entity.
* **`document-management`**
  * *Actions:* Unggah Berkas PDF, Sunting Meta-data, Terbitkan Dokumen.
  * *Dependencies:* `document`, `taxonomy` entities.

### C. Commissariat Modules
* **`profile-management`**
  * *Actions:* Sunting Profil Komisariat (oleh Admin Komisariat) → menghasilkan *Submission*.
  * *Dependencies:* `commissariat`, `profile-submission` entities.
* **`cadre-verification-management`**
  * *Actions:* Unggah Excel Data Kader, Lihat Catatan Penolakan.
  * *Dependencies:* `cadre-verification`, `commissariat` entities.

### D. Centralized Review Workflow (Cabang Only)
* **`content-review`**
  * *Fitur ini sangat sentral dan kering (DRY) karena menangani status persetujuan secara polimorfik.*
  * *Actions:* 
    * `approveContentAction`
    * `rejectContentAction`
    * `requestRevisionAction`
  * *Dependencies:* `article`, `agenda`, `profile-submission`, `cadre-verification`, `notification` entities. (Review history diperlakukan sebagai data internal workflow yang dimiliki eksklusif oleh fitur ini).

### E. Master Data & Configuration
* **`organization-management`**
  * *Actions:* Kelola Periode Aktif, Susun Posisi Kepengurusan, Tambah Pengurus Cabang.
  * *Dependencies:* `organization` entity.
* **`taxonomy-management`**
  * *Actions:* Tambah/Edit Kategori Artikel, Tag, Kategori Dokumen.
  * *Dependencies:* `taxonomy` entity.
* **`user-management`**
  * *Actions:* Undang Admin Cabang Baru, Buat Akun Komisariat, *Force Reset Password*, Cabut Akses (*Archive*).
  * *Dependencies:* `user`, `commissariat` entities.
* **`website-settings-management`**
  * *Actions:* Perbarui Logo Situs, Sesuaikan SEO, Sunting Teks Footer.
  * *Dependencies:* `website-settings` entity.

### F. Analytics & Monitoring
* **`notification-management`**
  * *Actions:* Tandai Dibaca (*Mark as Read*), Tandai Semua Dibaca, Polling Notifikasi Baru.
  * *Dependencies:* `notification` entity.
* **`audit-log-viewer`**
  * *Actions:* Filter Log berdasarkan *User*, Filter berdasarkan *Entity*, Ekspor Log.
  * *Dependencies:* `audit-log` observability entity.

### G. Discovery & Dashboard
* **`search`**
  * *Actions:* Global Search lintas entitas (Artikel, Agenda, Komisariat, Dokumen).
  * *Dependencies:* `article`, `agenda`, `commissariat`, `document` entities.
* **`dashboard-overview`**
  * *Actions:* Render metrics, tampilkan ringkasan *widget*, tampilkan klasemen artikel (*leaderboard*).
  * *Dependencies:* Lintas entitas agregat.

---

## 3. Widget Assembly (`src/widgets`)

*Widgets* bertindak sebagai penampung tata letak yang merakit entitas dan fitur menjadi satu unit fungsional di halaman antarmuka. 

Contoh rakitan:
* **`ReviewCenterBoard`**: Widget yang menyatukan Tabel Data `article` (Entity) dengan aksi tombol *Approve/Reject* dari `content-review` (Feature).
* **`PublicArticleShowcase`**: Widget yang menyatukan Filter dari `taxonomy-management` dengan kartu UI dari `article` untuk halaman depan.
* **`DashboardSidebar`**: Navigasi persisten yang memuat avatar dari `user` dan lencana angka notifikasi dari `notification`.

---

## Kesimpulan

Penemuan fitur (*Features Discovery*) ini menjamin tidak ada duplikasi pekerjaan. Sebagai contoh, Anda tidak perlu membangun fungsi *Approve* terpisah di dalam `article-management` dan `agenda-management`; semuanya dipusatkan secara cerdas di dalam modul tunggal **`content-review`** berkat skema arsitektur FSD.
