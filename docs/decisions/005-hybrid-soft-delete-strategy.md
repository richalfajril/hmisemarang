# Strategi Soft Delete Hibrida

## Context
Konten CMS sering kali tak sengaja terhapus. Kebutuhan akan keranjang pemulihan (*Recycle Bin*) mencuat di beberapa entitas. Namun, mengaplikasikan hal ini pada entitas pondasi (seperti *Kategori* dan *Periode*) dapat menyebabkan kekacauan referensi.

## Problem
Menerapkan *Soft Delete* mutlak pada struktur Master Data (seperti Komisariat dihapus lunak, sementara puluhan artikelnya masih terbit secara publik) akan melahirkan malapetaka render data (Artikel yatim piatu).

## Decision
Menerapkan skema **Hibrida**. *Soft Delete* menggunakan kerangka cap waktu `deleted_at` secara ketat hanya pada entitas yang bergulir cepat (Volatile Content): *Article*, *Agenda*, *Document*, dan *Album*. Entitas arsitektural (Struktur Komisariat, Periode Kepengurusan, dan Taksonomi) BUKAN dihapus secara *soft delete*, melainkan dijauhkan dari pandangan publik menggunakan bendera sematan `is_active = false` (Arsip).

## Consequences
Penyusunan basis data *(Prisma Schema)* sedikit kompleks karena setiap entitas menuntut perlindungan berbeda. Namun, integritas web publik dipastikan bebas dari kekacauan relasi kunci asing (*Foreign Key violation/orphan logic*).

## Related Documents
* `PRD.md`
* `DATABASE_SCHEMA.md`
