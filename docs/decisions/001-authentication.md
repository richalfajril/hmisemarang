# 001 - Authentication & Product Refinements

# Additional Decisions After PRD Review

## G15. Revision Notes

### Decision

Admin Cabang wajib memberikan catatan revisi saat melakukan:

* Request Revision Artikel
* Request Revision Agenda
* Request Revision Profil Komisariat

### Reason

Memberikan kejelasan kepada Komisariat mengenai perubahan yang harus dilakukan.

### Required Field

Revision Note

Example:

* Perbaiki judul artikel
* Tambahkan sumber gambar
* Perbaiki penulisan nama kegiatan

---

## G16. Rejected Content

### Decision

Konten yang ditolak dapat diajukan ulang.

Workflow:

Draft
→ Submitted
→ Rejected
→ Edit
→ Submit Ulang

Rejected tidak bersifat permanen.

---

## H17. Approval Metadata

### Decision

Setiap approval wajib menyimpan informasi approver.

Stored Data:

* Approved By
* Approved At

Applies To:

* Artikel
* Agenda
* Profil Komisariat

---

## H18. Soft Delete

### Decision

Semua data utama menggunakan soft delete.

Applies To:

* Artikel
* Agenda
* Album Galeri
* Dokumen

### Database

Required Fields:

* deleted_at
* deleted_by

### Public Website

Soft deleted data tidak ditampilkan.

---

## I19. Member Accounts

### Decision

Tidak ada akun untuk anggota biasa.

Current Roles:

* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

---

## I20. Public Documents Module

### Decision

Modul Dokumen ditambahkan ke MVP.

---

# Document Module

## Ownership

Admin Cabang

---

## Features

* Upload Dokumen
* Edit Metadata
* Publish Dokumen
* Archive Dokumen
* Soft Delete Dokumen

---

## Supported Files

Initial MVP:

* PDF

Future:

* DOCX
* XLSX

---

## Document Categories

Examples:

* AD/ART
* PO
* SOP
* Surat Keputusan
* Dokumen Kaderisasi

Admin Cabang dapat menambah kategori baru.

---

## Document Data

* Judul
* Kategori
* Deskripsi
* File PDF
* Publish Date

---

## Public Page

Route:

/dokumen

---

## Layout

Table View

Columns:

* Judul
* Kategori
* Tanggal Publikasi

---

## Features

* Search
* Pagination
* View PDF
* Download PDF

---

## Pagination

Default:

10 Rows Per Page

---

## SEO

Publicly Indexable

---

# Impacted Documents

Must be updated:

* PRD.md
* SITEMAP_PUBLIC.md
* SITEMAP_CMS.md
* DATABASE_SCHEMA.md
* ROLE_PERMISSION_MATRIX.md
* API_SPECIFICATION.md
