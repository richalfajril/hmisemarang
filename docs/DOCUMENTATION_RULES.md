# DOCUMENTATION_RULES.md

# Purpose

Seluruh requirement, keputusan, arsitektur, dan spesifikasi project wajib terdokumentasi di dalam folder:

```txt
docs/
```

Folder ini merupakan **Single Source of Truth (SSOT)** untuk seluruh proses pengembangan. Tidak ada keputusan bisnis, teknis, atau desain yang dianggap valid apabila belum terdokumentasi di dalam folder `docs/`.

---

# Documentation Structure

Struktur dokumen pada project ini adalah sebagai berikut:

```txt
docs/
├── PRD.md
├── TECH_STACK.md
├── DOCUMENTATION_RULES.md
├── CHANGELOG.md
│
├── SITEMAP_PUBLIC.md
├── SITEMAP_CMS.md
├── ROLE_PERMISSION_MATRIX.md
├── DATABASE_SCHEMA.md
│
├── FSD_ARCHITECTURE.md
├── API_SPECIFICATION.md
├── DESIGN.md
├── SKILLS.md
│
├── features/
├── decisions/
│
└── AGENTS.md (future)
```

*Note: `AGENTS.md` is planned but not yet created.*

---

# Naming Conventions

Pemberian nama file dokumentasi wajib mengikuti aturan berikut:

**Core Documents:**
Gunakan `UPPER_SNAKE_CASE.md`.
*Examples:* `PRD.md`, `TECH_STACK.md`, `DATABASE_SCHEMA.md`

**Feature Files:**
Gunakan `kebab-case.md`.
*Examples:* `article.md`, `agenda.md`, `commissariat.md`

**ADR (Architecture Decision Records) Files:**
Gunakan penomoran dan kebab-case: `[nomor]-[topik].md`.
*Examples:* `001-auth.md`, `002-article-workflow.md`, `003-cadre-verification.md`

---

# PRD Rules (Product Requirements)

Source: `docs/PRD.md`

Berisi:
* Business requirements
* Functional requirements
* Workflow
* Business rules
* MVP scope

---

# Feature Documentation Standards

Setiap fitur utama memiliki dokumen sendiri di dalam `docs/features/`.
Feature documentation harus diturunkan dari PRD. Tidak boleh membuat requirement baru yang tidak ada di PRD tanpa ADR.

Setiap file fitur wajib mendefinisikan (berlaku sebagai **File Template**):
* **Purpose:** Tujuan dari fitur.
* **User Flow:** Alur pengguna saat berinteraksi dengan fitur.
* **Requirements:** Persyaratan fungsional spesifik.
* **Validation:** Aturan validasi data.
* **Edge Cases:** Skenario pengecualian dan cara penanganannya.
* **UI Behavior:** Perilaku antarmuka (state, loading, error).
* **Acceptance Criteria:** Kriteria penyelesaian fitur.

---

# Architecture Documentation Rules

Source: `docs/FSD_ARCHITECTURE.md`

Berisi:
* Folder structure
* Layer boundaries
* Import rules sesuai arsitektur Feature-Sliced Design.

---

# ADR Standards (Decision Records)

Semua keputusan penting (produk atau arsitektur) wajib dibuatkan ADR (Architecture Decision Record) dan disimpan di:

```txt
docs/decisions/
```

Setiap ADR wajib berisi struktur berikut (berlaku sebagai **File Template**):
* **Context:** Konteks dari masalah yang dihadapi.
* **Problem:** Masalah spesifik yang harus diselesaikan.
* **Decision:** Keputusan yang diambil.
* **Consequences:** Dampak dari keputusan tersebut (positif maupun negatif).

---

# Database Documentation Rules

Source: `docs/DATABASE_SCHEMA.md`

Berisi:
* Tables
* Relationships
* Constraints
* Indexes

---

# Changelog Requirement

Setiap perubahan yang memengaruhi:
* Requirements
* Permissions
* Database
* APIs
* Architecture
* Design

**Wajib** diperbarui di dalam:
```txt
docs/CHANGELOG.md
```

Format penulisan menggunakan panduan Keep a Changelog. Sebuah task tidak dianggap selesai apabila changelog belum diperbarui.

---

# Documentation Update Rules

Jika ada perubahan pada implementasi atau kebutuhan, dokumentasi harus diperbarui sesuai dengan domainnya:
* **Product:** Update `PRD.md`
* **Database:** Update `DATABASE_SCHEMA.md`
* **Permissions:** Update `ROLE_PERMISSION_MATRIX.md`
* **API:** Update `API_SPECIFICATION.md`
* **Architecture:** Update `FSD_ARCHITECTURE.md`

Semua pekerjaan harus mengikuti urutan:
Requirement → Documentation → Implementation

Code follows documentation. Documentation is the source of truth. Implementation is the result of documentation.
