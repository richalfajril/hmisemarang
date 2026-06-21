# 003 - Database Readiness & Refinements

# Pre-Database Architecture Decisions

This document outlines the product decisions finalized after the pre-database design review.

## 1. Article Categories
Relationship: `Article N:1 Category`
Rules:
* One article can only belong to one category.
* Categories are managed by ADMIN_CABANG.
Examples: Berita, Opini, Kajian, Kegiatan, Rilis Resmi, Pernyataan Sikap.
Note: No article-category junction table required.

## 2. Article Tags
Relationship: `Article N:M Tag`
Rules:
* One article may have multiple tags.
* Tags are managed by ADMIN_CABANG.
Examples: Perkaderan, Advokasi, Kampus, Nasional.
Note: Article-tag junction table is required.

## 3. Document Categories
Relationship: `Document N:1 Category`
Rules:
* One document belongs to one category only.
* Categories are managed by ADMIN_CABANG.
Examples: AD/ART, SOP, PO, Surat Keputusan, Dokumen Kaderisasi.
Note: No document-category junction table required.

## 4. Review History
Do NOT store revision notes directly on Article, Agenda, or Commissariat. Create a dedicated Review History entity.
Relationship: `Content 1:N ReviewHistory`
Applies To: Article, Agenda, Commissariat Profile.
ReviewHistory stores: `reviewer_id`, `action`, `note`, `created_at`.
Actions: `APPROVED`, `REJECTED`, `REVISION_REQUESTED`.
Note: Revision history must be preserved permanently.

## 5. Cadre Verification
Create a dedicated Cadre Verification entity.
Workflow: Upload Excel → Pending Verification → Verified or Rejected
Store: `commissariat_id`, `file_url`, `row_count`, `status`, `verified_by`, `verified_at`, `note`.
Note: Public cadre count must come from the latest VERIFIED record.

## 6. Gallery Workflow
Gallery Albums support status workflow.
Statuses: Draft, Published, Archived.
Workflow: Draft → Published → Archived.
Note: No review process required. Only ADMIN_CABANG manages galleries.

## 7. Soft Delete Strategy
Soft delete is allowed for: Articles, Agendas, Gallery Albums, Documents.
Soft delete fields: `deleted_at`, `deleted_by`.

Do NOT soft delete: Commissariats, Periods, Categories, Tags.
Instead use: `is_active` or `archived`.
Reason: Prevent orphaned published content.
If a commissariat still owns published content: Soft delete is not allowed. System must prevent deletion.

## 8. SYSTEM_ADMIN Capabilities
SYSTEM_ADMIN may bypass all workflows.
Examples: Direct Publish, Direct Approval, Force Reset Password, Change Email, Manage All Content.
SYSTEM_ADMIN acts as platform owner/developer role.

## 9. Agenda Status
Do NOT store agenda status in database. Compute dynamically.
Rules:
* `today < start_date` → Akan Datang
* `today between start_date and end_date` → Berlangsung
* `today > end_date` → Selesai

## 10. Audit Log Retention
Keep audit logs permanently. No retention limit required for MVP.
