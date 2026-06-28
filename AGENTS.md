# AGENTS.md

Welcome. This document serves as the routing guide for AI Agents working on this project.

## Single Source of Truth

**Documentation is the ultimate source of truth.** All code must strictly follow the specifications outlined in the documentation. Do not invent new architecture, dependencies, or UI patterns without updating the documentation first.

## Required Reading

Before starting any feature implementation or refactoring, you MUST read the following documentation files to align with the project requirements:

### Core Project Documents

1. **[PRD](docs/PRD.md)** - Product Requirements Document outlining business goals, roles, and MVP scope.
2. **[ROADMAP](docs/ROADMAP.md)** - Project milestones, current features release checklist, and technical goals.
3. **[TECH_STACK](docs/TECH_STACK.md)** - Technology boundaries (Next.js App Router, Prisma, Supabase, Cloudinary) and banned dependencies.
4. **[DESIGN](docs/DESIGN.md)** - UI/UX standards, color scheme, typography, custom scrollbars, and animations.
5. **[SKILLS](docs/SKILLS.md)** - Detailed coding conventions, PascalCase UI files, react-hooks rules, and FSD boundaries.
6. **[DOCUMENTATION_RULES](docs/DOCUMENTATION_RULES.md)** - Guidelines for maintaining folder structure and Markdown styles.
7. **[CHANGELOG](docs/CHANGELOG.md)** - Historical registry of feature updates and FSD refactoring completions.

### Architecture & Database Specifications

8. **[FSD_ARCHITECTURE](docs/FSD_ARCHITECTURE.md)** - Specific Feature-Sliced Design layout mapping (`widgets/`, `features/`, `entities/`, `shared/` boundaries).
9. **[DATABASE_SCHEMA](docs/DATABASE_SCHEMA.md)** - Tables, relationships, enum configurations, and database triggers.
10. **[ROLE_PERMISSION_MATRIX](docs/ROLE_PERMISSION_MATRIX.md)** - Scoped access and RBAC matrix for SYSTEM_ADMIN, ADMIN_CABANG, and ADMIN_KOMISARIAT.
11. **[API_SPECIFICATION](docs/API_SPECIFICATION.md)** - Next.js Server Actions specifications, Zod validations, and error handling payload strategy.
12. **[FEATURES_DISCOVERY](docs/FEATURES_DISCOVERY.md)** - Component and action mapping checklist according to FSD logic.

### Environment & Deployment Guides

13. **[SUPABASE_SETUP](docs/SUPABASE_SETUP.md)** - Guidelines to setup Supabase instance and environment variables.
14. **[DEPLOYMENT](docs/DEPLOYMENT.md)** - Vercel staging/production builds and database migrations.
15. **[ENVIRONMENT_VARIABLES](docs/ENVIRONMENT_VARIABLES.md)** - Description of secret and public variables.
16. **[SITEMAP_PUBLIC](docs/SITEMAP_PUBLIC.md)** - Routing hierarchy for the public website.
17. **[SITEMAP_CMS](docs/SITEMAP_CMS.md)** - Routing and dashboard features hierarchy for the CMS.
18. **[GIT_WORKFLOW](docs/GIT_WORKFLOW.md)** - Version control conventions for branches, commits, and pull requests.

---

## Decisions (ADRs)

Refer to decisions in `docs/decisions/` to understand historical architectural trade-offs:

- **[001-single-nextjs-application](docs/decisions/001-single-nextjs-application.md)** - Opting for a single Next.js codebase over monorepo.
- **[002-feature-sliced-design](docs/decisions/002-feature-sliced-design.md)** - Folder structuring methodology under FSD.
- **[003-server-actions-for-mutations](docs/decisions/003-server-actions-for-mutations.md)** - Restricting database mutative triggers strictly to Server Actions.
- **[004-polymorphic-content-review](docs/decisions/004-polymorphic-content-review.md)** - Review flow architecture for articles and agendas.
- **[005-hybrid-soft-delete-strategy](docs/decisions/005-hybrid-soft-delete-strategy.md)** - Soft delete logic for volatile entities and `is_active` flags for master structures.
- **[006-application-level-authorization](docs/decisions/006-application-level-authorization.md)** - Layout middleware and action-level authorization boundaries.
- **[007-dual-entity-commissariat-profile](docs/decisions/007-dual-entity-commissariat-profile.md)** - Separation of draft profile submissions and published profiles.
- **[008-state-management-division](docs/decisions/008-state-management-division.md)** - Zustand for UI state and React Query for server data caching.
- **[001-authentication](docs/decisions/001-authentication.md)** - Authentication adjustments, metadata storage, and documents introduction.
- **[002-document-module](docs/decisions/002-document-module.md)** - Document module routing and workflows.
- **[003-database-readiness](docs/decisions/003-database-readiness.md)** - Schema adjustments for tags, categories, and review history.
- **[004-cloudinary-migration](docs/decisions/004-cloudinary-migration.md)** - Deciding on Cloudinary as the media repository instead of Supabase Storage.

---

## Features Scope

Verify each module implementation constraints under `docs/features/`:

- **[authentication](docs/features/authentication.md)** - Login, session management, and redirection rules.
- **[dashboard](docs/features/dashboard.md)** - Statistics leaderboard widget, audit logger integration, and notifications.
- **[article](docs/features/article.md)** - Tiptap rich-text writing, soft-delete, and draft flow.
- **[agenda](docs/features/agenda.md)** - Event scheduler calendar forms and external registration urls.
- **[gallery](docs/features/gallery.md)** - Album photo gallery sequential uploader and cover selections.
- **[document](docs/features/document.md)** - Administrative PDF document lists and downloads.
- **[commissariat](docs/features/commissariat.md)** - Dual-stage profile submit form and approval panel.
- **[cadre-verification](docs/features/cadre-verification.md)** - Excel document uploader and audit logs count mapping.
- **[content-review](docs/features/content-review.md)** - Unified polymorphic review workflow board.
- **[organization](docs/features/organization.md)** - Periods, positions, and executive board lists.
- **[taxonomy](docs/features/taxonomy.md)** - CRUD interfaces for article tags, article categories, and document categories.
- **[user-management](docs/features/user-management.md)** - Administrator control over credentials, commissions, and session invalidation.
- **[website-settings](docs/features/website-settings.md)** - Global site SEO titles, favicon, and contact info settings.
- **[notifications](docs/features/notifications.md)** - Bell dropdown interface and mark-as-read actions.
- **[audit-log](docs/features/audit-log.md)** - Immutable system activities logger viewer.
- **[search](docs/features/search.md)** - Parallel command palette omnibox search.

---

## Agent Workflow & Planning Mode

As an AI Agent, you MUST follow this strict procedure when building or altering features:

1. **Implementation Plan First**: Always create an implementation plan artifact before writing or modifying any code.
2. **Open Questions**: If you have any clarifying questions or design ambiguities, embed them as "Open Questions" within the implementation plan.
3. **Stop & Wait**: STOP execution and allow the user to answer the open questions. Do NOT proceed to write code yet.
4. **Update the Plan**: Update the implementation plan to reflect the user's answers.
5. **Manual Proceed Required**: You MUST STOP again and wait for the user to explicitly read the plan and say "proceed" (or click proceed) before you execute any commands or file changes.
6. **Unplanned Adjustments**: Any adjustments or revisions made mid-flight MUST be PROACTIVELY documented in the version of `ROADMAP.md` and `CHANGELOG.md` whose focus matches the context of the adjustment. Do this immediately without waiting for the user to remind you.

---

# Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase? Reuse the helper, util, or pattern that's already here, don't re-write it.
3. Does the standard library already do this? Use it.
4. Does a native platform feature cover it? Use it.
5. Does an already-installed dependency solve it? Use it.
6. Can this be one line? Make it one line.
7. Only then: write the minimum code that works.

The ladder runs after you understand the problem, not instead of it: read the task and the code it touches, trace the real flow end to end, then climb.

Bug fix = root cause, not symptom: a report names a symptom. Grep every caller of the function you touch and fix the shared function once — one guard there is a smaller diff than one per caller, and patching only the path the ticket names leaves a sibling caller still broken.

Rules:

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins, but only once you understand the problem. The smallest change in the wrong place isn't lazy, it's a second bug.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Pick the edge-case-correct option when two stdlib approaches are the same size, lazy means less code, not the flimsier algorithm.
- Mark intentional simplifications with a `ponytail:` comment. If the shortcut has a known ceiling (global lock, O(n²) scan, naive heuristic), the comment names the ceiling and the upgrade path.

Not lazy about: understanding the problem (read it fully and trace the real flow before picking a rung, a small diff you don't understand is just laziness dressed up as efficiency), input validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs (the platform is never the spec ideal, a clock drifts, a sensor reads off), anything explicitly requested. Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind, the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.

(Yes, this file also applies to agents working on the ponytail repo itself. Especially to them.)
