# 002 - Document Module

# Document Module Workflow

## Decision

Document Module menggunakan draft workflow.

Workflow:

Draft
→ Published
→ Archived

---

## Ownership

ADMIN_CABANG

---

## Create Document

Admin Cabang dapat:

* Create Draft
* Edit Draft
* Publish Document
* Archive Document
* Soft Delete Document

---

## Document Status

Draft

Published

Archived

Deleted (Soft Delete)

---

## No Review Process

Karena hanya ADMIN_CABANG yang memiliki akses membuat dokumen.

Tidak diperlukan:

* Submitted
* Revision
* Approval

---

## Document Data

Required:

* Title
* Category
* PDF File

Optional:

* Description

---

## Public Visibility

Draft:
Not Visible

Published:
Visible

Archived:
Not Visible

Deleted:
Not Visible

---

## Public Page

Route:

/dokumen

Features:

* Search
* Filter Category
* Pagination
* View PDF
* Download PDF

Pagination:

10 items per page

---

## Future Scope

Potential:

* Document Versioning
* Download Statistics
* Multiple File Formats
* Document Access Control
