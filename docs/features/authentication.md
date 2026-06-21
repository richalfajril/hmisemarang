# Authentication

## Purpose
Menangani proses autentikasi pengguna (login, logout) dan pemulihan akses akun (lupa password, reset password) untuk seluruh role dalam sistem.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

## User Flow
1. Pengguna membuka `/login`.
2. Pengguna memasukkan email dan kata sandi.
3. Sistem memvalidasi kredensial via Supabase Auth.
4. Jika berhasil, *middleware* menerbitkan sesi aktif dan me-redirect pengguna ke `/dashboard`.
5. Jika gagal, muncul peringatan UI.

## Requirements
* Otentikasi murni berbasis Email & Password (tanpa OAuth/SSO).
* Hanya mengizinkan *Single Active Session* (login di perangkat baru akan otomatis menonaktifkan sesi lama).
* Mendukung alur *emergency recovery* bagi akun yang kehilangan akses.

## Validation Rules
* **Email:** Format email valid, diwajibkan.
* **Password:** Minimal 6 karakter (batasan bawaan Supabase Auth), diwajibkan.

## Permissions
* Semua role dapat melakukan Login dan Logout.
* Semua role dapat mengganti sandinya sendiri (*Change Own Password*).
* Hanya `SYSTEM_ADMIN` dan `ADMIN_CABANG` yang dapat mengganti email akun mereka sendiri.

## Workflow
1. Request OTP / Magic Link (Opsional, jika difungsikan).
2. Verifikasi Password standar.
3. Pembuatan sesi di *cookies* (Dikelola oleh `@supabase/ssr`).

## Data Dependencies
* `user` entity (disinkronkan dari tabel `auth.users` milik Supabase ke `public.users` jika perlu).

## Notifications
* Tidak memicu notifikasi internal sistem (notifikasi pemulihan dikirim murni via email SMTP).

## Audit Logs
Log aktivitas untuk aksi:
* Login
* Logout
* Failed Login
* Password Reset

## Edge Cases
* Pengguna mencoba login dengan email yang salah berulang kali (Supabase Rate Limiting akan menangani ini).
* *Session timeout* saat pengguna sedang mengisi formulir panjang. (UI harus memunculkan dialog login *inline* atau menyimpan draf sebelum *redirect*).

## UI Behavior
* Tampilan login minimalis terpusat tanpa distraksi.
* Menggunakan *loading spinner* pada tombol login saat verifikasi API berjalan.
* Pesan kegagalan *inline* merah (bukan *alert box* besar).

## Acceptance Criteria
* Pengguna yang berhasil login langsung dialihkan ke rute `/dashboard`.
* Sesi klien dapat dipertahankan melintasi *refresh* berkat *middleware*.
* Data log untuk aksi `Failed Login` tercatat sempurna di modul Audit Log.
