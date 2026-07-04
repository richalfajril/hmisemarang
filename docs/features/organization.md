# Organization Management

## Purpose
Modul sentral untuk membangun dan memelihara struktur historis organisasi. Modul ini memungkinkan pengurus mengarsipkan kepengurusan periode lalu dan menampilkan periode aktif (Struktur Jabatan dan Susunan Pengurus).

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Pengguna masuk ke `/dashboard/organization/periods` (Riwayat Kepengurusan).
2. Klik **Tambah Periode** → modal: isi tahun periode + multi tambah daftar jabatan; tiap jabatan dipilih **grup layout** (KSB / Ketua Bidang / Lainnya). Tombol **Batal** & **Simpan & Susun Pengurus**.
3. Klik "Simpan & Susun Pengurus" → otomatis diarahkan ke halaman **Susunan Kepengurusan** (detail periode).
4. Di halaman detail klik **Tambah Pengurus** → modal: foto (rasio 1:1, wajib), nama (wajib), jabatan (combobox, wajib), kampus (combobox, wajib), komisariat (combobox, wajib), media sosial (multi, default 1 Instagram, opsional), bio singkat (≤200 char, opsional).
5. Pengurus tampil sebagai **kartu** di grid. Kartu depan: foto, nama (hijau, lebih besar), jabatan, ikon sosmed. Klik kartu → **flip** → belakang: bio, kampus, komisariat. Di dashboard kartu punya tombol **Edit/Hapus** (di publik tidak).
6. Section **Kelola Jabatan** di halaman detail untuk tambah/rename/hapus jabatan & ubah grup setelah periode dibuat.

## Public Layout
* **KSB**: baris (Sekretaris | Ketua | Bendahara), Ketua di tengah.
* **Ketua Bidang**: grid kartu, terbaru kiri-atas (urut `created_at` desc).
* **Lainnya**: grid kartu.
* Jarak antar-section dibuat rapat.

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
* Import Board Members (Excel, per periode)

## Impor Pengurus (Excel)
* Tombol "Impor Pengurus (Excel)" di halaman detail periode. Target = periode tersebut (tanpa kolom periode).
* Kolom: `Foto_URL`, `Nama_Lengkap` (wajib), `Jabatan` (wajib), `Asal_Komisariat`, `Asal_Kampus`, `Bio`, `URL_Instagram`, `URL_TikTok`, `URL_X`, `URL_Linkedin`.
* Jabatan baru → Position auto-dibuat (`layout_type: LAINNYA`). Kampus/Komisariat dicocokkan case-insensitive ke master; tidak cocok → kosong. Duplikat (nama + jabatan) di periode → dilewati. Foto via URL. `URL_X` → platform `twitter`.

## Edge Cases
* Saat sebuah periode sedang aktif, pengguna lain mencoba mengaktifkan periode lawas. Sistem memunculkan dialog peringatan: "Mengaktifkan periode ini akan menonaktifkan periode 2024-2025 secara otomatis."

## UI Behavior
* Formulir dinamis dan daftar posisi yang dapat di-*drag and drop* (*future plan*, saat ini *sort number*).
* Daftar anggota pengurus berbentuk kartu ringkas mirip *Grid Layout*.

## Acceptance Criteria
* Halaman Struktur Pengurus Publik `/struktur` hanya me-render satu periode yang `is_active=true` sebagai baku.
* Semua mutasi tidak berdampak pada terputusnya integritas data historis.
