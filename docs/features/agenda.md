# Agenda Management

## Purpose
Menangani publikasi jadwal kegiatan, tautan pendaftaran, dan pengelolaan agenda aktivitas HMI Cabang Semarang maupun Komisariat.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

## User Flow
1. Pengguna membuka `/dashboard/agendas`.
2. Klik "Buat Agenda".
3. Unggah *Flyer* (4:5), isi tanggal/waktu, lokasi, dan deskripsi acara.
4. (Opsional) Tambahkan tautan pendaftaran/CTA (Misal: "Daftar Sekarang" -> *Google Form*).
5. Simpan sebagai draf atau ajukan *review*.

## Requirements
* Setiap agenda harus memiliki batas waktu tayang (Waktu mulai).
* Status agenda (Akan Datang, Berlangsung, Selesai) harus dihitung secara dinamis di klien, *bukan* disimpan statis di *database*.
* Menggunakan fitur *Soft Delete*.

## Validation Rules
* **Title:** Wajib.
* **Start Date/Time:** Wajib. Format penanggalan yang valid.
* **End Date/Time:** Opsional, namun jika ada, harus > `Start Date/Time`.
* **Flyer:** Rasio 4:5, optimal untuk Instagram.
* **CTA Links:** Jika disertakan, URL wajib berformat URL valid (`https://...`).

## Permissions
* `ADMIN_KOMISARIAT` memiliki akses terikat (*scoped*) untuk agenda mereka sendiri. Harus melewati alur *review*.
* `ADMIN_CABANG` dapat melakukan *Direct Publish* untuk Agenda tingkat Cabang.

## Workflow
Mirip dengan Artikel:
`Draft` → `Submitted` → `Revision` → `Approved` → `Published`

## Data Dependencies
* `agenda` entity.

## Notifications
* (Lihat fitur `content-review`).

## Audit Logs
Log aktivitas untuk aksi:
* Create Agenda
* Edit Agenda
* Soft Delete Agenda
* Restore Agenda

## Edge Cases
* Tanggal *End Date* mendahului *Start Date* (UI harus memblokir *input* secara *real-time* dengan Zod).
* Banyak Agenda diselenggarakan di hari yang sama (UI di *Website Publik* harus mengurutkan berdasarkan jam mulai).

## UI Behavior
* *Date and Time Picker* yang mulus dan intuitif.
* Tabel agenda harus dengan cepat bisa difilter untuk menemukan jadwal yang akan datang vs jadwal yang sudah berlalu.

## Acceptance Criteria
* Daftar agenda tampil sempurna di `/agenda` pada web publik dengan urutan jadwal terdekat.
* Logika komputasi status "Selesai" jika hari ini > `end_datetime` bekerja mulus tanpa skrip *cron job*.
