# Eksklusivitas Server Actions untuk Mutasi Data

## Context
Kerangka *Next.js App Router* memperbolehkan dua jalur mutasi basis data: Membuat peladen kecil mandiri (`app/api/rute-endpoint.ts`) berbasis REST API klasik, atau menggunakan `Server Actions` transparan yang tereksekusi instan dari komponen.

## Problem
Menciptakan ratusan skema REST API mewajibkan pengelolaan *URL endpoints*, sinkronisasi deklarasi skema JSON pengiriman (*Fetch boiler-plate*), dan pengawalan otentikasi di masing-masing rute URL tersebut yang terasa tidak selaras dengan fungsionalitas *React Component* modern.

## Decision
Operasi penyisipan, pembaruan, dan pemusnahan data (*Mutations*) **secara eksklusif harus dieksekusi via Server Actions** dengan perintah direktif `'use server'`. Rute `app/api/` hanya boleh difungsikan sebagai lubang komunikasi pihak ketiga (contoh: *Webhooks* gerbang pembayaran pihak ketiga jika kelak ada).

## Consequences
Validasi *input* klien dihubungkan sempurna oleh Zod ke dalam Server Actions. Pengembang tidak perlu memusingkan lintasan *URL HTTP* secara rilis. Ini mengizinkan pendekatan *Progressive Enhancement* (Formulir berjalan sekalipun *JavaScript* melambat dimuat peramban klien).

## Related Documents
* `API_SPECIFICATION.md`
* `TECH_STACK.md`
* `SKILLS.md`
