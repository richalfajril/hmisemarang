# GIT_WORKFLOW.md

## Purpose
Dokumen ini menetapkan standar strategi *branching*, aturan *Pull Request*, dan alur rilis (Release Workflow) untuk proyek CMS HMI Cabang Semarang agar proses kolaborasi berjalan rapi dan terkendali.

---

## 1. Branch Strategy

Repositori ini menggunakan variasi *GitHub Flow* dengan dua *long-lived branches*:

### Long-lived Branches:
* **`production`**: Cabang utama yang *live* di domain produksi.
* **`development`**: Cabang integrasi untuk mengumpulkan seluruh fitur sebelum dirilis.

### Feature / Ephemeral Branches:
* **`feat/*`** (Contoh: `feat/article-review`) → Untuk fitur baru.
* **`fix/*`** (Contoh: `fix/login-bug`) → Untuk perbaikan *bug*.
* **`docs/*`** (Contoh: `docs/api-specs`) → Khusus pembaruan dokumentasi.
* **`refactor/*`** (Contoh: `refactor/fsd-restructure`) → Untuk perombakan kode tanpa mengubah fitur.

---

## 2. Development Flow

Alur standar pengembangan dari mulai menulis kode hingga *live* di produksi:

```txt
feature/*
   ↓  (Pull Request)
development
   ↓  (Pull Request / Release)
production
```

---

## 3. Pull Request Rules

Semua perubahan kode wajib melalui **Pull Request (PR)**.

* **Branch Targets:**
  * PR dari cabang `feat/*` atau `fix/*` harus selalu diarahkan ke **`development`**.
  * PR tidak boleh diarahkan langsung ke `production` kecuali untuk rilis terjadwal (dari `development`) atau *Hotfix* darurat.
* **Merge Strategy:**
  * **`development`**: Gunakan strategi **Squash and Merge** agar riwayat *commit* di `development` bersih.
  * **`production`**: Gunakan strategi **Merge Commit** agar riwayat rilis historis tetap terjaga.
* **Commit Conventions:**
  * Gunakan standar *Conventional Commits*:
    * `feat: add cadre verification form`
    * `fix: resolve auth cookie issue`
    * `docs: update FSD schema`

---

## 4. Release Workflow

Alur rilis dari integrasi ke produksi.

**Alur:** `development` → `production`

**Release Checklist:**
- [ ] Semua fitur di cabang `development` telah diuji di *Preview Environment* Vercel.
- [ ] Tidak ada migrasi *database* (Prisma) yang tertinggal atau menyebabkan *downtime*.
- [ ] Variabel *environment* baru (jika ada) telah ditambahkan ke *Production Environment* di Vercel.
- [ ] PR dari `development` ke `production` telah dibuka dan di-*review*.
- [ ] PR di-*merge* menggunakan **Merge Commit**.

---

## 5. Rollback Workflow

Jika rilis menyebabkan sistem *down* atau memunculkan *bug* kritikal di produksi:

### GitHub Rollback Strategy
* Cari PR rilis bermasalah di GitHub.
* Klik tombol **"Revert"** pada Pull Request tersebut.
* Ini akan membuat PR *revert* baru. Gabungkan PR tersebut ke `production` untuk mengembalikan kode repositori ke keadaan aman sebelumnya.
* Jangan lupa me-*revert* juga di `development` agar kode tetap sinkron.

### Vercel Rollback Strategy (Instant)
* Masuk ke *Dashboard Vercel*.
* Buka tab *Deployments*.
* Temukan *deployment* terakhir yang sukses dan stabil.
* Klik ikon titik tiga (Menu) dan pilih **"Promote to Production"** atau **"Instant Rollback"**.
* Ini akan memulihkan situs dalam hitungan detik sembari *developer* memperbaiki *bug* kode di GitHub.

---

## 6. Branch Protection Recommendations

Pengaturan proteksi cabang wajib diaktifkan di GitHub Settings:

* **`production`**
  * Require a pull request before merging.
  * Require approvals (Minimal 1 `SYSTEM_ADMIN`).
  * Require status checks to pass before merging (Linting, Build Vercel).
  * Do not allow bypassing the above settings.
* **`development`**
  * Require a pull request before merging.
  * Require status checks to pass before merging.
