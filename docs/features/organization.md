# Organization Management

## Purpose
Modul sentral untuk membangun dan memelihara struktur historis organisasi. Modul ini memungkinkan pengurus mengarsipkan kepengurusan periode lalu dan menampilkan periode aktif (Struktur Jabatan dan Susunan Pengurus).

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Pengguna masuk ke `/dashboard/organization/periods`.
2. Klik "Tambah Periode Baru" (misal: "Periode 2024-2025").
3. Masuk ke halaman Posisi, susun jabatannya secara berurutan (*Sort Order*).
4. Masuk ke halaman Susunan Pengurus, lampirkan anggota ke posisinya masing-masing dengan biografi serta foto profil.

## Requirements
* Harus mencakup entitas hierarkis terpadu: `periods` → `positions` → `board_members`.
* Publik dapat membuka riwayat kepengurusan lawas via pilihan/sektor jatuh-turun (*dropdown period*).
* Posisi memiliki atribut `layout_type` untuk memudahkan rendering di web publik (misalnya beda susunan antara baris Ketua Umum vs jajaran departemen).

## Validation Rules
* **Period Year:** Angka numerik. `end_year` harus lebih besar atau sama dengan `start_year`.
* **Photo Board Member:** Rasio 1:1, tidak wajib (bisa kosong/avatar abu-abu).

## Permissions
* Secara eksklusif dimutasi oleh pengurus **Cabang**. Tidak ada *draft* atau persetujuan.

## Workflow
Buat Period → Susun Positions → Isi Board Members.
Peralihan: Set sebuah periode sebagai "Non-Aktif" dan ciptakan periode baru. (Hanya satu periode yang berstatus `is_active` pada satu waktu).

## Data Dependencies
* `organization` entity (Period, Position, Board Member).

## Notifications
* Tidak perlu.

## Audit Logs
Log aktivitas untuk aksi:
* Create Period
* Edit Period (Activate/Deactivate)
* Add Position
* Add Board Member
* Remove Board Member

## Edge Cases
* Saat sebuah periode sedang aktif, pengguna lain mencoba mengaktifkan periode lawas. Sistem memunculkan dialog peringatan: "Mengaktifkan periode ini akan menonaktifkan periode 2024-2025 secara otomatis."

## UI Behavior
* Formulir dinamis dan daftar posisi yang dapat di-*drag and drop* (*future plan*, saat ini *sort number*).
* Daftar anggota pengurus berbentuk kartu ringkas mirip *Grid Layout*.

## Acceptance Criteria
* Halaman Struktur Pengurus Publik `/struktur` hanya me-render satu periode yang `is_active=true` sebagai baku.
* Semua mutasi tidak berdampak pada terputusnya integritas data historis.
