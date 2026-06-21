# Audit Log Viewer

## Purpose
Berfungsi sebagai instrumen pengawasan (*observability*) atas seluruh tindakan vital (Pembuatan, Pengubahan, Penghapusan) pada setiap entitas di dalam CMS, termasuk menyimpan bukti rekaman alamat IP, peramban klien, serta aktor penanggungjawabnya.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Masuk ke halaman `/dashboard/audit-logs`.
2. Menyaksikan riwayat tabular jejak peristiwa dengan urutan terbaru teratas.
3. Melakukan *filtering* ganda: Berdasarkan Siapa (User), dan Tentang Apa (Entity).
4. Bisa memilih opsi untuk mengekspor (mengunduh) rangkuman ke bentuk *.csv* atau semacamnya (Jika ada di MVP kelak).

## Requirements
* Entitas Audit Log murni `append-only` (tidak boleh disunting atau dihapus oleh siapapun melalui *dashboard* antarmuka).
* Menggabungkan *Payload Old Data* dan *New Data* sebagai cadangan *forensic* saat artikel berharga tanpa sengaja terubah.

## Validation Rules
* Mode pembacaan pasif (Tanpa Form Validasi).

## Permissions
* Super eksklusif bagi Cabang. Admin Komisariat sama sekali buta terhadap tabel ini untuk melindungi privasi navigasi entitas lain.

## Workflow
Sistem pemicu Server Action (mis. *createArticleAction*) → Eksekusi fungsi perekaman → Log tersimpan. (Pola transparan dari ujung pengguna).

## Data Dependencies
* `audit-log` observability entity.

## Notifications
* Tanpa integrasi notifikasi (Sistem pasif).

## Audit Logs
* Log tidak mencatat bahwa dirinya sendiri sedang dilihat (*viewer actions are not logged*) guna menghindari *infinite loop* penumpukan rekaman omong kosong.

## Edge Cases
* Kapasitas tabel yang meledak setelah bertahun-tahun. Aplikasi hanya mengunduh porsi data terkini lewat Prisma paginasi (*offset-based* atau *cursor-based*) agar CMS tidak kelaparan memori (*OOM*).

## UI Behavior
* Tampilan tabel yang kaku dan lugas.
* Menampilkan *IP Address* dan Tipe Tindakan (Warna khusus merah untuk DELETED, hijau untuk CREATED).

## Acceptance Criteria
* Segala perubahan status `content-review` wajib direpresentasikan dengan akurat pada tabel log ini.
* Halaman ini hanya melayani tindakan pembacaan (*Read Operations* via TanStack Query Server).
