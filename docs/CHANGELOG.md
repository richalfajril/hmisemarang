# CHANGELOG.md

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## [Unreleased]

### Added

#### Dark / Light Theme Toggle (2026-06-23)
* Wired up `next-themes` `ThemeProvider` (class-based, `defaultTheme="light"`) in the root `Providers`. The `.dark` CSS variables already existed in `globals.css`.
* Added a `ThemeToggle` button (Sun/Moon) placed in `SiteHeader` immediately to the **left of the notification bell**. Hydration-safe (renders icon only after mount).
* Board member card name/position font sizes bumped to match the reference proportions (name → `text-xl` 20px, jabatan → `text-base` 16px; jabatan area height widened to fit two lines).

#### Redesigned Kepengurusan Workflow — Period → Pengurus → Flip Cards (2026-06-23)
* **DB migration** on `BoardMember`: added `social_links` (JSON array, replaces single `instagram_url`), `university_id` + `commissariat_id` (FKs → University/Commissariat), and `created_at`; added back-relations on `University` & `Commissariat`. `Position.layout_type` now carries the layout group (`KSB` | `KETUA_BIDANG` | `LAINNYA`).
* **Tambah Periode** modal (`CreatePeriodModal`): create a new period + multi positions in one step, each position assigned a layout group. Button "Simpan & Susun Pengurus" redirects straight to the period detail page (action returns the new `periodId`).
* **Susunan Kepengurusan** page: a "Tambah Pengurus" modal (`TambahPengurusModal`) with foto (1:1, required), nama, jabatan (combobox), kampus & komisariat (comboboxes) — all required — plus optional multi social links (default 1 Instagram, "Tambah Sosmed" button) and a ≤200-char bio with counter.
* **Flip cards** (`PengurusCard`): front shows photo + name (green, larger, bold) + position + social icons below; clicking flips to reveal bio, kampus, komisariat. Edit/Delete shown only when `editable` (dashboard); reusable for the public page later with `editable={false}`.
* Added **`react-icons`** (Font Awesome 6 brands) for proper social-media brand icons (Instagram, X/Twitter, LinkedIn, Facebook, YouTube, TikTok), since Lucide dropped brand icons. Scoped to social platforms only; Lucide remains the primary icon set. Documented in `TECH_STACK.md`.
* **Layout grouping** (`SusunanKepengurusan`): KSB row (centered, Ketua in middle), Ketua Bidang grid (newest top-left), and Lainnya grid, with tight section spacing.
* **Kelola Jabatan** section retained on the detail page (add/rename/delete jabatan + change layout group) so the position combobox stays current.
* New/updated server actions: `createPositionStructureAction` (new-period only, returns `periodId`), `createBoardMemberAction`/`updateBoardMemberAction` (full fields + required validation), `updatePositionAction`/`createPositionAction` (accept layout group). Removed the obsolete `PositionList` component.
* **Period edit now reuses the Tambah Periode modal**: clicking Edit in the period row opens the same `CreatePeriodModal` (years + jabatan list + layout groups) in edit mode with the button relabeled "Simpan Perubahan". New `updatePeriodStructureAction` updates the year range and syncs positions (rename/regroup/reorder existing by row id, create new rows, delete removed rows incl. their members). Removed the standalone `EditPeriodModal`.
* Fixed: the period **Hapus** action is no longer disabled for the active period — it is now clickable, and the active-period safety guard is enforced (with message) inside `deletePeriodAction`/the confirmation dialog.

### Changed

#### Consolidated "Jabatan" Management into the Organization Module (2026-06-23)
* Removed the "Jabatan" tab from the Taxonomy page (and its `JabatanTaxonomyTable` flat list) — position/period data belongs to the Organization module, not taxonomy (which is for classification labels). Taxonomy now only manages Article/Document categories, Tags, and Universities.
* Moved `CreatePositionStructureModal` from `taxonomy/ui` to `organization/ui` (now an in-slice import, FSD-compliant) and made it the primary action on the Periods page (`/dashboard/organization/periods`), replacing the old `CreatePeriodModal`. It creates a new period + multiple positions at once, or appends positions to an existing period via a searchable Combobox.
* Removed the now-unused `CreatePeriodModal` component and `createPeriodAction` server action.
* Added per-position **Edit/rename** (new `EditPositionModal` using the existing `updatePositionAction`) to `PositionList` on the period detail page, so the rename capability from the dropped flat table is preserved.
* Cleaned up `revalidatePath('/dashboard/taxonomy')` calls in the organization actions (no longer relevant).

### Added

#### Period (Riwayat Kepengurusan) Edit, Archive & Delete Actions (2026-06-23)
* Added `updatePeriodAction` (edit start/end year with auto-regenerated period name and duplicate-year guard) and `deletePeriodAction` (cascade-deletes the period with all its positions & board members) in the organization actions.
* Added `archivePeriodAction` (soft delete): deactivates the active period via `is_active=false` — the structure data is preserved but no longer shows on the public homepage. No DB migration; reuses the existing active/inactive flag.
* `deletePeriodAction` refuses to delete the currently active period — another period must be activated first — to avoid wiping the live public structure.
* Added "Edit", "Arsipkan" (shown only for the active period), and "Hapus" items to the period row action dropdown in `PeriodList`, with new `EditPeriodModal` and a `DeletePeriodModal` confirmation dialog (showing affected position count). The Delete item is disabled for the active period; archived periods stay listed with the existing "Arsip" badge and can be re-activated.

#### Taxonomy Edit Action & Jabatan Structure Tab (2026-06-23)
* Added `updateTaxonomyAction` server action enabling full CRUD on simple taxonomies (Article Category, Document Category, Tag, University); the URL slug is intentionally preserved on rename to avoid breaking public/SEO links.
* Added an "Edit" action (with `EditTaxonomyModal`) to every taxonomy table row's action dropdown alongside the existing Archive/Activate toggle.
* Added a new "Jabatan" tab to the Taxonomy page that reuses the existing `Period` + `Position` models as a single source of truth shared with the Organization module (no DB migration).
* Added `createPositionStructureAction` (creates one Period plus multiple Positions in a single transaction via a combined modal) and `updatePositionAction` (rename a position) in the organization actions.
* New components: `CreatePositionStructureModal` (year inputs + dynamic multi-position list) and `JabatanTaxonomyTable` (flat list showing each position with its period/year, with inline Edit and Delete).
* `CreatePositionStructureModal` now supports two modes via a toggle: **"Periode yang ada"** (pick an existing period through a searchable `Combobox`; new positions are appended with continuing `sort_order`) or **"Buat periode baru"** (creates the period + positions). Defaults to existing-period mode when at least one period exists. `createPositionStructureAction` branches on a `mode` field accordingly.
* The dynamic position list in `CreatePositionStructureModal` uses a fixed-height window (`h-[min(432px,46vh)]`, ~10 rows) that reserves roomy empty space when there are few rows and scrolls internally for long lists, keeping the modal within the viewport.

### Changed

#### Sidebar & Dropdown Navigation for ADMIN_KOMISARIAT (2026-06-23)
* Added "Profil Komisariat" as a dedicated sidebar menu item below "Dasbor", visible exclusively for `ADMIN_KOMISARIAT` role, linking to `/dashboard/profile`.
* Removed "Profil Saya" dropdown item from NavUser for `ADMIN_KOMISARIAT` since the sidebar item replaces it; non-komisariat roles (`ADMIN_CABANG`, `SYSTEM_ADMIN`) retain "Profil Saya" in their dropdown as before.
* Extended `NavUser` component to accept a `role` prop for conditional rendering of dropdown items.
* Unified the user profile card placement into `SidebarFooter` for all roles (including `ADMIN_KOMISARIAT`), restoring its original bottom-of-sidebar position instead of the header.
* Added subtle horizontal padding to the sidebar header, content, and footer (`px-3` / `px-1`) so navigation items are no longer flush against the edge.

### Removed

#### Dark Mode Toggle (2026-06-23)
* Removed `ThemeToggle` component from `SiteHeader`. Project now focuses exclusively on light theme.

#### Dashboard Skeleton Loading UI (2026-06-22)
* Removed dashboard skeleton placeholder rendering from route `loading.tsx` files and granular `<Suspense>` fallbacks while preserving the App Shell streaming boundaries.
* Removed unused shared skeleton UI helpers from `src/shared/ui/`.
* Removed the sidebar menu skeleton export and the image uploader pulse placeholder accent.

### Added

#### Dashboard UI Adjustments (2026-06-23)
* `SiteHeader` now dynamically resolves page title from `pathname` instead of static "Dasbor" text. Added `py-2` vertical padding.
* `GlobalSearch` trigger is now icon-only on mobile (`w-9 h-9`), and expands to a 2x wider searchbar (`w-64` on tablet, `w-80` on desktop) with text on `sm:` breakpoint.
* `PageHeader` standardized: heading capped at `text-2xl` (24px), subheading set to `text-xs`, icon max `h-8 w-8` (32px).
* Sidebar auto-closes on mobile when navigating to subpages via `NavMain` pathname change detection.
* `KelolaJabatanSection` refactored into `KelolaJabatanModal` dialog, triggered from a button next to "Tambah Pengurus" on the organization period page.
* Fixed inconsistent gap between position names and Instagram icons in `PengurusCard` by allowing natural text height and pushing icons with fixed top margin.

#### University Taxonomy & Searchable Combobox Standardization (2026-06-23)
* Created `University` model in Prisma schema with `name`, `slug`, `is_active` fields and relational links to `Commissariat` and `CommissariatProfileSubmission`.
* Added `university_id` foreign key to `Commissariat` and `CommissariatProfileSubmission` models.
* Built reusable `Combobox` component (`src/shared/ui/Combobox.tsx`) using Popover + Command (cmdk) for searchable dropdown pattern.
* Extended Taxonomy CRUD actions and toggle status to support `UNIVERSITY` type, with RBAC enforcement for `SYSTEM_ADMIN` and `ADMIN_CABANG`.
* Added "Universitas" tab to Taxonomy management page.
* Converted `ProfileForm` campus field from text input to University Combobox dropdown.
* Converted `ArticleForm` category and commissariat selects to searchable Combobox components.

#### Table UX Standardization (2026-06-23)
* Standardized all table action columns to use DropdownMenu with `MoreHorizontal` icon trigger instead of inline buttons.
* Renamed "Tindakan" column header to "Aksi" across all 7 dashboard tables.
* Made all Badge/status labels `w-full` for consistent column alignment.
* Added `truncate` with `max-w-*` constraints on long-text table cells to prevent column overflow.
* Set consistent `h-12` minimum height on `TableRow` for uniform row spacing.
* Compacted `SmartPagination` padding to `py-2` while maintaining mobile touch targets.


#### Aggressive Internal Link Prefetch (2026-06-22)
* Added explicit `prefetch` props to known internal `next/link` navigation across dashboard layout, forms, lists, review center, notifications, and error pages.
* Guarded database-driven notification links so only internal paths are prefetched.
* Documented the internal prefetch convention in `docs/SKILLS.md`.

#### Dashboard Streaming & Skeleton Refactoring (2026-06-22)
* Removed global `loading.tsx` from dashboard root to prevent blocking the entire layout on navigation.
* Refactored `RecentActivityWidget`, `PendingQueueWidget`, and `LeaderboardWidget` to internally handle their own `<Suspense>` boundaries.
* Widget shells (Cards, Headers, Titles) now render synchronously at `0ms` delay, while inner data fetches stream dynamically with granular row-level skeletons.

#### Role-Based Sidebar Navigation (2026-06-22)
* Implemented Role-Based Access Control (RBAC) filtering for the dashboard sidebar based on `ROLE_PERMISSION_MATRIX.md`.
* `layout.tsx` now directly queries Prisma (`User` table) to securely retrieve the user's role without relying on potentially stale Supabase JWT metadata.
* `AppSidebar.tsx` intelligently filters its navigation menus so that `ADMIN_KOMISARIAT` only sees relevant features (Articles, Agendas, Notifications, Cadre Verification, Dashboard), hiding administrative tools reserved for `ADMIN_CABANG` and `SYSTEM_ADMIN`.

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
