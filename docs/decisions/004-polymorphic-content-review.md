# Alur Persetujuan Polimorfik (Polymorphic Content Review Workflow)

## Context
Fitur permohonan persetujuan dan tinjauan tidak eksklusif terjadi pada Modul Artikel saja, melainkan ikut dikenakan pada pengajuan Profil Komisariat, pelaporan Verifikasi Kader, serta rilis Agenda. Semuanya berujung pada otoritas Cabang.

## Problem
Membangun tabel ulasan (*Review Table*) dan logika fungsi secara terpisah (`article_reviews`, `agenda_reviews`, `profile_reviews`) melanggar prinsip *Don't Repeat Yourself* (DRY).

## Decision
Menciptakan satu tabel agnostik `review_histories` dan memusatkan semua antarmuka penyetujuan di dalam sebuah modul super **`content-review`**. Modul ini secara polimorfik me-render tombol *Approve/Reject* berdasarkan Tipe Entitas, melontarkan *Server Actions* transaksi tersentralisasi, dan mengirim bel notifikasi.

## Consequences
Kode menjadi sangat rapi dan lincah, namun modul `content-review` ini berevolusi menjadi titik rawan (*bottleneck code*). Kerusakan (*bug*) logis pada fitur ini akan menggagalkan serentak penyetujuan seluruh lini produk (Artikel, Profil, dsb).

## Related Documents
* `PRD.md`
* `FEATURES_DISCOVERY.md`
* `features/content-review.md`
