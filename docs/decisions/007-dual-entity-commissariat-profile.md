# Arsitektur Dua-Entitas untuk Pembaruan Profil Komisariat

## Context
Setiap komisariat wajib memiliki wujud profil tayang yang memetakan identitas mereka (Ketua, Kontak, Tautan Sosmed) di Web Publik.

## Problem
Admin Komisariat diberikan wewenang untuk menyunting profilnya mandiri, namun setiap gubahan tersebut diwajibkan melewati jalur peninjauan (Cabang harus memberikan ulasan terlebih dahulu). Jika mereka mengedit dari tabel asli langsung (`commissariats`), laman Publik dapat tertaut profil anarkis sebelum ada persetujuan.

## Decision
Profil organisasi tidak diletakkan pada tabel tunggal, melainkan diformulasikan ke dalam rancangan Dual-Entity:
1. `commissariats`: Sisi yang bersih dan telah rilis, hanya merender data ke Web Publik.
2. `commissariat_profile_submissions`: Wadah draf modifikasi Admin Komisariat.
Ketika Cabang menekan pelatuk `Approve` pada formulir draf, fungsi transaksi Prisma mentransfer salinan tervalidasi ini dan menimpa *record* ke tabel pertama.

## Consequences
Kapasitas dan beban penyimpanan berlipat untuk merekam satu subjek yang sama (berkali-kali mereplikasi entri teks JSON). Sangat efektif mengunci stabilitas *frontend* dari kegaduhan administrasi *backend*.

## Related Documents
* `DATABASE_SCHEMA.md`
* `features/commissariat.md`
