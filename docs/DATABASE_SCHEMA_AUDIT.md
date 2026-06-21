# Database Schema Audit

## 1. Missing Tables

**PASS.** 
All entities defined in the PRD and Decision documents are correctly modeled as tables. The schema effectively separates master data, content modules, pivot tables (`article_tags`), and polymorphic workflows (`review_histories`, `audit_logs`).

---

## 2. Missing Fields

* **Missing Workflow Fields (BLOCKER):** The `commissariats` table is missing fields to support the Profile Review workflow. It requires:
  * `status` (Enum: DRAFT, SUBMITTED, REVISION, APPROVED, REJECTED)
  * `submitted_at`
  * `approved_at`
  * `approved_by`
* **Missing UI/Layout Fields (SHOULD FIX):** The `positions` table is missing a `layout_type` field (e.g., `KSB` vs `Kabid`) which was referenced in the PRD for rendering the organizational structure page.
* **Missing SEO Fields (NICE TO HAVE):** Content entities like `articles` and `agendas` could benefit from explicit `seo_title` and `seo_description` fields, though they can fall back to `title` and `excerpt`.

---

## 3. Relationship Audit

**PASS.**
* **One-to-Many:** Relationships like `Category 1:N Articles`, `Commissariat 1:N Agendas`, and `Period 1:N Position` are accurately defined.
* **Many-to-Many:** `Articles N:M Tags` is properly bridged via the `article_tags` pivot table.
* **Polymorphic:** `review_histories` elegantly uses `entity_type` and `entity_id` to handle Article, Agenda, and Profile reviews without duplicating tables.

---

## 4. Permission Coverage Audit

* **Gaps Identified:**
  * **Submit Profile For Review / Approve Profile:** These permissions from `ROLE_PERMISSION_MATRIX.md` **cannot be enforced** because the `commissariats` table lacks a `status` field to track whether the profile is currently Draft, Submitted, or Approved.

All other permissions (scoped content creation, global management, soft deletes) are fully supported by the current fields (`commissariat_id`, `deleted_at`, `is_active`).

---

## 5. Workflow Coverage Audit

* **Article Workflow:** Fully supported (`status`, `approved_by`, `published_at`).
* **Agenda Workflow:** Fully supported.
* **Gallery Workflow:** Fully supported (`status`).
* **Document Workflow:** Fully supported (`status`, `published_at`).
* **Cadre Verification Workflow:** Fully supported (`status`, `verified_by`, `verified_at`).
* **Commissariat Profile Workflow:** **UNSUPPORTED** (Due to the missing workflow fields identified in Category 2).

---

## 6. Soft Delete Audit

**PASS.**
The schema consistently implements the soft delete strategy defined in `DECISION_UPDATE_003.md`:
* `deleted_at` and `deleted_by` are correctly applied to `articles`, `agendas`, `gallery_albums`, and `documents`.
* `commissariats`, `article_categories`, `tags`, and `periods` correctly omit soft delete fields and use `is_active` or `archived_at` instead.

---

## 7. Notification Audit

**PASS.**
The `notifications` table includes `user_id`, `title`, `message`, `type`, `link_url`, and `is_read`. This is comprehensive and fully supports in-app notifications with contextual routing.

---

## 8. Audit Log Audit

**PASS.**
The `audit_logs` table includes `actor_id`, `entity_type`, `entity_id`, `action`, `old_data`, and `new_data`. This fully supports tracking "who did what, when, and to what entity" for permanent retention.

---

## 9. Performance Audit

**Missing Indexes:**
* **`review_histories`:** Needs a composite index on `(entity_type, entity_id)`. Querying polymorphic relations without indexes will cause severe full-table scans.
* **`users`:** Needs an index on `commissariat_id` for quick role/scoped authorization checks.
* **`cadre_verifications`:** Needs a composite index on `(commissariat_id, status)` because the public site must query "the latest VERIFIED row count per commissariat".

**Scalability Concerns:**
* For 36+ commissariats and thousands of articles, standard Postgres B-Tree indexes are perfectly fine. 
* The `audit_logs` table is set to "Permanent" retention. While "thousands" of logs is trivial, over several years this could reach millions. No immediate schema changes are needed for MVP, but future partitioning by `created_at` might be required.

---

## 10. Final Verdict

### Classifications

**BLOCKER:**
* The `commissariats` table must have `status`, `submitted_at`, `approved_at`, and `approved_by` fields added to support the Profile Review Workflow.
* `review_histories` must have a composite index on `(entity_type, entity_id)` to prevent severe performance degradation on the Review Center dashboard.

**SHOULD FIX:**
* Add `layout_type` to `positions`.
* Add indexes to `users.commissariat_id` and `cadre_verifications.commissariat_id`.

**NICE TO HAVE:**
* Add SEO fields to `articles` and `agendas`.

---

**NOT READY**

The schema is 95% complete and beautifully structured, but it is currently **NOT READY** for FSD Architecture or API Specification until the blocker fields are added to the `commissariats` table.
