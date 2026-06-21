# Adopsi Arsitektur Feature-Sliced Design (FSD)

## Context
CMS HMI Semarang memiliki banyak aktor pengurus (1 Cabang dan 36 Komisariat) dengan logika kepemilikan dan prosedur ulasan konten yang beragam.

## Problem
Struktur kerangka dasar (*default*) Next.js yang hanya menyediakan `app/` atau `components/` terlampau bebas. Kurangnya pedoman peletakan kode menyebabkan *developer* kerap menyatukan pemanggilan *database*, pengatur *state* antarmuka, dan pembungkusan HTML ke dalam satu *file* tunggal yang melahirkan "kode spageti".

## Decision
Mengadopsi kerangka metodologi **Feature-Sliced Design (FSD)** dengan hierarki map lapis: `app`, `pages`, `widgets`, `features`, `entities`, dan `shared`. Secara spesifik, kami meniadakan *layer* `processes` untuk menghindari arsitektur yang melampaui kebutuhan (*overengineering*).

## Consequences
Setiap fungsionalitas UI dapat diisolasi dan diidentifikasi seketika (Apakah ini komponen kosong dari `entities`? Atau komponen aktif penembak *database* dari `features`?). Aturan ini mewajibkan hierarki impor berarah satu lintasan (dari atas ke bawah). Risiko saling kunci *circular dependency* tereduksi. Namun, pendatang baru wajib mempelajari metodologinya terlebih dahulu.

## Related Documents
* `FSD_ARCHITECTURE.md`
* `FSD_ARCHITECTURE_REVIEW.md`
* `FEATURES_DISCOVERY.md`
