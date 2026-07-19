# TECH_STACK.md

# HMI Cabang Semarang

## Purpose

Dokumen ini mendefinisikan seluruh teknologi yang digunakan pada project.

Seluruh implementasi wajib mengikuti stack yang ditentukan dalam dokumen ini.

AI Agent, Developer, dan Contributor tidak diperbolehkan menambahkan dependency utama baru tanpa alasan yang jelas dan terdokumentasi.

---

# Core Stack

## Frontend Framework

### Next.js

Version: Latest Stable

Features:

* App Router
* Server Components
* Route Handlers
* Server Actions
* Metadata API
* Dynamic Routes

Reason:

* Full-stack framework
* SEO friendly
* Excellent Vercel integration
* Production ready

---

## Language

### TypeScript

Mode:

* Strict Mode Enabled

Reason:

* Type safety
* Better maintainability
* Better AI-assisted development

---

## Styling

### Tailwind CSS

Purpose:

* Utility-first styling
* Consistent design system
* Fast development

---

## UI Components

### shadcn/ui

Preset:

b2BnwlLOK

Purpose:

* Reusable UI components
* Accessibility support
* Consistent design language

---

# Architecture

## Frontend Architecture

### Feature-Sliced Design (FSD)

Layers:

* app
* pages
* widgets
* features
* entities
* shared

Purpose:

* Scalability
* Maintainability
* Clear separation of concerns

Reference:

docs/FSD_ARCHITECTURE.md

---

# State Management

## Zustand

Purpose:

* Client state
* UI state
* Modal state
* Theme state

Examples:

* Sidebar state
* Dialog state
* Notification state

Do Not Use For:

* Server state
* API caching

---

# Server State

## TanStack Query

Purpose:

* API requests
* Data fetching
* Cache management
* Optimistic updates

Examples:

* Articles
* Agendas
* Commissariats
* Dashboard statistics

Do Not Replace With:

* Zustand
* useEffect fetching

---

# Forms

## React Hook Form

Purpose:

* Form handling
* Validation integration

---

## Zod

Purpose:

* Schema validation
* Form validation
* API validation

Required:

All forms must use Zod schemas.

---

# Backend

## Next.js Route Handlers

Purpose:

* Internal API endpoints
* Server-side business logic

Location:

app/api

---

# Database

## Supabase PostgreSQL

Purpose:

* Primary database

Reason:

* Managed PostgreSQL
* Reliable
* Easy integration

---

## Prisma ORM

Purpose:

* Database access
* Type-safe queries
* Migrations

Rule:

All database access must go through Prisma.

Direct SQL should be avoided unless necessary.

---

# Authentication

## Auth.js

Authentication Type:

* Email + Password
* Invite Flow
* Password Reset

Roles:

* SYSTEM_ADMIN
* ADMIN_CABANG
* ADMIN_KOMISARIAT

Reference:

docs/ROLE_PERMISSION_MATRIX.md

---

# Storage

## Cloudinary

Purpose:

* Media Optimization Pipeline
* Article images
* Agenda flyers
* Gallery photos
* Logos
* Favicon
* PDF Documents / Secure Verifications

Reason:

* Dedicated media CDN
* Built-in on-the-fly image transformations (resize, webp/avif)
* Avoids Next.js image proxy bottlenecks
* Reduces Vercel/Supabase bandwidth usage

---

## Media Optimization Pipeline

Every uploaded image must:

1. Validate file type
2. Resize
3. Convert to WebP
4. Upload to Storage

Reference:

docs/PRD.md

---

# Rich Text Editor

## @google/model-viewer

Purpose:

* Render aset 3D `.glb` (logo HMI Cabang Semarang) di web melalui web component `<model-viewer>`.

Penggunaan:

* Homepage — card kanan section "Tentang HMI Cabang Semarang" (`widgets/home/ui/Logo3D.tsx`, client-only, lazy import di `useEffect`).
* Aset di `public/models/logo-hmsmg3d.glb`. Auto-rotate + camera-controls, zoom dimatikan.

Catatan: dependency disetujui (2026-06-29). Dipilih ketimbang `react-three-fiber`/`three` karena jauh lebih ringan (1 paket, lighting/kontrol bawaan).

---

## Framer Motion

Purpose:

* Animasi bento galeri interaktif di `/galeri` (`GalleryBento`): drag horizontal (`drag="x"` + `dragConstraints`), reveal saat scroll (`useScroll`/`useTransform`), stagger item, dan modal lightbox (`AnimatePresence`).

Catatan: dependency disetujui (2026-07-02). Dipakai khusus komponen galeri interaktif; animasi ringan lain tetap pakai CSS/`FadeIn` bawaan.

---

## @tailwindcss/typography

Purpose:

* Kelas `prose` untuk render konten HTML artikel (Tiptap) di halaman baca publik `/artikel/[slug]` agar tipografi (heading, list, blockquote, gambar) rapi otomatis.

Catatan: dev dependency disetujui (2026-07-02). Didaftarkan via `@plugin "@tailwindcss/typography";` di `globals.css` (Tailwind v4).

---

## xlsx (SheetJS)

Purpose:

* Parsing berkas Excel `.xlsx`/`.xls` untuk **import massal akun Komisariat & LPP** (kolom No, Nama_Komisariat, Username) di modul `commissariat-accounts`.

Catatan: dependency disetujui (2026-07-01). Dipilih karena tidak ada parser spreadsheet lain di project; kebutuhan spesifik import akun via Excel. Parsing dilakukan di server action.

---

## html-to-image · qrcode · jszip (Generate Carousel)

Purpose:

* **html-to-image** — merender node DOM slide (1080×1350) menjadi PNG **di browser admin** untuk fitur Generate Carousel (`features/carousel-generator`). Menggantikan rencana awal Playwright/Chromium server-side yang tidak cocok dengan Vercel serverless (limit 250MB, butuh `maxDuration`/bundling khusus).
* **qrcode** — men-generate QR Code (menuju `/artikel/{slug}`) sebagai data URL untuk slide CTA.
* **jszip** — mengemas seluruh PNG menjadi `{slug}.zip` di sisi klien untuk diunduh langsung (tanpa upload/temporary asset di Cloudinary).

Catatan: dependency disetujui (2026-07-19). Ketiganya berjalan **client-side only** — tidak menambah beban runtime server maupun ukuran fungsi Vercel. Pendekatan ini menghapus kebutuhan Playwright, halaman export, endpoint `/api`, dan siklus temporary Cloudinary yang tertulis di draft spec. Catatan lockfile: `TECH_STACK` menyebut pnpm sebagai package manager, namun repo saat ini melacak `package-lock.json` (npm); instalasi mengikuti lockfile npm yang aktif.

---

## Tiptap

Purpose:

* Article editor

Extensions:

* Heading
* Bold
* Italic
* Underline
* Link
* Image
* Code Block
* YouTube Embed

Paket terpasang (pinned `3.27.1`, cocok peer `@tiptap/core`):

* `@tiptap/starter-kit` — Heading, Bold, Italic, **Underline**, **Link**, **Code Block**, **Horizontal Rule** (sudah terbundel v3)
* `@tiptap/extension-image` — Image
* `@tiptap/extension-youtube` — YouTube Embed (`setYoutubeVideo`, mem-parse URL penuh)
* `@tiptap/extension-placeholder` — Placeholder teks di baris kosong editor

Catatan: editor artikel memakai komponen `MediumEditor` (bubble menu + floating `+` menu, gaya Medium); editor agenda memakai `TiptapEditor` (toolbar statis).

---

# Notifications

## In-App Notifications

Purpose:

* Article review updates
* Agenda review updates
* Profile review updates

No business workflow email notifications in MVP.

Examples not included:
* Article approved email
* Article rejected email
* Agenda revision email

However authentication emails remain supported:
* Invite Link Email
* Password Reset Email

---

# Analytics

## Vercel Web Analytics + Speed Insights

Purpose:

* Traffic monitoring (jumlah pengunjung, halaman populer, sumber) — privacy-friendly, tanpa cookie banner.
* Speed Insights: monitoring Core Web Vitals dari data pengunjung nyata.

Penggunaan:

* `@vercel/analytics` + `@vercel/speed-insights` (disetujui 2026-07-03). `<Analytics/>` + `<SpeedInsights/>` di `app/layout.tsx`. Wajib di-*enable* di dashboard Vercel (project → Analytics / Speed Insights).

Alternative:

* Google Analytics 4
* Plausible / Umami

---

# Deployment

## Vercel

Purpose:

* Hosting
* Deployment
* Preview environments

---

# Environment Management

## Environment Variables

Required:

* Database URL
* Auth Secret
* Supabase URL
* Supabase Key
* Analytics Key

Rules:

Never hardcode secrets.

Use environment variables only.

---

# Code Quality

## ESLint

Required

---

## Prettier

Required

---

# Testing

## Future Scope

Potential:

* Vitest
* Playwright

Not included in MVP.

---

# Package Manager

## pnpm

Required

Do not use:

* npm
* yarn

---

# Icons

## Lucide React

Purpose:

* Primary/consistent icon set untuk UI umum (aksi, navigasi, status).

## React Icons (Font Awesome 6 brands)

Purpose:

* Khusus **ikon brand media sosial** (Instagram, X/Twitter, LinkedIn, Facebook, YouTube, TikTok) yang tidak lagi tersedia di Lucide.
* Hanya dipakai untuk merepresentasikan platform sosial (mis. kartu pengurus). Untuk ikon non-brand tetap gunakan Lucide React.

---

# Theme

Supported:

* Light Mode
* Dark Mode
* System Preference

---

# Search

Global Search:

* Articles
* Agendas
* Commissariats
* Documents

Implementation to be defined later.

---

# Documentation References

The following documents are considered authoritative:

1. docs/PRD.md
2. docs/SITEMAP_PUBLIC.md
3. docs/SITEMAP_CMS.md
4. docs/DATABASE_SCHEMA.md
5. docs/ROLE_PERMISSION_MATRIX.md
6. docs/FSD_ARCHITECTURE.md
7. docs/API_SPECIFICATION.md

If conflicts occur:

PRD.md takes precedence unless superseded by a newer approved decision record.
