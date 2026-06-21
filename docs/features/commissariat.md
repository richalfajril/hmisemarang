# Commissariat Profile Management

## Purpose
Mengatur informasi profil, kontak, alamat sekretariat, detail ketua umum, hingga logo untuk setiap komisariat agar terekam sebagai arsip dan dapat diakses dari direktori publik.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

## User Flow
1. Pengurus tingkat Komisariat login, masuk ke rute `/dashboard/profile`.
2. Mereka tidak mengubah profil langsung, melainkan menyunting *form submission*.
3. Klik "Submit Review" setelah selesai mengedit formulir (*Logo, Instagram, Ketua Umum, dll.*).
4. `ADMIN_CABANG` me-review ajuan. Jika di-*Approve*, data di dalam tabel *submissions* akan disalin ke profil asli komisariat.

## Requirements
* Harus mengadopsi arsitektur dua entitas: Profil asli yang tayang (`commissariats`) dan draf ajuan (`commissariat_profile_submissions`).
* Pengguna tidak bisa mengajukan revisi baru jika ajuan sebelumnya masih berstatus `SUBMITTED` atau menunggu peninjauan.

## Validation Rules
* **Logo:** Rasio 1:1.
* **Jumlah Kader:** Angka numerik murni.
* **Instagram/Maps:** Harus format URL atau dibatasi validasi URL agar tidak diinjeksi teks bebas.

## Permissions
* `ADMIN_KOMISARIAT` HANYA bisa memutasi entitas `profile_submissions`.
* `SYSTEM_ADMIN` dan `ADMIN_CABANG` memiliki akses ke `commissariats` asli untuk memaksakan perubahan tanpa *review* jika keadaan darurat.

## Workflow
Draft Edit → `SUBMITTED` → (Tunggu Review) → `APPROVED`. 
Setelah `APPROVED`, data `profile_submissions` menimpa record di `commissariats`.

## Data Dependencies
* `commissariat` entity.
* `profile-submission` entity.

## Notifications
* (Lihat fitur `content-review`).

## Audit Logs
Log aktivitas untuk aksi:
* Edit Profile Submission
* Approve Profile (Dilakukan oleh fitur `content-review`, namun mencatat nama entitas profil).

## Edge Cases
* `ADMIN_KOMISARIAT` menyunting kolom yang wajib (*required*) lalu mengosongkannya. Form harus menolak perubahan sebelum disubmit.
* Profil tidak boleh di-*Soft Delete* jika masih ada artikel terpublikasi atas nama komisariat tersebut.

## UI Behavior
* Tampilan formulir panjang yang dibagi ke dalam tab/akordion (*Branding*, *Kontak*, *Informasi Ketua Umum*).
* Status "Sedang Menunggu Tinjauan" harus menonaktifkan seluruh tombol *submit* agar tidak *spamming*.

## Acceptance Criteria
* Data yang diajukan oleh komisariat TIDAK merubah tampilan Web Publik sampai `ADMIN_CABANG` menyetujuinya.
* Halaman profil publik komisariat (`/komisariat/[slug]`) merender data termutakhir yang berstatus rilis.
