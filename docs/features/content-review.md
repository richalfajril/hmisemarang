# Content Review Workflow

## Purpose
Jantung pengawasan kualitas dalam CMS ini. Fitur sentral ini mengatur proses Peninjauan (*Review*), Penolakan (*Reject*), dan Persetujuan (*Approve*) secara *polimorfik* untuk pelbagai entitas berbeda (Artikel, Agenda, Profil Komisariat, Verifikasi Kader).

## User Roles
* ADMIN_CABANG
* SYSTEM_ADMIN

## User Flow
1. Admin Cabang masuk ke `/dashboard/review-center`.
2. UI merender empat buah *Tab* terpisah yang menampung tumpukan status `SUBMITTED`/`PENDING`.
3. Membuka salah satu Artikel (pratinjau artikel yang sedang dibedah).
4. Klik tombol aksi penyetujuan:
   a. **Approve**: Artikel melompat status ke `PUBLISHED`. Notifikasi dikirimkan. Selesai.
   b. **Request Revision**: Sistem akan meminta Admin Cabang mengisi alasan (misal "Perbaiki Ejaan"). Notifikasi dikirim. Status melompat ke `REVISION`.
5. Tindakan *Review* ini memutasi catatan historis internal (`review_histories`) kepunyaan *content-review*.

## Requirements
* DRY (*Don't Repeat Yourself*): Dilarang merancang tombol *Approve* fungsional empat kali berulang di entitas Artikel, Profil, Kader, dan Agenda. Semuanya disedot oleh *feature* ini.
* `Review History` kehilangan status entitas independennya dan kini 100% dipasung sebagai data tanggungan internal (dimiliki) *feature* `content-review`.

## Validation Rules
* **Catatan/Note:** Opsional bagi *Approve*, tetapi mutlak diwajibkan untuk aksi *Reject* dan *Revision Requested*. Panjang minimal 10 karakter.

## Permissions
* Secara spesifik dieksekusi secara ketat oleh barisan **Cabang**.
* Admin Komisariat tidak dapat menyetujui dokumen dari komisarit miliknya sendiri (Pencegahan penipuan).

## Workflow
Eksekusi dari tombol sentral. Pola yang tercipta: (Status Entitas Induk Berubah) + (Data Historis Review Diciptakan) + (Notifikasi Sistem Ditembakkan) secara *Atomic Transaction* lewat peladen Prisma.

## Data Dependencies
* `article`, `agenda`, `commissariat` (Profile Submissions), `cadre-verification` entities (Target Otorisasi).
* `notification` (Kanal Output).

## Notifications
* Fitur inilah yang menjadi sang pengutus lonceng utama. Pemicu paling banyak berasal dari *Server Actions* miliknya.

## Audit Logs
Log aktivitas untuk aksi:
* Approve Content
* Reject Content
* Request Revision Content

## Edge Cases
* *Race condition*: Dua Admin Cabang secara serentak mengklik tombol *Approve* atas artikel yang sama. Harus dicegah via penjagaan *versioning* atau *transaction lock* agar tidak tercipta notifikasi rilis kembar.

## UI Behavior
* Tampilan dasbor antrean mirip dengan Kanban asimetris.
* Tombol *Approve* (Hijau), *Reject* (Merah Tua), *Revision* (Kuning/Jingga).
* Pratinjau artikel atau profil disajikan murni bersifat *Read-Only* bersebelahan (*split screen*) dengan bilah aksi kontrol.

## Acceptance Criteria
* Penyetujuan sukses merangkum entitas silang dan secara tepat membungkusnya dalam prisma `$transaction`.
* Riwayat hasil tinjauan tampil di mata Admin Komisariat sehingga mereka mampu membenahi formulir kesalahannya.
