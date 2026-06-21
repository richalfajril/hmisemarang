# PRD.md

# HMI Cabang Semarang CMS & Public Website

## 1. Product Overview

HMI Cabang Semarang CMS adalah platform manajemen konten dan informasi organisasi yang digunakan untuk mengelola publikasi artikel, agenda kegiatan, data komisariat, struktur kepengurusan, galeri dokumentasi, dan informasi organisasi yang ditampilkan pada website publik HMI Cabang Semarang.

Sistem dirancang untuk mendukung operasional:

* 1 Cabang
* 36 Komisariat
* Pergantian kepengurusan setiap periode
* Workflow review dan approval terpusat

Website publik berfungsi sebagai:

* Portal publikasi artikel
* Portal informasi kegiatan
* Direktori komisariat
* Profil organisasi

---

# 2. Product Goals

## Primary Goals

* Menyediakan sistem publikasi terpusat untuk cabang dan komisariat.
* Menstandarkan proses review dan approval konten.
* Menjadi arsip digital organisasi.
* Menyediakan direktori komisariat yang terstruktur.
* Mendukung transisi kepengurusan antar periode.

## Success Metrics

* Seluruh artikel komisariat dipublikasikan melalui workflow review.
* Seluruh komisariat memiliki profil digital yang terverifikasi.
* Informasi organisasi selalu terbarui setiap periode.
* Pengelolaan website dapat dilakukan tanpa perubahan kode aplikasi.

---

# 3. User Roles

Tidak ada akun untuk anggota biasa. Hanya terdapat role berikut:

## SYSTEM_ADMIN

Hak akses penuh sistem. SYSTEM_ADMIN acts as platform owner/developer role and may bypass all workflows.

### Permissions

* Full Access
* Direct Publish
* Direct Approval
* Manage All Content
* Manage Admin Cabang
* Manage Komisariat
* Change Email
* Force Reset Password
* Send Invite Link
* Access Audit Log

---

## ADMIN_CABANG

### Permissions

* Review Artikel
* Review Agenda
* Review Profil Komisariat
* Manage Artikel
* Manage Agenda
* Manage Galeri
* Manage Komisariat
* Manage Pengurus & Periode
* Manage Website Settings
* Manage Users
* Force Reset Password Komisariat
* Access Audit Log

---

## ADMIN_KOMISARIAT

### Permissions

* Manage Artikel
* Manage Agenda
* Manage Profil Komisariat
* Upload Data Kader
* Change Password

---

# 4. Authentication & Access

## Login

### Onboarding

Invite Link → Set Password

### Daily Login

Email + Password

---

## Password Recovery

### Normal Recovery

Forgot Password → Email Reset Link

### Emergency Recovery

Admin Cabang:

* Generate Temporary Password

System Admin:

* Force Reset Password
* Change Email
* Reinvite User

---

## Session Policy

Single Active Session

Login pada perangkat baru akan mengakhiri sesi perangkat sebelumnya.

---

## Ownership

Akun Komisariat merupakan milik organisasi, bukan milik individu.

---

# 5. Article Module

## Features

* Create Article
* Save Draft
* Edit Article
* Delete Article
* Submit Article
* Request Revision
* Approve Article
* Reject Article
* Publish Article
* Archive Article

---

## Article Workflow

Draft
→ Submitted
→ Revision (Catatan disimpan dalam Review History)
→ Approved (Disimpan dalam Review History)
→ Published

atau

Draft
→ Submitted
→ Rejected
→ Edit
→ Submit Ulang

Catatan: Rejected tidak bersifat permanen, konten yang ditolak dapat diajukan ulang.

---

## Categories

Relationship: `Article N:1 Category` (One article can only belong to one category. No junction table required).

Default:

* Berita
* Opini
* Kajian
* Rilis Resmi
* Kegiatan
* Pernyataan Sikap

Admin Cabang dapat menambah kategori baru.

---

## Tags

Relationship: `Article N:M Tag` (One article may have multiple tags. Junction table is required).

Admin Cabang dapat menambah tag baru.

Catatan: Tags hanya digunakan sebagai metadata internal dan filter. Tidak ada halaman publik khusus untuk tags (misalnya `/artikel/tag/[slug]`).

---

## Author

* Nama Penulis
* Asal Komisariat

---

## Featured Image

Required

* Ratio: 16:9
* Recommended: 1200x675

---

## Editor

Tiptap Editor

Features:

* Heading
* Paragraph
* Bold
* Italic
* Underline
* Lists
* Quote
* Link
* Image
* YouTube Embed
* Table
* Code Block

---

## SEO

* Meta Title
* Meta Description

Fallback otomatis jika tidak diisi.

---

## URL Structure

/berita/[slug]

/opini/[slug]

/kajian/[slug]

---

# 6. Commissariat Module

## Commissariat Account

1 Komisariat = 1 Akun

---

## Commissariat Profile

* Logo
* Nama Komisariat
* Tentang
* Kampus
* Foto Sekretariat
* Ketua Umum
* Foto Ketua Umum
* Periode Ketua Umum
* Jumlah Kader
* Instagram
* Alamat
* Google Maps

---

## Profile Workflow

Edit
→ Submit
→ Review (Catatan disimpan dalam Review History)
→ Approve (Disimpan dalam Review History)
→ Publish

atau ditolak:
Submit → Rejected → Edit → Submit Ulang

Published data tetap tampil hingga perubahan disetujui.

---

## Cadre Verification

Dedicated Cadre Verification Entity.

Workflow:
Upload Excel → Pending Verification → Verified or Rejected

Store:
* commissariat_id
* file_url
* row_count
* status
* verified_by
* verified_at
* note

Publik hanya melihat jumlah kader (berdasarkan record terbaru dengan status VERIFIED).

---

## Public Page

### List

/komisariat

### Detail

/komisariat/[slug]

Menampilkan:

* Profil Komisariat
* Ketua Umum
* Jumlah Kader
* Artikel Komisariat

---

# 7. Organization & Period Module

## Period Management

* Create Period
* Edit Period
* Archive Period

---

## Structure Workflow

Create Period
→ Create Positions
→ Assign People

---

## Position Data

* Jabatan
* Urutan Tampil

---

## Board Member Data

* Nama
* Foto
* Bio Singkat
* Instagram

---

## Public Structure Page

### KSB Layout

Sekretaris | Ketua | Bendahara

### Kabid Layout

Grid Card

---

## Historical Data

Setiap periode dapat dilihat kembali oleh publik.

---

# 8. Agenda Module

## Ownership

Cabang:
Publish langsung

Komisariat:
Harus melalui review

---

## Workflow

Draft
→ Submitted
→ Revision (Catatan disimpan dalam Review History)
→ Approved (Disimpan dalam Review History)
→ Published
→ Finished

atau

Draft → Submitted → Rejected → Edit → Submit Ulang

---

## Agenda Data

* Flyer
* Judul
* Deskripsi
* Tanggal
* Waktu
* Lokasi
* Lokasi URL

---

## CTA Buttons

Setiap CTA memiliki:

* Title
* URL

Multiple CTA diperbolehkan.

---

## Status

Compute dynamically (Do NOT store agenda status in database).

Rules:

* `today < start_date` → Akan Datang
* `today between start_date and end_date` → Berlangsung
* `today > end_date` → Selesai

---

# 9. Gallery Module

## Ownership

Admin Cabang only

---

## Workflow

Gallery Albums support status workflow.

Statuses:
* Draft
* Published
* Archived

Workflow:
Draft → Published → Archived

Note: No review process required.

---

## Structure

Album
→ Photos

---

## Album Data

* Cover
* Judul
* Deskripsi
* Tanggal
* Agenda Terkait (Optional)

---

## Photo Data

* Image
* Caption (Optional)
* Sort Order

---

## Public Pages

/galeri

/galeri/[slug]

---

# 10. Document Module

## Ownership

ADMIN_CABANG

---

## Workflow

Draft
→ Published
→ Archived

Tidak diperlukan proses review (Submitted, Revision, Approval) karena hanya ADMIN_CABANG yang memiliki akses.

---

## Document Status & Visibility

* Draft: Not Visible
* Published: Visible
* Archived: Not Visible
* Deleted (Soft Delete): Not Visible

---

## Document Data

Required:

* Title
* Category (Relationship: `Document N:1 Category`. Contoh: AD/ART, PO, SOP, Surat Keputusan. Admin Cabang dapat menambah kategori baru. No junction table required.)
* PDF File
* Publish Date

Optional:

* Description

---

## Public Page

Route: `/dokumen`

Layout: Table View

Columns:

* Judul
* Kategori
* Tanggal Publikasi

Features:

* Search
* Filter Category
* Pagination (Default: 10 items per page)
* View PDF
* Download PDF

SEO: Publicly Indexable

---

# 11. Data Lifecycle

## Soft Delete Strategy

Soft delete is allowed for:

* Artikel
* Agenda
* Album Galeri
* Dokumen

Soft deleted data tidak ditampilkan di Public Website.

Do NOT soft delete:

* Komisariat
* Periode
* Kategori
* Tag

Instead use `is_active` or `archived` to prevent orphaned published content.
If a commissariat still owns published content, soft delete is not allowed and the system must prevent deletion.

---

## Review History

Do NOT store revision notes directly on Article, Agenda, or Commissariat. Create a dedicated Review History entity.

Relationship: `Content 1:N ReviewHistory`

Applies To:
* Article
* Agenda
* Commissariat Profile

ReviewHistory stores:
* reviewer_id
* action (APPROVED, REJECTED, REVISION_REQUESTED)
* note
* created_at

Revision history must be preserved permanently.

Required Fields:

* deleted_at
* deleted_by

---

# 12. Dashboard

## Admin Cabang Dashboard

Widgets:

* Artikel Menunggu Review
* Agenda Menunggu Review
* Profil Komisariat Menunggu Review
* Agenda Terdekat
* Aktivitas Terbaru

---

## Review Center

Unified Review Center

Contains:

* Artikel
* Agenda
* Profil Komisariat

---

## Quick Actions

* Buat Artikel
* Buat Agenda

---

## Global Search

Search:

* Artikel
* Agenda
* Komisariat
* Dokumen

---

## Leaderboard

Top Komisariat berdasarkan jumlah artikel publish.

---

## Admin Komisariat Dashboard

Widgets:

* Status Artikel
* Status Agenda
* Status Profil Komisariat
* Jumlah Artikel Publish
* Draft Counter

---

# 13. Notifications

## Delivery

In-App Only

---

## Features

* Read / Unread
* Mark All As Read
* Notification Center

---

## Events

Komisariat:

* Artikel Disetujui
* Artikel Direvisi
* Artikel Ditolak
* Agenda Disetujui
* Agenda Direvisi
* Profil Disetujui
* Profil Direvisi

Cabang:

* Artikel Menunggu Review
* Agenda Menunggu Review
* Profil Menunggu Review

---

# 14. Audit Log

## Access

* SYSTEM_ADMIN
* ADMIN_CABANG

---

## Recorded Events

### Authentication

* Login
* Logout
* Failed Login

### Articles

* Create
* Edit
* Delete
* Submit
* Approve
* Reject
* Publish

### Agenda

* Create
* Edit
* Submit
* Approve
* Reject
* Publish

### Profile

* Edit
* Submit
* Approve

### Users

* Create User
* Change Email
* Password Reset
* Force Reset Password
* Role Changes

---

## Stored Data

* User
* Action
* Target
* Timestamp
* IP Address
* Device
* Browser
* approved_by
* approved_at
* deleted_at
* deleted_by

---

# 15. Website Settings

## Branding

Editable:

* Logo
* Favicon
* Website Name

Fixed:

* Opening Screen
* Hero Heading
* Hero Subheading

---

## Contact Information

* Address
* Email
* WhatsApp
* Instagram
* Maps URL

---

## Social Media

* Instagram
* TikTok
* YouTube
* X/Twitter

---

## SEO Default

* Default Meta Title
* Default Meta Description
* Default Open Graph Image

---

## Analytics

Supported

---

## Maintenance Mode

Supported

---

# 16. Media Optimization Pipeline

All uploaded images:

Validate
→ Resize
→ Convert WebP
→ Store

---

## Article

1200x675

---

## Agenda

1080x1350

---

## Gallery

Resize longest side
→ WebP

---

# 17. Public Website

## Pages

/

/profil

/struktur-organisasi

/artikel

/artikel/[slug]

/artikel/kategori/[slug]

/agenda

/agenda/[slug]

/komisariat

/komisariat/[slug]

/galeri

/galeri/[slug]

/dokumen

/search

/kontak

---

## Homepage

### Opening Screen

Yakin
Usaha
Sampai

---

### Hero

Heading:

Membangun Kader Umat
dan Bangsa dari Semarang

Subheading:

HMI Cabang Semarang menjadi ruang kaderisasi, gagasan, dan pengabdian bagi mahasiswa Islam untuk berkontribusi nyata bagi agama dan negara.

CTA:

* Selengkapnya
* Login

---

### Sections

* Statistics
* Search
* Komisariat Carousel
* Featured Articles
* Agenda Carousel
* Gallery Preview

---

## Theme

* Light Mode
* Dark Mode
* System Preference

---

# 18. MVP Scope

Included:

* Authentication
* Articles
* Commissariats
* Agenda
* Gallery
* Documents Module
* Organization Structure
* Period Management
* Dashboard
* Notifications
* Audit Logs
* Public Website
* Website Settings

Excluded:

* Mobile App
* Forum
* Chat
* Membership System
* Online Registration System
* Advanced Permission Builder
* Multi Branch Support
* Multi Tenant Support
