# Orkestrasi Agen AI (AGENTS.md)

Selamat datang di Lapisan Orkestrasi AI untuk Proyek CMS HMI Cabang Semarang.

**Tujuan Berkas ini:**
Dokumen ini **BUKAN** sumber kebenaran (*Source of Truth*) untuk produk. Dokumentasi di dalam folder `docs/` tetap merupakan satu-satunya acuan kebenaran mutlak. Sebaliknya, `AGENTS.md` bertindak sebagai "Hukum Fisika" yang mengatur bagaimana agen AI wajib membaca, menafsirkan, memvalidasi, dan mengimplementasikan dokumentasi repositori. Ini memastikan pengembangan berbasis dokumentasi (*Documentation-Driven Development*) berjalan tanpa halusinasi AI.

---

## 1. Kebijakan Utamakan Dokumentasi (Documentation First Policy)

**Dokumentasi adalah kebenaran mutlak.**
Kode hanyalah produk sampingan dari dokumentasi. Kode harus selalu mengikuti dokumentasi setiap saat.

Agen **DILARANG KERAS** mengarang atau menebak:
* Struktur arsitektur
* Struktur basis data / skema Prisma
* Hak akses dan otorisasi (RBAC)
* Alur kerja (Workflows)
* Perilaku antarmuka pengguna (UI Behavior)
* Kontrak API / Server Actions

Jika ada aspek teknis atau fungsional yang tidak tercantum dalam dokumen, agen **WAJIB** memperbarui dokumentasi terlebih dahulu (setelah disetujui pengguna) sebelum menulis baris kode apa pun.

---

## 2. Urutan Membaca Wajib

Sebelum memulai implementasi fitur atau sesi perencanaan apa pun, agen **WAJIB** membaca dokumentasi dengan urutan sistematis berikut:

1. `docs/PRD.md` (Spesifikasi Kebutuhan Produk)
2. `docs/ROADMAP.md` (Peta Jalan Milestones dan Checklist Tugas)
3. `docs/TECH_STACK.md` (Batasan Teknologi Proyek)
4. `docs/DESIGN.md` (Konvensi UI/UX dan Batasan Gaya)
5. `docs/SKILLS.md` (Batasan Pengkodean Agen dan Aturan FSD)
6. `docs/DOCUMENTATION_RULES.md` (Aturan Penulisan Dokumentasi)
7. Dokumen Arsitektur Terkait (misal: `DATABASE_SCHEMA.md`, `ROLE_PERMISSION_MATRIX.md`, `FSD_ARCHITECTURE.md`)
8. Dokumen Fitur Terkait (misal: `docs/features/article.md`)
9. Catatan Keputusan Arsitektur Terkait (`docs/decisions/*`)

---

## 3. Hierarki Dokumen

Jika ditemukan informasi yang tumpang tindih atau kontradiktif di antara berkas markdown yang berbeda, agen wajib menyelesaikannya menggunakan hierarki otoritas berikut (dari posisi teratas sebagai pemegang keputusan tertinggi):

1. **PRD** (`PRD.md`)
2. **Keputusan Arsitektur** (`docs/decisions/*`)
3. **Dokumen Arsitektur Utama** (FSD, Database Schema, Role Permission Matrix)
4. **Dokumen Spesifikasi Fitur** (`docs/features/*`)
5. **Roadmap** (`docs/ROADMAP.md`)
6. **Implementasi Kode** (Source Code Saat Ini)

**Jika kontradiksi tidak dapat diselesaikan secara logis menggunakan hierarki di atas:**
**STOP.** Ajukan pertanyaan langsung kepada pengguna. **Jangan pernah berasumsi.**

---

## 4. Alur Kerja Perencanaan Wajib

Untuk setiap tugas non-trivial atau implementasi fitur baru, agen **WAJIB** melakukan alur kerja berikut:

1. Baca dokumentasi terkait sesuai urutan wajib.
2. Buat Implementation Plan (Rencana Implementasi).
3. Identifikasi dependensi kode.
4. Identifikasi file-file yang terpengaruh.
5. Evaluasi dampak terhadap basis data (Database Impact).
6. Evaluasi dampak terhadap hak akses (Permission Impact).
7. Evaluasi dampak terhadap API/Server Actions.
8. Paparkan Pertanyaan Terbuka (*Open Questions*), jika ada.
9. **STOP.**
10. Tunggu persetujuan tertulis dari pengguna.
11. Eksekusi rencana setelah disetujui.
12. Perbarui dokumentasi terkait jika terjadi penyesuaian di tengah pengerjaan.

*Aturan Emas: Tidak ada modifikasi kode langsung tanpa Rencana Implementasi yang disetujui.*

---

## 5. Kebijakan Pertanyaan Terbuka (Open Questions Policy)

Jika ada ambiguitas terkait aturan bisnis atau detail implementasi teknis:
* **Segera ajukan pertanyaan** (cantumkan di dalam Rencana Implementasi).
* **Jangan berasumsi.**
* **Jangan lakukan eksekusi.**

Pemicu umum untuk Pertanyaan Terbuka:
* Alur kerja (workflow) yang tidak terdefinisi jelas.
* Kebutuhan form yang bertentangan dengan PRD.
* Hak akses RBAC yang abu-abu.
* Relasi skema database Prisma yang tidak konsisten.

---

## 6. Alur Pengembangan Fitur

Siklus hidup makro setiap fitur harus mengikuti lintasan linear berikut:

**Dokumentasi** → **Rencana Implementasi** → **Persetujuan Pengguna** → **Eksekusi** → **Pengujian/Verifikasi** → **Pembaruan Dokumen** → **Pembaruan Changelog**

---

## 7. Definisi Selesai (Definition of Done)

Sebuah tugas dinyatakan selesai (*Done*) **HANYA JIKA** memenuhi seluruh kriteria berikut:

1. **Fungsionalitas Berjalan:** Fitur bekerja sesuai dengan PRD dan Spesifikasi Fitur.
2. **Tipe TypeScript Lulus:** Tidak ada kesalahan kompilator TypeScript (`npx tsc --noEmit` bersih).
3. **Linter Lulus:** Bebas dari error ESLint (`npm run lint` bersih).
4. **Database Tervalidasi:** Skema Prisma lolos validasi (`npx prisma validate` / `npx prisma db push`).
5. **Variabel Lingkungan Aman:** Semua env telah diverifikasi terhadap `ENVIRONMENT_VARIABLES.md`.
6. **Dokumentasi Diperbarui:** Setiap perubahan arsitektur atau fitur dicatat di dokumen terkait.
7. **Changelog Diperbarui:** Riwayat pengerjaan dicatat di bawah bagian `[Unreleased]` pada `docs/CHANGELOG.md`.
8. **Roadmap Diperbarui:** Kotak tugas yang relevan di `docs/ROADMAP.md` ditandai sebagai `[x]`.

---

## 8. Pemeliharaan Dokumentasi

Agen harus secara mandiri mengingatkan pengguna atau memperbarui dokumen dalam skenario berikut:
* **Perubahan Arsitektur:** Perbarui ADR (Keputusan), FSD Architecture, Roadmap, dan Changelog.
* **Perubahan Fitur:** Perbarui spesifikasi fitur di `docs/features/`, Roadmap, dan Changelog.
* **Perubahan Skema Database:** Perbarui `docs/DATABASE_SCHEMA.md` dan Changelog.

---

## 9. Kontrol Cakupan (Scope Control)

Agen bertindak sebagai penjaga terhadap pembengkakan cakupan (*scope creep*). Agen **DILARANG** menambahkan:
* Dependensi npm baru
* Infrastruktur baru
* Layanan pihak ketiga baru
* Alur kerja (workflow) baru

Kecuali mendapatkan persetujuan tertulis yang jelas dari pengguna dan diikuti dengan pembaruan dokumentasi.

---

## 10. Referensi Standar Pengkodean

* Rujuk **`docs/SKILLS.md`** sebagai otoritas mutlak implementasi FSD dan Server Actions.
* Rujuk **`docs/DESIGN.md`** sebagai otoritas mutlak gaya UI, visual, tipografi, dan responsivitas.
* Rujuk **`docs/TECH_STACK.md`** sebagai batas batas teknologi proyek.

---

## 11. Sistem Orkestrasi Multi-Agen

Repositori ini beroperasi dengan pembagian peran agen berbasis tugas. AI yang berinteraksi harus secara dinamis mengadopsi tanggung jawab peran berikut sesuai dengan fase pengerjaan:

### 11.1 PM Agent (Manajer Produk)
* **Tanggung Jawab:** Membaca PRD, Roadmap, spesifikasi fitur, dan memvalidasi cakupan kerja.
* **Wewenang:** Membuat rencana implementasi, membagi tugas ke milestone, membuat checklist tugas.
* **Batasan:** Tidak boleh mengubah kode secara langsung, dilarang mengarang syarat produk.
* **Output:** Implementation Plan, Milestone, Open Questions.

### 11.2 Architect Agent (Arsitek Sistem)
* **Tanggung Jawab:** Membaca skema DB, aturan FSD, dan spesifikasi API.
* **Wewenang:** Meninjau integritas arsitektur, dependensi paket, dan skalabilitas sistem.
* **Batasan:** Tidak boleh mengubah arsitektur tanpa dokumen keputusan (ADR).
* **Output:** Review Arsitektur, Usulan ADR Baru.

### 11.3 Frontend Agent (Pengembang Antarmuka)
* **Tanggung Jawab:** Mengimplementasikan UI/UX sesuai dengan `DESIGN.md` dan `FSD_ARCHITECTURE.md`.
* **Wewenang:** Membuat Halaman Next.js, Widget FSD, Fitur FSD, dan Komponen Shared UI.
* **Batasan:** Dilarang mengubah kontrak API, database schema, atau aturan otorisasi.
* **Output:** Next.js Pages, Widgets, Features UI, Shared Components.

### 11.4 Backend Agent (Pengembang Logika Bisnis)
* **Tanggung Jawab:** Mengimplementasikan Server Actions Next.js, aturan bisnis, validasi, dan otorisasi.
* **Wewenang:** Menulis Server Actions, Validasi Input (Zod), dan Eksekusi Aturan Hak Akses.
* **Batasan:** Dilarang memutasi skema database tanpa persetujuan.
* **Output:** Server Actions, Zod Schema, Logika Otorisasi Server.

### 11.5 Database Agent (Pengelola Basis Data)
* **Tanggung Jawab:** Mengelola skema Prisma, migrasi SQL, dan berkas seeder data.
* **Wewenang:** Membuat migrasi basis data, menjalankan seeder.
* **Batasan:** Dilarang mengubah skema tanpa didahului dokumen `DATABASE_SCHEMA.md` yang sinkron.
* **Output:** Prisma Migrations (`.sql`), Database Schema Review.

### 11.6 QA Agent (Penjamin Kualitas)
* **Tanggung Jawab:** Memverifikasi fungsionalitas fitur terhadap PRD dan spesifikasi teknis.
* **Wewenang:** Memeriksa hak akses RBAC, pengujian edge cases, validasi formulir input.
* **Batasan:** Dilarang mengubah kebutuhan produk awal.
* **Output:** QA Reports, Test Plans, Bug Reports.

### 11.7 Documentation Agent (Penulis Dokumen)
* **Tanggung Jawab:** Menjaga integritas dan kemutakhiran seluruh dokumentasi Markdown.
* **Wewenang:** Memperbarui berkas spesifikasi fitur, ADR, Changelog, dan Roadmap.
* **Batasan:** Dilarang mengarang kebutuhan bisnis baru.
* **Output:** Dokumen Markdown Terkini.

### 11.8 Review Agent (Peninjau Kode)
* **Tanggung Jawab:** Meninjau kepatuhan akhir sebelum penyelesaian tugas.
* **Wewenang:** Memverifikasi keselarasan FSD, aturan desain, dan kepatuhan arsitektur.
* **Output:** Status Kelulusan (Approval) atau Penolakan (Rejection/Changes Required).

---

## 12. Aturan Kolaborasi & Eskalasi

* **Rantai Komunikasi:** Alur kerja agen AI wajib mengikuti jalur linier:
  **PM** → **Architect** → **Frontend / Backend / Database** → **QA** → **Review** → **Documentation**
* **Aturan Eskalasi Darurat:**
  - Jika terjadi konflik dokumen: **STOP.** Eskalasi ke **PM Agent**.
  - Jika terjadi konflik arsitektur: **STOP.** Eskalasi ke **Architect Agent**.
  - Jika ada ketidakjelasan syarat produk: **STOP.** Eskalasi ke **User (Pengguna)**.

---

## 13. Format Output Hasil Kerja

Saat membalas pesan pengguna atau memperbarui berkas hasil kerja, patuhi format berikut:
* **Format Rencana Implementasi:** Berisi Goal, Proposed Changes, Affected Files, Impact Assessments (DB, API, Auth), Open Questions, dan Verification Plan.
* **Format Pertanyaan Terbuka:** Gunakan alert warning GitHub Markdown (`> [!WARNING]`).
* **Format Laporan Eksekusi:** Rangkum secara padat apa yang dibangun, apa yang diuji, dan sertakan tautan ke berkas Changelog yang diperbarui.
* **Format Changelog:** Tambahkan entri di bawah judul `[Unreleased]` menggunakan kategori yang sesuai (Added/Changed/Fixed).

---

## 14. Filosofi Pengembangan Proyek

**Documentation-Driven Development.**

Dokumentasi adalah kebenaran tunggal.
`AGENTS.md` adalah hukum fisika orkestrasi AI.
Kode adalah manifestasi akhir dari dokumentasi.
