# Website Settings Management

## Purpose
Mengonfigurasi dan menyimpan properti global tunggal (sistem *singleton*) yang merepresentasikan wujud merek HMI Semarang di *Public Website*. Mencakup pengaturan logo, parameter pencarian SEO, daftar kontak, dan narasi pita paling bawah (*footer*).

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Masuk `/dashboard/settings`.
2. Halaman memuat sebuah formulir raksasa dengan isian (*Site Name*, *SEO Meta*, *Instagram Link*, *Alamat*).
3. Pengguna mengubah data dan menekan tombol "Simpan Perubahan".
4. *Header* depan *Website Public* langsung tersinkronisasi.

## Requirements
* Berbasis entitas rekaman tunggal (*singleton record*).
* Mampu mendukung tautan media sosial kosong (jika dikosongkan, di *Public Web* ikon sosial medianya hilang otomatis).

## Validation Rules
* **Email:** Wajib berformat *email* jika diisi.
* **URLs:** Wajib berformat tautan.

## Permissions
* Akses mutlak milik Cabang. Admin Komisariat hanya sebagai penikmat *Frontend*.

## Workflow
Fetch pengaturan satu-satunya → Sunting → Update (tanpa *Review Workflow*).

## Data Dependencies
* `website-settings` entity.

## Notifications
* Tidak perlu.

## Audit Logs
Log aktivitas untuk aksi:
* Update Website Settings

## Edge Cases
* Gambar logo belum diunggah. Tampilan web publik harus menyiapkan teks bawaan (*Site Name*) sebagai kompensasi logo yang hilang.

## UI Behavior
* Tampilan formulir panel berlapis (*General*, *SEO*, *Contact*) dengan pembagian tab akordion.
* Ada batasan *loading spinner* pada form sewaktu menyimpan.

## Acceptance Criteria
* Meta *tags* HTML (SEO) di Web Publik (`<title>`, `<meta name="description">`) murni diekstrak dari tabel ini melalui rute Next.js `layout.tsx`.
