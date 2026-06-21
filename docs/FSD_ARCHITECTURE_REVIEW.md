# FSD Architecture Review

This document audits the proposed Feature-Sliced Design (FSD) architecture for the HMI Semarang CMS to validate its suitability before proceeding to the API Specification phase.

---

## 1. Layer Audit

**Review:** The architecture successfully adopts the 6 standard FSD layers: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.

**Findings:**
* **Unnecessary Layers:** None. The deliberate exclusion of the `processes` layer is a good architectural decision, as it prevents overengineering.
* **Overengineering Risk (`pages` vs `app`):** Using both an `app/` folder (for Next.js routing) and a `pages/` folder (for FSD UI composition) is pure FSD, but can introduce boilerplate. For a mid-sized CMS, developers sometimes compose UI directly inside `app/[route]/page.tsx` using Widgets. 
* *Verdict:* Acceptable as is, but keeping `pages/` is strictly correct for FSD isolation.

---

## 2. Entity Audit

**Review:** Entities mapped: `article`, `agenda`, `commissariat`, `profile-submission`, `gallery`, `document`, `user`, `organization`, `taxonomy`, `notification`, `audit-log`, `review-history`.

**Findings:**
* **Missing Entity:** The `website-settings` entity (defined in the database) is missing from the FSD entity mapping.
* **Boundaries:** Good boundary separation. `profile-submission` and `commissariat` are currently separate entities, which perfectly mirrors the database draft/publish architecture. 
* *Verdict:* Solid boundaries, but `website-settings` must be added.

---

## 3. Feature Audit

**Review:** Features mapped: `auth`, `content-review`, `cadre-verification`, `profile-management`, `article-management`, `agenda-management`.

**Findings:**
* **Missing Features:** 
  * `gallery-management` (upload photos, reorder, create album)
  * `document-management` (upload PDF, manage metadata)
  * `user-management` (invite users, force reset password)
  * `taxonomy-management` (manage categories/tags)
* **Oversized Features:** `content-review` handles Approve/Reject for Articles, Agendas, and Profiles. Because `review_histories` is polymorphic, grouping them into one feature is highly cohesive and DRY (Don't Repeat Yourself).
* *Verdict:* Solid decomposition, but the missing CRUD features must be explicitly acknowledged during implementation.

---

## 4. Widget Audit

**Review:** Public widgets (Hero, Carousels) and CMS widgets (Review Center, Dashboard Stats).

**Findings:**
* **Ownership & Composition Rules:** The defined rule ("Widgets do not contain complex data mutation logic, only compose features") is the golden standard for FSD. 
* *Verdict:* Perfectly mapped.

---

## 5. Shared Layer Audit

**Review:** `api`, `config`, `constants`, `hooks`, `lib`, `schemas`, `types`, `ui`, `utils`.

**Findings:**
* **Misplaced Logic:** None identified. Placing Prisma and Supabase client instantiations inside `shared/api` is standard practice. Placing Shadcn UI inside `shared/ui` ensures all entities and features share the exact same design system.
* *Verdict:* Clean and robust.

---

## 6. Import Rules Audit

**Review:** `app` → `pages` → `widgets` → `features` → `entities` → `shared`.

**Findings:**
* No violations. The documentation explicitly bans `entities` from importing `features` and bans `shared` from importing anything above it. This prevents the dreaded circular dependency issue common in React codebases.

---

## 7. Prisma Integration Audit

**Review:** Client in `shared/api/prisma.ts`. Access restricted to Next.js Server Actions.

**Findings:**
* The decision to encapsulate Prisma logic inside `entities/{entity}/api/actions.ts` or `features/{feature}/api/actions.ts` is excellent. It ensures that the database is never accidentally queried from a Client Component.

---

## 8. Supabase Integration Audit

**Review:** Auth via `@supabase/ssr`, Storage in `shared/lib/storage.ts`.

**Findings:**
* Bucket access architecture (using `SUPABASE_SERVICE_ROLE_KEY` inside Server Actions for `secure-verifications`) ensures that sensitive cadre excel files are never leaked to the browser.
* *Verdict:* Secure and compliant with the PRD.

---

## 9. Scalability Audit

**Review:** Support for 36+ commissariats, future modules, future contributors.

**Findings:**
* **36+ Commissariats:** Easily handled because state is synchronized via TanStack Query (Server State), meaning the frontend won't choke on large datasets.
* **Future Modules:** Adding a new module (e.g., E-Voting) simply means creating `entities/e-voting` and `features/voting-management`. It will not cause regressions in the Article or Agenda modules.
* **Future Contributors:** FSD drastically reduces onboarding time because developers instantly know where to look for business logic (`features`) vs UI components (`entities/ui`).

---

## 10. Final Verdict

### Classifications

**BLOCKER:**
* None.

**SHOULD FIX:**
* Add `website-settings` to the entity layer.
* Explicitly map missing management features (`gallery-management`, `document-management`, `user-management`, `taxonomy-management`, `organization-management`) during implementation.

**NICE TO HAVE:**
* The team should decide whether to strictly use the `pages` folder or compose directly inside the `app` folder `page.tsx` files to save on boilerplate. Both approaches are FSD-compliant in Next.js.

---

**READY**

Are we ready for **API_SPECIFICATION.md**?

**YES**

The FSD Architecture is highly stable, modular, and directly mirrors the database and permission requirements. By strictly coupling Prisma Server Actions to specific Features and Entities, we have a clear blueprint of exactly which API endpoints / Server Actions need to be designed. We can now proceed to define the exact input schemas, output payloads, and authorization rules for the API.
