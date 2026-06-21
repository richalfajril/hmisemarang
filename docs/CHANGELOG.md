# CHANGELOG.md

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## [Unreleased]

### Added

#### Next.js App Shell & Performance Refactoring (2026-06-22)
* Implemented the App Shell pattern across the CMS dashboard to resolve sluggish navigation and blocking route transitions.
* Created `TableSkeleton` and `GridSkeleton` components in `src/shared/ui/` for premium loading states.
* Added Suspense boundaries (`loading.tsx`) to `/dashboard` root and all heavy entity routes (`articles`, `agendas`, `documents`, `galleries`, `cadre-verification`, `users`).
* Navigation now occurs instantly (< 50ms) while data is fetched asynchronously behind the skeleton fallbacks.

#### FSD Entities Layer Extraction (2026-06-22)
* Extracted Zod `schema.ts` domain models from the `features` layer and successfully relocated them into their respective `src/entities/{domain}/model/schema.ts` directories to ensure 100% compliance with strict Feature-Sliced Design.
* Updated import references programmatically across all relative and absolute imports in `actions.ts` files and UI forms without breaking the build.

#### FSD Naming Conventions Refactoring (2026-06-22)
* Renamed all 35 generic `kebab-case.tsx` UI components in `src/shared/ui/` to `PascalCase.tsx` to strictly adhere to the project's React component naming standard.
* Moved `src/shared/lib/prisma.ts` to `src/shared/api/prisma/client.ts` to standardize Prisma singleton location.
* Renamed environment variables config from `src/shared/config/env.ts` to `src/shared/config/config.ts`.
* Renamed and relocated `src/shared/api/cloudinary-action.ts` to `src/shared/api/media/actions.ts` to strictly adhere to the Server Actions filename (`actions.ts`) policy.
* Updated import paths globally across 92 files to match the new component casing and relocated files.

#### Codebase Structure & Action Consolidation (2026-06-22)
* Consolidated authentication actions (`loginAction` and `logoutAction`) and schema (`loginSchema`) in `src/features/auth/api/` into unified `actions.ts` and `schema.ts` files, ensuring compliance with strict FSD naming conventions.
* Updated `LoginForm.tsx` imports and removed obsolete separate `login.ts` and `logout.ts` files.
* Deleted deprecated/stale user-management files `create-user.ts` and `force-reset.ts` from `src/features/user-management/api/` as their logic has been consolidated.

#### Dashboard Layout Refactoring & Performance Streaming (2026-06-22)
* Standardized all 25 dashboard page containers on `p-6 space-y-6 max-w-7xl mx-auto w-full` to enforce consistent padding, margins, and width alignment across the CMS.
* Created unified, reusable `BackButton` (`src/shared/ui/back-button.tsx`) and `PageHeader` (`src/shared/ui/page-header.tsx`) components.
* Refactored forms (`ArticleForm`, `AgendaForm`, `DocumentForm`, `AlbumForm`) and the review split-screen (`ReviewSplitScreen`) to utilize the unified back buttons and headers.
* Optimized dashboard rendering performance: decoupled statistics, leaderboard, pending list, and recent audit logs into independent, parallel async server components wrapped in React `<Suspense>` boundaries with shimmer `Skeleton` loader fallbacks, enabling instant dashboard page transitions.

#### FSD Safe Refactoring — Option B (2026-06-22)
* Reorganized dashboard widgets and queries: moved `PendingQueueWidget`, `RecentActivityWidget`, `LeaderboardWidget`, `StatCard`, and queries to `src/widgets/dashboard/`.
* Created FSD layout widgets: moved layout components (`AppSidebar`, `SiteHeader`, `NavMain`, `NavSecondary`, `NavUser`, `NavDocuments`, `SectionCards`) from `src/shared/ui/` to `src/widgets/layout/`.
* Standardized hooks: renamed `use-mobile.ts` to `useMobile.ts` (PascalCase), and extracted `useDebounce` from `shared/lib/hooks.ts` into a standalone `src/shared/hooks/useDebounce.ts` hook.
* Standardized utility naming and location: relocated `supabase-admin.ts` to `src/shared/api/supabase/admin.ts`, and renamed `cloudinary-client.ts` to `src/shared/lib/cloudinary-upload.ts`.
* Deleted stale files: removed deprecated PascalCase UI folder `src/shared/ui/ui/`, chart and table demo components, and old `shared/lib/hooks.ts` file.
* Fixed ESLint error in `useMobile.ts` where state was set synchronously inside `useEffect`.
* Verified all Next.js routes and TypeScript build successfully ✅.

#### UI/UX Upgrade — Dashboard Sidebar Navigation (2026-06-22)
* Installed `dashboard-01` shadcn block with full component suite: `Sidebar`, `AppSidebar`, `SiteHeader`, `NavMain`, `NavSecondary`, `NavUser`, `Card`, `Badge`, `Table`, `Avatar`, `Drawer`, `Sheet`, `Tooltip`, `Skeleton`, `Breadcrumb`, `Label`, `Select`, `Separator`, `Toggle`, `Checkbox`, `ToggleGroup`, `Sonner`, `ScrollArea`, `Popover`, `Pagination`.
* Replaced flat top header layout (`layout.tsx`) with full `SidebarProvider` + `SidebarInset` layout.
* Rebuilt `AppSidebar` dengan navigasi lengkap HMI: Konten (Dasbor, Artikel, Agenda, Galeri, Dokumen, Review Center) dan Manajemen (Pengguna, Kader, Organisasi, Taksonomi).
* Rebuilt `NavMain` with active state detection via `usePathname()` and `SidebarMenuButton isActive`.
* Rebuilt `NavUser` with real HMI logout action (Supabase `signOut`) and navigation links to Profile and Notifications.
* Rebuilt `SiteHeader` integrating `GlobalSearch` and `NotificationBell` into the header bar.
* Fixed all 42 files using legacy import path `@/shared/ui/ui/*` → migrated to correct flat paths `@/shared/ui/*`.
* Installed missing shadcn components: `scroll-area`, `popover`, `pagination`.
* Created `src/shared/ui/empty-state.tsx` migrated from legacy custom component.
* Removed redundant `scratch/` debug files.
* Fixed `chart-area-interactive.tsx` `setState` in `useEffect` ESLint error.
* Fixed `nav-main.tsx` TypeScript `pathname possibly null` type error.
* All 24 routes compile and `npm run build` passes ✅.

#### v1.3.0 Observability
* Implemented `logAuditAction` passive injection for recording persistent (Append-Only) activity logs.
* Added `/dashboard/audit-logs` viewer page with standard server-side pagination.
* Created Notification System utility (`createNotification`) for generating system updates.
* Implemented `NotificationBell` in the global dashboard layout using TanStack Query for 30s polling.
* Added `/dashboard/notifications` page for managing all historical notifications.
* Integrated `logAuditAction` into `Taxonomy` features (Article Category, Document Category, Tag).

#### Documentation

* Created `PRD.md`
* Created `TECH_STACK.md`
* Created `DOCUMENTATION_RULES.md`
* Created `SITEMAP_PUBLIC.md`
* Created `SITEMAP_CMS.md`
* Created `decisions/001-authentication.md`
* Created `decisions/002-document-module.md`
* Created `decisions/003-database-readiness.md`
* Created `decisions/004-cloudinary-migration.md`
* Created `ROADMAP.md`

#### Product Modules

* Authentication Module
* Article Module
* Commissariat Module
* Organization & Period Module
* Agenda Module
* Gallery Module
* Dashboard Module
* Notification Module
* Audit Log Module
* Website Settings Module
* Document Module

#### Public Website

* Homepage
* Profile Page
* Structure Organization Page
* Article Pages
* Agenda Pages
* Commissariat Pages
* Gallery Pages
* Document Pages
* Contact Page

#### Features

* Unified Review Center
* Global Search
* Dark Mode Support
* Maintenance Mode
* Analytics Support
* Media Optimization Pipeline
* Soft Delete Strategy
* Single Session Authentication

---

### Changed

#### Product Decisions

* **ADR 004: Migrated Media Storage from Supabase Storage to Cloudinary.**
* Dashboard leaderboard restricted to Top 5 Commissariats.
* Global Search priority defined: Relevance first, then Published Date DESC.
* Content Review concurrency handled via Prisma Transactions (no version column/optimistic locking).
* Audit Logs retention policy set to permanent (never auto-delete).
* Defined Category cardinality (Article N:1, Document N:1).
* Defined Tag cardinality (Article N:M).
* Created dedicated Review History entity to permanently store revision notes.
* Created dedicated Cadre Verification entity.
* Added Draft → Published → Archived workflow for Gallery Albums.
* Refined Soft Delete strategy (restricted for Commissariats, Periods, Categories, Tags).
* Clarified SYSTEM_ADMIN capabilities (bypasses all workflows).
* Agenda Status changed to dynamically computed.
* Audit Logs set to permanent retention.
* Added mandatory revision notes for revision requests.
* Rejected content can be edited and submitted again.
* Approval metadata now stores:

  * approved_by
  * approved_at
* Added public document management module.
* Added category pages:

  * `/artikel/kategori/[slug]`
* Added document search support to global search.

#### Public Website

* Added `/dokumen` route.
* Updated sitemap structure.
* Updated homepage search scope.

#### Authentication

* Clarified distinction between:

  * Authentication emails
  * Business workflow notifications

Authentication emails remain supported:

* Invite Link
* Password Reset

Business workflow emails are not included in MVP.

---

### Fixed

#### Documentation Consistency

* Refactored `DOCUMENTATION_RULES.md` to strictly focus on documentation standards (removed AI orchestration rules, added structural templates, naming conventions, and ADR/Feature standards).
* Synced PRD with Decision Updates.
* Synced Public Sitemap with latest product decisions.
* Synced Tech Stack documentation with authentication requirements.
* Resolved documentation inconsistencies discovered during audit review.

---

### Removed

#### MVP Scope

* Dedicated public tag pages:

  * `/artikel/tag/[slug]`

Tags remain available as metadata and filters only.

---

## Versioning Strategy

### MAJOR

Increment when:

* Breaking architectural changes
* Major business workflow changes
* Database redesign

Example:

```text
1.0.0 → 2.0.0
```

---

### MINOR

Increment when:

* New feature modules added
* New pages added
* New workflows added

Example:

```text
1.0.0 → 1.1.0
```

---

### PATCH

Increment when:

* Documentation fixes
* Small improvements
* Bug fixes
* Non-breaking changes

Example:

```text
1.0.0 → 1.0.1
```

---

## Changelog Rules

Every change affecting:

* Requirements
* Database
* Permissions
* APIs
* Architecture
* Design System

must update this file.

A task is not considered complete until the changelog has been updated.
