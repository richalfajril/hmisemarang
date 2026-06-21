# User Management

## Purpose
Pusat kontrol atas pemberian akses, pencabutan otoritas, serta pelacakan jejak partisipan yang bertanggungjawab atas operasional harian di dalam ekosistem HMI Semarang.

## User Roles
* SYSTEM_ADMIN
* ADMIN_CABANG

## User Flow
1. Masuk `/dashboard/users`. (Tab khusus: *Cabang Admins* dan *Commissariat Accounts*).
2. Klik "Undang Pengguna" atau buat akun untuk spesifik fungsionaris.
3. Sistem mengeluarkan *Invite Link* rahasia, atau memproses *Force Reset Password* bagi pengurus tingkat komisariat yang kehilangan jejak masuk akunnya.
4. (Opsional) Mengarsip pengguna yang telah lengser.

## Requirements
* Setiap entri akun komisariat dikunci kuat secara fungsional terhadap satu baris entitas komposit `commissariats`. (1 Akun = 1 Komisariat).
* Akun sifatnya fungsional institusi (bukan hak milik individu perseorangan pengurus).

## Validation Rules
* **Email:** Unik lintas tabel otentikasi.
* **Role Assignment:** Ketat, tak sembarang orang bisa disematkan status `SYSTEM_ADMIN`.

## Permissions
* `ADMIN_KOMISARIAT` mutlak buta (*No Access*) terhadap instrumen manajemen akun ini. Hanya bisa menyunting kata sandi pribadinya di rute `/account` yang terisolir.

## Workflow
Penciptaan Akun Baru → Pengiriman Tautan OTP/Sandi Sementara → Beroperasi secara Normal → Dihentikan / Diarsip pasca purna tugas (Regenerasi Sandi untuk periode baru).

## Data Dependencies
* `user` entity.
* `commissariat` entity.

## Notifications
* Tidak perlu.

## Audit Logs
Log aktivitas untuk aksi:
* Create User / Sent Invite
* Force Reset Password (Kritikal, harus direkam).
* Archive User
* Role Update

## Edge Cases
* Administrator berusaha mereset atau mengarsipkan akun milik pribadinya sendiri (Harus diblokir melalui *Validation Action* pada saat menekan tombol eksekusi).

## UI Behavior
* Diperlengkapi indikator *Badge* status peran berwarna solid (*Solid Colors*). Misal: Biru bagi `ADMIN_CABANG`.
* Fitur Aksi disembunyikan dalam wujud elipsis ujung baris *table*.

## Acceptance Criteria
* `SYSTEM_ADMIN` berhasil menginisiasi pemulihan paksa (*force reset*) bagi komisariat yang lumpuh aksesnya.
* Keamanan terjamin di mana hanya tingkat Cabang yang mampu mengatur pembuatan akun baru.
