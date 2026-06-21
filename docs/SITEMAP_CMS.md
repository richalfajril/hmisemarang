# SITEMAP_CMS.md

## Purpose

Dokumen ini mendefinisikan struktur halaman, navigasi, dan akses Dashboard CMS HMI Cabang Semarang.

Dashboard dibagi berdasarkan role:

* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

---

# Authentication

```txt
/login

/forgot-password

/reset-password
```

---

# Dashboard Structure

## ADMIN_CABANG

```txt
/dashboard
│
├── overview
│
├── review-center
│
├── articles
│   ├── /
│   ├── create
│   ├── [id]
│   └── [id]/edit
│
├── agendas
│   ├── /
│   ├── create
│   ├── [id]
│   └── [id]/edit
│
├── commissariats
│   ├── /
│   ├── [id]
│   ├── [id]/profile-review
│   └── [id]/cadre-verification
│
├── galleries
│   ├── /
│   ├── create
│   ├── [id]
│   └── [id]/edit
│
├── documents
│   ├── /
│   ├── create
│   ├── [id]
│   └── [id]/edit
│
├── organization
│   ├── periods
│   ├── positions
│   └── board-members
│
├── taxonomy
│   ├── article-categories
│   ├── article-tags
│   └── document-categories
│
├── users
│   ├── cabang-admins
│   └── commissariat-accounts
│
├── notifications
│
├── audit-logs
│
└── settings
```

---

# Dashboard Overview

Route:

```txt
/dashboard
```

Widgets:

* Artikel Menunggu Review
* Agenda Menunggu Review
* Perubahan Profil Komisariat Menunggu Review
* Agenda Terdekat
* Aktivitas Terbaru

Quick Actions:

* Buat Artikel
* Buat Agenda
* Upload Dokumen
* Tambah Album Galeri

---

# Review Center

Route:

```txt
/dashboard/review-center
```

Purpose:

Pusat seluruh proses review.

Tabs:

```txt
Articles

Agendas

Commissariat Profiles

Cadre Verification
```

Actions:

```txt
Approve

Reject

Request Revision
```

Review wajib menyimpan:

```txt
ReviewHistory
```

---

# Articles

Route:

```txt
/dashboard/articles
```

Features:

* Search
* Filter Status
* Filter Category
* Filter Commissariat
* Pagination

Statuses:

```txt
Draft
Submitted
Revision
Approved
Published
Rejected
Archived
```

Actions:

```txt
Create
Edit
Publish
Archive
Soft Delete
Restore
```

---

# Agendas

Route:

```txt
/dashboard/agendas
```

Features:

* Search
* Filter Status
* Filter Commissariat
* Pagination

Actions:

```txt
Create
Edit
Publish
Archive
Soft Delete
Restore
```

---

# Commissariats

Route:

```txt
/dashboard/commissariats
```

Features:

* Search
* View Profile
* View Articles
* View Cadre Verification
* Archive Commissariat

Detail Tabs:

```txt
Profile

Articles

Cadre Verification

Activity
```

---

# Galleries

Route:

```txt
/dashboard/galleries
```

Workflow:

```txt
Draft
Published
Archived
```

Features:

* Album List
* Upload Photos
* Reorder Photos
* Cover Image

---

# Documents

Route:

```txt
/dashboard/documents
```

Workflow:

```txt
Draft
Published
Archived
```

Features:

* Upload PDF
* Manage Metadata
* Search
* Category Filter

---

# Organization

Route:

```txt
/dashboard/organization
```

Modules:

## Periods

```txt
Create

Archive

Activate
```

---

## Positions

```txt
Create

Edit

Sort
```

---

## Board Members

Fields:

```txt
Name

Photo

Bio

Instagram
```

---

# Taxonomy

Route:

```txt
/dashboard/taxonomy
```

Modules:

## Article Categories

```txt
Create
Edit
Archive
```

---

## Article Tags

```txt
Create
Edit
Archive
```

---

## Document Categories

```txt
Create
Edit
Archive
```

---

# Users

Route:

```txt
/dashboard/users
```

Modules:

## Cabang Admins

Fixed Accounts:

```txt
Ketua Cabang

Kepala Media
```

Actions:

```txt
Invite

Force Reset Password
```

---

## Commissariat Accounts

Actions:

```txt
Create Account

Invite Link

Force Reset Password

Archive Account
```

---

# Notifications

Route:

```txt
/dashboard/notifications
```

Features:

* Notification List
* Mark As Read

Sources:

```txt
Article Review

Agenda Review

Profile Review

Cadre Verification
```

---

# Audit Logs

Route:

```txt
/dashboard/audit-logs
```

Filters:

* User
* Entity
* Action
* Date Range

Fields:

```txt
Actor

Action

Entity

IP Address

Browser

Device

Timestamp
```

---

# Settings

Route:

```txt
/dashboard/settings
```

Modules:

## General

Fields:

```txt
Site Name

Logo

Favicon
```

---

## SEO

Fields:

```txt
SEO Title

SEO Description
```

---

## Contact

Fields:

```txt
Address

Instagram

Email
```

---

# ADMIN_KOMISARIAT

```txt
/dashboard
│
├── overview
│
├── articles
│   ├── /
│   ├── create
│   ├── [id]
│   └── [id]/edit
│
├── agendas
│   ├── /
│   ├── create
│   ├── [id]
│   └── [id]/edit
│
├── profile
│
├── cadre-verification
│
├── notifications
│
└── account
```

---

# Komisariat Dashboard

Widgets:

* Artikel Saya
* Status Artikel
* Agenda Saya
* Status Agenda
* Jumlah Artikel Publish
* Notifikasi Terbaru

---

# Profile

Route:

```txt
/dashboard/profile
```

Editable:

* Logo
* Nama Komisariat
* Tentang
* Kampus
* Foto Sekretariat
* Ketua Umum
* Tentang Ketua
* Jumlah Kader
* Lokasi Maps
* Instagram
* Alamat

Workflow:

```txt
Edit
↓
Submit Review
↓
Approve / Reject / Revision
```

Uses:

```txt
commissariat_profile_submissions
```

---

# Cadre Verification

Route:

```txt
/dashboard/cadre-verification
```

Features:

* Upload Excel
* View Submission Status
* View Review Notes

Workflow:

```txt
Upload
↓
Pending
↓
Verified / Rejected
```

---

# Account

Route:

```txt
/dashboard/account
```

Features:

* Change Password
* View Account Information

```
```
