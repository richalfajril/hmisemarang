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
4. Klik **"Simpan Draf"** → validasi field wajib di klien → **pratinjau full-screen** (memakai `ArticleReadingView`, tampilan identik halaman baca).
5. Di pratinjau: **Edit** (tutup, kembali ke form, data utuh — belum tersimpan) atau aksi final per peran:
   * `ADMIN_CABANG` / `SYSTEM_ADMIN` → **Publish**: langsung berstatus `PUBLISHED` (tampil di web depan, `approved_at/by` = diri sendiri).
   * `ADMIN_KOMISARIAT` → **Ajukan Draf**: berstatus `SUBMITTED`, masuk antre review Cabang.
   * Persistensi ke DB **hanya** saat aksi final (tak ada draf perantara).

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
* `ADMIN_CABANG` dan `SYSTEM_ADMIN` dapat Mengedit, *Soft Delete*, dan **Direct Publish** (dari pratinjau, tanpa antre review).
* `ADMIN_KOMISARIAT` dilarang melakukan *Direct Publish* (dipaksa `SUBMITTED` di server meski `target_status` di-*tamper*).

## Workflow
`Draft` → `Submitted` → `Revision` → `Approved` → `Published` (transisi status & riwayat peninjauan ditangani modul `content-review`). **Jalur cepat Cabang/System Admin:** dari pratinjau tulis artikel langsung ke `Published` tanpa antre review.

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
* Artikel baru disimpan lewat pratinjau: `PUBLISHED` (Cabang/System Admin) atau `SUBMITTED` (Komisariat) — bukan `DRAFT` perantara. Status `DRAFT` hanya muncul dari hasil revisi/penolakan di `content-review`.
* Artikel yang telah di-*publish* muncul di *Website Public* (`/artikel/[slug]`) dengan URL ramah-SEO.
* *Soft deleted* artikel hilang seketika dari visibilitas *Website Public*.
