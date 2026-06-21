# CHANGELOG.md

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

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
