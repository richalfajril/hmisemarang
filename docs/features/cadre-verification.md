# Cadre Verification Management

## Purpose
Modul ini digunakan oleh komisariat untuk melaporkan jumlah data kader terbaru melalui unggahan berkas *Excel*, yang mana jumlah kader tervalidasi tersebut akan ditampilkan secara publik.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

## User Flow
1. Pengguna membuka `/dashboard/cadre-verification`.
2. Klik tombol "Unggah Berkas Kader".
3. Mengunggah *file Excel* (mengandung kolom-kolom standar verifikasi).
4. Data berstatus `PENDING`.
5. Admin Cabang melakukan *review* di *Review Center*.
6. Jika disetujui, kolom `row_count` divalidasi dan jumlah profil kader komisariat diperbarui.

## Requirements
* Setiap entitas `cadre_verifications` wajib merekam rekam jejak `commissariat_id`, lokasi berkas di *Cloudinary*, dan status peninjauan.
* Hanya satu berkas verifikasi aktif (status `PENDING` atau `APPROVED`) yang diizinkan per periode.
* URL berkas disimpan di keranjang tertutup (*secure-verifications* di Cloudinary menggunakan tipe *private*/*authenticated*), BUKAN di folder publik.

## Validation Rules
* **Upload:** Format hanya menerima ekstensi Microsoft Excel (`.xlsx` atau `.xls`).
* **Ukuran Berkas:** Maksimal 10MB.

## Permissions
* `ADMIN_KOMISARIAT` hanya bisa mengunggah dan memantau status untuk komisariatnya sendiri. Sama sekali dilarang melihat berkas komisarit lain.
* `ADMIN_CABANG` dapat mengunduh seluruh berkas komisariat mana pun, lalu mengeksekusi proses Approve/Reject.

## Workflow
Upload → `PENDING` → Ditinjau (`VERIFIED` atau `REJECTED`).

## Data Dependencies
* `cadre-verification` entity.
* `commissariat` entity.

## Notifications
* (Lihat fitur `content-review`).

## Audit Logs
Log aktivitas untuk aksi:
* Upload Verification File
* Approve / Reject Verification (Dilakukan oleh fitur `content-review`).

## Edge Cases
* Dua orang dari satu komisariat mencoba mengunggah *file* bersamaan. Sistem harus menolak *submission* kedua jika ada yang masih `PENDING`.

## UI Behavior
* UI menyerupai riwayat antrean atau sistem tiket pelaporan.
* Ada indikator visual besar mengenai kapan terakhir kali komisariat berhasil memverifikasi datanya.

## Acceptance Criteria
* Publik (Website Utama) hanya bisa melihat angka jumlah kader, sementara *file Excel*-nya bersifat rahasia di dalam CMS.
* Fitur *download file* menggunakan *Signed URL* dari Supabase *Service Role*.
