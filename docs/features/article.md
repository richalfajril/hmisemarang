# Article Management

## Purpose
Menyediakan modul pengelolaan publikasi artikel berita, opini, dan kajian untuk cabang maupun komisariat secara terstruktur.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

## User Flow
1. Pengguna membuka `/dashboard/articles`.
2. Klik "Buat Artikel" untuk masuk ke Tiptap Editor.
3. Isi judul, konten, unggah *thumbnail* (16:9), dan pilih kategori.
4. Simpan sebagai Draf atau ajukan peninjauan (*Submit for Review*).

## Requirements
* Artikel wajib memiliki Judul, Konten Tiptap, Kategori, dan *Featured Image*.
* Pengarang (Author) dan asal komisariat harus dicatat.
* Artikel mendukung penyimpanan SEO kustom (Meta Title & Description).
* Menggunakan mekanisme *Soft Delete*.

## Validation Rules
* **Title:** Wajib, maksimal 120 karakter.
* **Featured Image:** Wajib, rasio disarankan 16:9. Maksimal 5MB.
* **Category:** Wajib memilih 1 dari entitas `article_categories`.
* **Content:** Tidak boleh kosong, teks murni minimal 50 karakter.

## Permissions
* `ADMIN_KOMISARIAT` dapat Membuat, Mengedit, Soft Delete, dan Submit artikel milik komisariat mereka sendiri (Scoped Access).
* `ADMIN_CABANG` dapat Mengedit dan melakukan *Soft Delete* seluruh artikel.
* `ADMIN_KOMISARIAT` dilarang melakukan *Direct Publish*.

## Workflow
`Draft` → `Submitted` → `Revision` → `Approved` → `Published` (Alur transisi status dan pencatatan riwayat peninjauan ditangani oleh modul `content-review`).

## Data Dependencies
* `article` entity.
* `taxonomy` entity (Category, Tag).

## Notifications
* (Lihat fitur `content-review` untuk notifikasi pengajuan).

## Audit Logs
Log aktivitas untuk aksi:
* Create Article
* Edit Article
* Delete Article (Soft Delete)
* Restore Article

## Edge Cases
* Gambar gagal diunggah saat menyimpan form artikel (UI harus menampilkan pesan ralat *upload* dan mencegah submit form).
* Artikel dihapus lunak (*soft deleted*) namun tautan fisiknya masih diakses dari luar (Harus me-render halaman *404 Not Found* di Public Website).

## UI Behavior
* Tiptap Editor dengan kemampuan penyesuaian teks yang kaya (Heading, Bold, List, Image Embed).
* Tombol *Save Draft* dan *Submit* terpisah secara visual di *Action Bar* bawah atau samping.
* Pratinjau rasio *Featured Image* sebelum diunggah.

## Acceptance Criteria
* Artikel yang baru dibuat secara *default* berstatus `DRAFT`.
* Artikel yang telah di-*publish* muncul di *Website Public* (`/artikel/[slug]`) dengan URL ramah-SEO.
* *Soft deleted* artikel hilang seketika dari visibilitas *Website Public*.
