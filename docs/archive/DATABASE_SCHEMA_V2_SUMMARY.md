# DATABASE_SCHEMA_V2_SUMMARY.md

## Database Schema Refinement (V2)

Following the database audit and architectural review, the schema has been refined to resolve all blockers and address recommended improvements. The primary focus of this update is the architectural restructuring of the Commissariat Profile Review Workflow.

---

### 1. Changes Made

* **Profile Submissions Table:** Created a new dedicated table `commissariat_profile_submissions`. This table mirrors the editable fields of the `commissariats` table but functions strictly as a draft/review container.
* **Profile Status Enum:** Added `ProfileSubmissionStatus` (DRAFT, SUBMITTED, REVISION, APPROVED, REJECTED) to manage the state machine of the submission.
* **Layout Type Added:** Added `layout_type` to the `positions` table to support UI rendering logic (e.g., KSB vs Kabid layouts).
* **Indexes Optimized:** Added missing critical indexes to prevent full-table scans:
  * `users(commissariat_id)`
  * `cadre_verifications(commissariat_id, status)`
  * `commissariat_profile_submissions(commissariat_id, status)`
  * `review_histories(entity_type, entity_id)` (composite index)

---

### 2. New Relationships

The introduction of the submission table introduces two new core relationships:
* `Commissariat 1:N ProfileSubmissions`: A single commissariat can have a history of many profile update submissions over time.
* `ProfileSubmission 1:N ReviewHistory`: When a submission is reviewed, the revision notes and feedback are tied to the submission record via the polymorphic `review_histories` table.

---

### 3. Workflow Impact

The **Profile Review Workflow** is now fully unblocked and architecturally sound:

**The "Draft vs Published" Isolation:**
1. The `commissariats` table now represents the **Published/Public** state. It remains highly stable and guarantees zero public downtime.
2. When `ADMIN_KOMISARIAT` edits their profile, a new record is created in `commissariat_profile_submissions` with the status `DRAFT` or `SUBMITTED`.
3. The public website continues to read safely from the `commissariats` table.
4. `ADMIN_CABANG` reviews the `commissariat_profile_submissions` record. The frontend can now easily query both tables to present a side-by-side **Visual Diff** of the proposed changes versus the current published profile.
5. Upon approval, the backend automatically copies the approved values from the submission table into the main `commissariats` table.

---

### 4. Final Readiness Verdict

**READY**

All identified blockers from the Database Schema Audit have been resolved. The schema now fully supports every requirement, permission, and workflow defined in the PRD and Role Permission Matrix. The database design phase is officially complete.

The project is fully prepared for the next phase:
* **FSD_ARCHITECTURE.md**
* **API_SPECIFICATION.md**
