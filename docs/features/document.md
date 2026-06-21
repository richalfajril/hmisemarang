# Document Management

## Purpose
Sistem repositori penyimpanan berkas organisasi yang krusial (seperti AD/ART, Surat Keputusan, Pedoman Organisasi) agar bisa diunduh secara publik.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Pengguna membuka `/dashboard/documents`.
2. Klik "Unggah Dokumen".
3. Mengunggah *file PDF*, memberikan nama dokumen, deskripsi singkat, dan memilih Kategori (misal: "SOP").
4. Mengubah visibilitas (Publish).

## Requirements
* Hanya berkas dokumen digital tertulis, BUKAN foto atau gambar.
* Relasi berjenis *Many-to-One* dari `document` ke `document_categories`.
* Menggunakan fitur *Soft Delete* untuk perlindungan data korporasi.

## Validation Rules
* **Format Berkas:** Wajib `.pdf`.
* **Ukuran:** Maksimal 20MB.

## Permissions
* Eksklusif diakses dan dimutasi oleh tingkat **Cabang** (`SYSTEM_ADMIN`, `ADMIN_CABANG`).
* `ADMIN_KOMISARIAT` murni sebagai pengunduh pasif di *Public Website*.

## Workflow
Sama seperti Galeri, tidak memerlukan jenjang persetujuan.
`DRAFT` → `PUBLISHED` → `ARCHIVED`.

## Data Dependencies
* `document` entity.
* `taxonomy` entity (Document Categories).

## Notifications
* Tidak perlu.

## Audit Logs
Log aktivitas untuk aksi:
* Upload Document
* Edit Document Metadata
* Publish Document
* Archive / Soft Delete Document

## Edge Cases
* Nama dokumen sangat panjang melampaui lebar tabel. Harus dipotong dengan elipsis (`...`) pada UI.
* Mencoba mengunggah format Microsoft Word. Zod Validation akan menolak sebelum data dilempar ke *Cloudinary*.

## UI Behavior
* Tampilan mirip dengan File Explorer. Tabel data berisi kolom Ukuran Berkas, Tanggal Publikasi, dan Ekstensi.
* Tombol *Download* dan *Preview* terpisah agar PDF bisa dibuka di peramban tanpa memaksa unduhan.

## Acceptance Criteria
* Data terekam dengan besaran kapasitas berkas (`file_size`).
* Pengunjung publik dapat langsung mencari ("SOP Pengkaderan") lewat kotak pencarian terpusat dokumen di `/dokumen`.
