# Gallery Management

## Purpose
Fungsi manajemen aset visual untuk membuat daftar album dan menambahkan dokumentasi foto kegiatan HMI Cabang Semarang, yang nantinya ditayangkan ke publik.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Pengguna masuk ke `/dashboard/galleries`.
2. Klik "Buat Album Baru", isi nama dan deskripsi, lalu simpan draf.
3. Masuk ke halaman detail album, unggah banyak foto ke album tersebut.
4. Tentukan urutan (*Sort Order*) dan jadikan salah satu foto sebagai `Cover Image`.
5. Ubah status album menjadi `PUBLISHED`.

## Requirements
* Koleksi gambar berelasi *one-to-many* antara entitas `gallery_albums` dan `gallery_photos`.
* Fitur pengurutan visual dengan metode tarik-lepas (*drag-and-drop*) jika memungkinkan, atau sekadar input urutan numerik.
* Menampilkan *Cover Image* sebagai perwakilan visual album.

## Validation Rules
* **Format:** Menerima `JPG`, `PNG`, dan di-otomatisasi pengoptimalannya ke `WebP`.
* **Ukuran:** Maksimal 5MB per gambar.

## Permissions
* Eksklusif hanya untuk tingkat **Cabang**.
* `ADMIN_KOMISARIAT` tidak bisa membuat galeri langsung ke *website public* (semua aktivitas foto komisariat tergabung di *Artikel* atau *Agenda*).

## Workflow
Tidak memerlukan *Review Center*.
Album dapat langsung dipindahkan statusnya: `DRAFT` → `PUBLISHED` → `ARCHIVED`.

## Data Dependencies
* `gallery` entity (albums & photos).

## Notifications
* Tidak perlu. Fitur mutasi sepihak tanpa jenjang konfirmasi.

## Audit Logs
Log aktivitas untuk aksi:
* Create Album
* Delete Album
* Upload Photos to Album
* Publish Album

## Edge Cases
* Gambar sampul belum diatur namun pengguna mencoba `Publish`. Sistem mencegah *Publish* dan memunculkan eror validasi.

## UI Behavior
* Tampilan unggah banyak fail (*bulk upload*).
* Menampilkan kisi foto ( *photo grid*) di detail album dengan tombol aksi sekunder di tiap gambar (Hapus, Jadikan Sampul).

## Acceptance Criteria
* Album dengan status `PUBLISHED` sukses terender di `/galeri` publik dengan rapi.
* Gambar dioptimalkan dengan batas *width/height* wajar agar pemuatan halaman (*page load*) tidak memberatkan.
