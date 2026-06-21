# Global Search

## Purpose
Memberikan fasilitas telusur secepat kilat (*omnibox*) kepada pengurus Cabang untuk mencungkil informasi apa pun (Dokumen, Profil Komisariat, Artikel) tanpa perlu menelusuri hierarki menu yang panjang.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Pengguna memencet kombinasi pintasan kursor (Misal `Ctrl+K` atau `Cmd+K`) atau menekan bilah Pencarian di atas navigasi (*header*).
2. UI Dialog (*Command Menu*) membentang.
3. Mengetik frasa target.
4. *Debounce* input (misal: 300ms) untuk mencegah bombardir *request* ke peladen.
5. Menampilkan hasil di bawahnya dalam kategori bersegmen (Artikel vs Dokumen vs Komisariat).
6. Menekan/Klik rute membawa ke laman target.

## Requirements
* Harus diimplementasikan menggunakan arsitektur pencarian global *Command Palette*.
* Integrasi multi-entitas dari ujung peladen.

## Validation Rules
* Validasi pembersihan teks (*Sanitization*).

## Permissions
* *Search scope* harus disesuaikan dengan tingkat akses. Jika difasilitaskan kelak untuk `ADMIN_KOMISARIAT`, ia hanya bisa menelusuri aset komisariatnya. (Pada PRD, Global Search diarahkan untuk Cabang di Dashboard-nya).

## Workflow
Pencarian Langsung (Tanpa Persetujuan).

## Data Dependencies
* `article`, `agenda`, `document`, `commissariat` entities.

## Notifications
* Nihil.

## Audit Logs
* Nihil.

## Edge Cases
* Input pencarian terlalu cepat (*race condition* API). Mitigasi lewat pembatalan *fetch request* terdahulu atau sistem pancingan TanStack Query.
* Teks yang disuntik dengan kueri berbahaya (Misal injeksi SQL yang lazim pada aplikasi rapuh, meski Prisma sudah mencegahnya).

## UI Behavior
* Modus melayang (*Dialog Modal*) dengan efek pengaburan latar belakang (*backdrop blur*).
* Fokus kotak input (*auto-focus*) mutlak aktif seketika antarmuka melayang ini terbuka.

## Acceptance Criteria
* Minimal, pencarian bisa menggali barisan judul artikel dan nama komisariat dengan tepat.
