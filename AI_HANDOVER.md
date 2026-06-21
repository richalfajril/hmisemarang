# AI Handover Context (CMS HMI Cabang Semarang)

> **Untuk AI Assistant / IDE (Codex,Cursor, Windsurf, Copilot, dll):**
> 1. **TUGAS PERTAMA ANDA:** Anda DIWAJIBKAN untuk membaca file `AGENTS.md` yang berada di direktori *root* sebelum melakukan apa pun. File tersebut adalah satu-satunya sumber kebenaran (*Single Source of Truth*) untuk alur kerja di repositori ini.
> 2. Baca dokumen serah terima ini secara menyeluruh sebelum Anda mulai melakukan perubahan kode apa pun. Dokumen ini adalah peta jalan (*roadmap*) konteks proyek agar Anda bisa langsung bekerja tanpa merusak standar arsitektur yang sudah dibangun.

## 1. Identitas Proyek
* **Nama Proyek:** CMS HMI Cabang Semarang
* **Tech Stack:** Next.js (App Router), Prisma ORM, Supabase (Auth), Cloudinary (Storage), Zustand (Client State), React Query (Server State), TailwindCSS, shadcn/ui.
* **Tujuan Utama:** Membangun *Content Management System* berlapis *Role-Based Access Control* (RBAC) yang ketat antara `SYSTEM_ADMIN`, `ADMIN_CABANG`, dan `ADMIN_KOMISARIAT` untuk mengelola artikel, agenda, galeri, dokumen, dan verifikasi kader.

## 2. Standar Arsitektur: Strict Feature-Sliced Design (FSD)
Proyek ini mematuhi arsitektur FSD secara kaku dengan beberapa modifikasi khusus Next.js App Router:
* ❌ **TIDAK ADA FOLDER `pages`**: Komposisi antarmuka dilakukan langsung di dalam folder rute `src/app/`.
* 🛡️ **`src/entities/`**: Berisi representasi *Domain Model* murni. Semua skema validasi Zod (`schema.ts`) telah dipindahkan secara ketat ke dalam masing-masing folder entitas (contoh: `src/entities/article/model/schema.ts`).
* ⚙️ **`src/features/`**: Berisi murni logika interaksi (*Server Actions*) dan UI interaktif yang memutasi entitas. **Jangan pernah** meletakkan deklarasi skema Zod di sini.
* 🧩 **`src/widgets/`**: Blok komposisi UI besar (seperti *Header*, *Sidebar*, *ReviewCenter*).
* 🧰 **`src/shared/`**: Komponen atomik (`PascalCase.tsx`), *hooks*, konfigurasi, dan klien database tunggal (`prisma/client.ts`).
* **Skeletons & App Shell**: Rute dasbor telah dilengkapi dengan `loading.tsx` yang me-*render* komponen kerangka seperti `TableSkeleton` dan `GridSkeleton` dari `shared/ui` untuk navigasi instan. Jangan ubah pola pemuatan ini.

## 3. Aturan Main AI (AI Workflow Rules)
Dokumen tunggal yang mengatur seluruh pergerakan AI ada di `AGENTS.md` (di *root* folder). Aturan mutlak:
1. **DILARANG** merancang fitur baru tanpa menyusun *Implementation Plan* terlebih dahulu dan meminta *approval* dari pengguna.
2. **DILARANG** mengganti dependensi yang sudah ada (*No Auth.js, No Supabase Storage*).
3. **WAJIB** mengecek `docs/ROADMAP.md` untuk melihat status progres fitur, dan `docs/CHANGELOG.md` untuk melihat sejarah *refactoring* terakhir.
4. **WAJIB** mengecek dokumen *Decision Records* di `docs/decisions/` jika kebingungan dengan desain arsitektur (seperti mengapa kita pakai *Soft Delete*).

## 4. Status Proyek Saat Ini (Current State)
* **Refaktorisasi Terakhir yang Baru Saja Selesai:** 
  1. Penyesuaian nama seluruh UI statis di `shared/ui` menjadi `PascalCase`.
  2. Ekstraksi seluruh skema domain Zod ke dalam lapisan `entities`.
  3. Implementasi *App Shell* (*Suspense Boundaries*) di seluruh rute `/dashboard/*` agar perpindahan antar halaman terasa sangat cepat (<50ms).
* **Posisi Milestone Saat Ini:** Proyek telah berada di ambang peluncuran produksi (*Production Readiness*).
* **Branch Saat Ini:** `development` (Sudah ter-*push* sinkron dengan GitHub).

## 5. Fokus Anda Selanjutnya (Next Immediate Task)
Berdasarkan target yang ada pada `docs/ROADMAP.md` di fase **v1.10.0 QA & Production Launch**, fokus utama pengembangan selanjutnya adalah:
1. **Infrastruktur Pertahanan Produksi (*Production Readiness*):** Melakukan *QA (Quality Assurance)* dan mencari *bugs* sisa pada validasi form atau navigasi.
2. Memastikan aplikasi lolos dan siap untuk di-deploy ke Vercel secara matang.

---
**Instruksi Perdana Anda (AI Prompt):**
*"Saya telah membaca `AI_HANDOVER.md`. Saya memahami bahwa arsitektur proyek ini menggunakan FSD Murni dengan Next.js App Router, menggunakan App Shell untuk pemuatan instan, dan lapisan `entities` khusus untuk model skema. Silakan berikan saya instruksi tugas QA atau fitur apa yang ingin kita selesaikan hari ini!"*
