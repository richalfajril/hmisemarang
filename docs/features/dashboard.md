# Dashboard Overview

## Purpose
Tampilan utama pendaratan pengguna pasca login (`/dashboard/overview`). Pusat informasi yang merangkum *metrics*, performa komisariat, antrean tinjauan, dan statistik seluruh aktivitas.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

## User Flow
1. Pengguna *login*.
2. Dialihkan ke `/dashboard` (otomatis merender `/dashboard/overview`).
3. Pengguna melihat kartu statistik. Admin Cabang melihat rangkuman se-Cabang, Admin Komisariat hanya melihat data statistik komisariatnya.
4. Klik tautan *widget* tertentu (misal: "Lihat Semua Antrean Review") untuk melompat ke halaman spesifik.

## Requirements
* Perbedaan antarmuka drastis antara level akses `Cabang` dan `Komisariat`.
* Harus menempelkan *Leaderboard* publikasi Komisariat (hanya berlaku bagi Admin Cabang).

## Validation Rules
* Tidak ada input pengguna (halaman mode *read-only* data raksasa).

## Permissions
* **CABANG:** Melihat agregat seluruh data, kotak pengingat antrean *Review Center*, dan *Log* Aktivitas.
* **KOMISARIAT:** Melihat kotak penghitung (*draft*, revisi), jumlah artikel yang sudah rilis, dan notifikasi terbaru mereka.

## Workflow
Ambil data agregat agregasi → Kalkulasi paralel → Render *Widget Cards*.

## Data Dependencies
* Semua entitas inti (Artikel, Agenda, Profil, dsb). Fitur ini membaca *endpoints* lintas *features/entities*.

## Notifications
* (Menampilkan lonceng dan bilah notifikasi mini).

## Audit Logs
* (Widget "Recent Activity" membaca entitas *Audit Log*).

## Edge Cases
* *Loading spinner* lambat. Hal ini dimitigasi dengan menjadikan tiap blok *widget* berjalan asinkron dan mandiri (*Suspense boundaries*) sehingga bagian lain dasbor tetap muncul tanpa harus saling menunggu.

## UI Behavior
* Dasbor bergaya modular. Terdiri atas kartu (`Card`), grafik bar (jika memungkinkan), tabel riwayat ringkas, dan *quick action buttons* (*Buat Artikel*, *Buat Agenda*).
* Elemen sapaan khusus berdasarkan nama yang terotentikasi.

## Acceptance Criteria
* Hitungan statistik (*Draft Counter*, dll.) harus secara tepat mencerminkan angka pasti dari basis data (tidak menyimpang).
* *Leaderboard* komisariat terurut benar dari angka publikasi terbanyak hingga ke terkecil.
