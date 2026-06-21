# Taxonomy Management

## Purpose
Mengatur pengklasifikasian data secara struktural untuk mempermudah pencarian dan pengelompokan. Modul ini mengendalikan Kategori Artikel, Tag Artikel, dan Kategori Dokumen.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Pengguna masuk ke `/dashboard/taxonomy/article-categories`.
2. Klik tombol "Tambah Kategori Baru".
3. Masukkan nama kategori (misal: "Opini"). Kolom URL *Slug* (`opini`) terbentuk otomatis.
4. Simpan. Kategori langsung tersedia di dalam form *Dropdown* saat Penulis membuat artikel.

## Requirements
* Setiap jenis taksonomi dipisahkan ke dalam tabel basis datanya masing-masing (`article_categories`, `tags`, `document_categories`).
* Artikel dan Dokumen tidak bisa dibuat tanpa memilih kategori.
* Penghapusan taksonomi dikendalikan menggunakan batasan *is_active* (*soft toggle*).

## Validation Rules
* **Name:** Wajib, unik di dalam tabel taksonominya. Maksimal 50 karakter.
* **Slug:** Otomatis dihasilkan dari nama, tak boleh mengandung spasi atau karakter spesial di luar tanda hubung (`-`).

## Permissions
* Eksklusif diakses dan diatur tingkat **Cabang**.
* Admin Komisariat tidak dapat menciptakan Kategori atau Tag kustom secara mandiri.

## Workflow
Create → Edit / Soft Delete. (Tanpa butuh persetujuan).

## Data Dependencies
* `taxonomy` entity.

## Notifications
* Tidak perlu.

## Audit Logs
Log aktivitas untuk aksi:
* Create Taxonomy (Kategori/Tag)
* Edit Taxonomy
* Archive Taxonomy

## Edge Cases
* Mencegah duplikasi nama kategori dengan *case-insensitive validation* (misal "Berita" dan "berita" dianggap sama dan tidak lolos cek unik).
* Menonaktifkan kategori tidak berdampak pada artikel/dokumen yang sudah terbit menggunakan kategori tersebut (tetap terender, namun di *form* CMS baru kategori ini hilang dari opsi pemilihan).

## UI Behavior
* Tampilan senarai sangat minimalis. Biasanya dikelompokkan di dalam tiga tab: `Article Categories`, `Tags`, dan `Document Categories`.
* Formulir penyuntingan dapat dibuat berbentuk *Inline Edit* atau via *Dialog/Modal* ringan.

## Acceptance Criteria
* Data kategori yang baru dibuat langsung dapat dimuat ulang dan dipasangkan ke entitas artikel secara *real-time*.
