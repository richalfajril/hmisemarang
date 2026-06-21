# Penggunaan Single Next.js Application (Non-Monorepo)

## Context
Awalnya, inisialisasi proyek UI menggunakan perintah dasar *shadcn* (seperti `npx shadcn-ui@latest init` bawaan turborepo preset) yang mendesain arsitektur sebagai Monorepo (*workspace* `apps/` dan `packages/`). Sistem ini sangat ideal untuk memecah proyek skala amat masif (misalnya memisah *dashboard admin* dan *web public* menjadi dua aplikasi fisik yang dikompilasi terpisah).

## Problem
Monorepo menambah tingkat kompleksitas (*overhead*) infrastruktur yang berlebihan untuk CMS berskala menengah. Pemeliharaan dan konfigurasi lintas *dependency*, integrasi *linting* yang bertingkat, serta *deployment pipelines* ke Vercel menjadi sangat ruwet (rawan gagal lint akibat perbedaan versi).

## Decision
Kami membuang pendekatan Monorepo dan kembali mengadopsi direktori proyek standar: **Single Next.js Application** di dalam akar (*root*) direktori tunggal.

## Consequences
Proses kompilasi, penyebaran (*deployment*), instalasi paket pustaka NPM, dan penyuntingan kode menjadi sangat lugas dan satu arah. Aplikasi Publik dan Dasbor Administratif dirajut menjadi satu aplikasi fisik yang disekat secara logika rute (di dalam `src/app`).

## Related Documents
* `PROJECT_BOOTSTRAP_PLAN.md`
* `TECH_STACK.md`
