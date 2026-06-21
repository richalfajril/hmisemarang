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
* Table
* Code Block
* YouTube Embed

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

## Google Analytics

Purpose:

* Traffic monitoring
* User behavior

Alternative:

* Plausible
* Umami

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

* Consistent icon set

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
