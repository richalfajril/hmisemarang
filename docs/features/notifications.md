# Notification Management

## Purpose
Mendistribusikan pesan sistem dan pembaruan alur persetujuan ke tiap pengguna guna memastikan transparansi operasional, serta memastikan tidak ada pengajuan artikel atau agenda yang terbengkalai tanpa ditinjau.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

## User Flow
1. Administrator menerima pemberitahuan visual (titik merah pada ikon lonceng *header*).
2. Klik ikon untuk melihat senarai *dropdown* notifikasi terbaru.
3. Klik "Tandai Semua Dibaca" atau klik item tertentu untuk membaca detailnya dan diarahkan ke tautan lampiran.
4. Untuk daftar lengkap, buka `/dashboard/notifications`.

## Requirements
* Disampaikan khusus di dalam antarmuka aplikasi (*In-App Only*). Tidak terhubung ke WhatsApp/Email di MVP ini.
* Sistem ini bersimbiosis ketat dengan modul alur penyetujuan konten (*content-review*).
* Harus mendukung fitur komputasi *Mark As Read*.

## Validation Rules
* **Title:** Tidak bisa diisi pengguna, *System Generated*.
* **Message:** Deskripsi jelas tentang apa yang terjadi (misal: "Artikel 'Reformasi' Anda disetujui").
* **Link URL:** Diwajibkan untuk mengalihkan pengguna ke asal pemicu (contoh ke `/dashboard/articles/123`).

## Permissions
* Pengguna hanya bisa melihat notifikasi yang kolom `user_id` miliknya (Strict Isolation).
* (Untuk efisiensi, notifikasi "Menunggu Review" mungkin tidak diikat ke *user_id* tunggal Cabang, melainkan dirender global untuk seluruh partisipan berseragam `ADMIN_CABANG` jika arsitekturnya difasilitasi, namun dalam `DATABASE_SCHEMA` saat ini masih menggunakan `user_id`).

## Workflow
Server Action memicu status baru → Menyuntik rekaman ke tabel `notifications` secara sinkronus bersama status → Klien menyegarkan tampilan lonceng.

## Data Dependencies
* `notification` entity.

## Notifications
* (Dirinya sendiri).

## Audit Logs
* Log tidak mencatat kapan pengguna "Membaca" notifikasi (demi pencegahan *bloating* tabel log).

## Edge Cases
* Seorang Admin Komisariat memiliki ratusan notifikasi tak dibaca. Sistem paginasi TanStack Query sangat diandalkan di sini. Cukup hitung (`COUNT`) maksimal "99+" di UI ikon lonceng.

## UI Behavior
* Teks judul ditebalkan jika `is_read == false`.
* Lonceng notifikasi menggunakan mode indikator titik merah, dan laci geser atau senarai tumpuk (*Popover/Drawer*).
* Aksi memudarkan diri dengan teknik *Optimistic Updates* seketika pengguna mengkliknya (tak menunggu balasan peladen).

## Acceptance Criteria
* Membuka notifikasi langsung memanggil Server Action penanda `is_read = true` secara transparan.
* Tautan URL di notifikasi secara presisi melompat ke halaman target sasaran.
