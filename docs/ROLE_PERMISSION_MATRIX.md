# ROLE_PERMISSION_MATRIX.md

Dokumen ini mendefinisikan hak akses (permissions), batasan akses data, dan kepemilikan data (ownership) untuk setiap role dalam CMS HMI Cabang Semarang.

---

# 1. Roles

## SYSTEM_ADMIN

Platform Owner / Developer.

Hak akses:

* Full Access
* Bypass Workflow
* Direct Approval
* Direct Publish
* Change Email
* Force Reset Password
* Manage All Data
* View All Audit Logs

---

## ADMIN_CABANG

Administrator tingkat Cabang.

Hak akses:

* Global Access
* Review & Approval
* Manage Website
* Manage Taxonomy
* Manage Commissariats
* Manage Organization Structure
* Manage Documents
* Manage Galleries
* View Audit Logs

---

## ADMIN_KOMISARIAT

Administrator tingkat Komisariat.

Hak akses:

* Scoped Access
* Manage Own Content
* Submit Content For Review
* Manage Own Commissariat Profile
* Upload Cadre Verification Data

Tidak dapat mempublikasikan konten secara langsung.

---

# 2. Permission Matrix

Legend:

* ✅ Allowed
* ❌ Denied
* ✅* Allowed only for own commissariat

---

# 2.1 Authentication & Account Management

| Action                            | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| --------------------------------- | ------------ | ------------ | ---------------- |
| Login                             | ✅            | ✅            | ✅                |
| Logout                            | ✅            | ✅            | ✅                |
| Change Own Password               | ✅            | ✅            | ✅                |
| Change Own Email                  | ✅            | ✅            | ❌                |
| Send Invite Link (Cabang)         | ✅            | ❌            | ❌                |
| Send Invite Link (Komisariat)     | ✅            | ✅            | ❌                |
| Force Reset Password (Cabang)     | ✅            | ❌            | ❌                |
| Force Reset Password (Komisariat) | ✅            | ✅            | ❌                |
| Archive User Account              | ✅            | ✅            | ❌                |

---

# 2.2 Dashboard Access

| Action                    | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| ------------------------- | ------------ | ------------ | ---------------- |
| View Cabang Dashboard     | ✅            | ✅            | ❌                |
| View Komisariat Dashboard | ✅            | ❌            | ✅*               |

---

# 2.3 Website Settings

| Action                     | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| -------------------------- | ------------ | ------------ | ---------------- |
| Manage Website Settings    | ✅            | ✅            | ❌                |
| Manage SEO Settings        | ✅            | ✅            | ❌                |
| Manage Contact Information | ✅            | ✅            | ❌                |
| Manage Social Media Links  | ✅            | ✅            | ❌                |

---

# 2.4 Taxonomy Management

## Article Categories

| Action           | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| ---------------- | ------------ | ------------ | ---------------- |
| Create Category  | ✅            | ✅            | ❌                |
| Edit Category    | ✅            | ✅            | ❌                |
| Archive Category | ✅            | ✅            | ❌                |

---

## Article Tags

| Action      | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| ----------- | ------------ | ------------ | ---------------- |
| Create Tag  | ✅            | ✅            | ❌                |
| Edit Tag    | ✅            | ✅            | ❌                |
| Archive Tag | ✅            | ✅            | ❌                |

---

## Document Categories

| Action           | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| ---------------- | ------------ | ------------ | ---------------- |
| Create Category  | ✅            | ✅            | ❌                |
| Edit Category    | ✅            | ✅            | ❌                |
| Archive Category | ✅            | ✅            | ❌                |

---

# 2.5 Audit Log

| Action          | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| --------------- | ------------ | ------------ | ---------------- |
| View Audit Logs | ✅            | ✅            | ❌                |

---

# 2.6 Commissariat Management

| Action                      | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| --------------------------- | ------------ | ------------ | ---------------- |
| Create Commissariat Account | ✅            | ✅            | ❌                |
| Archive Commissariat        | ✅            | ✅            | ❌                |
| Edit Commissariat Profile   | ✅            | ✅            | ✅*               |
| Submit Profile For Review   | ✅            | ❌            | ✅*               |
| Approve Profile             | ✅            | ✅            | ❌                |
| Reject Profile              | ✅            | ✅            | ❌                |
| Request Profile Revision    | ✅            | ✅            | ❌                |
| View Review History         | ✅            | ✅            | ✅*               |

---

# 2.7 Cadre Verification

| Action                     | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| -------------------------- | ------------ | ------------ | ---------------- |
| Upload Verification File   | ✅            | ❌            | ✅*               |
| View Verification Status   | ✅            | ✅            | ✅*               |
| Download Verification File | ✅            | ✅            | ❌                |
| Approve Verification       | ✅            | ✅            | ❌                |
| Reject Verification        | ✅            | ✅            | ❌                |

---

# 2.8 Article Management

| Action              | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| ------------------- | ------------ | ------------ | ---------------- |
| Create Draft        | ✅            | ✅            | ✅*               |
| Edit Article        | ✅            | ✅            | ✅*               |
| Submit For Review   | ✅            | ❌            | ✅*               |
| Approve Article     | ✅            | ✅            | ❌                |
| Reject Article      | ✅            | ✅            | ❌                |
| Request Revision    | ✅            | ✅            | ❌                |
| Publish Article     | ✅            | ✅            | ❌                |
| Soft Delete Article | ✅            | ✅            | ✅*               |
| Restore Article     | ✅            | ✅            | ❌                |
| View Review History | ✅            | ✅            | ✅*               |

### Notes

ADMIN_KOMISARIAT may delete only:

* Draft
* Rejected

articles belonging to their own commissariat.

---

# 2.9 Agenda Management

| Action              | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| ------------------- | ------------ | ------------ | ---------------- |
| Create Draft        | ✅            | ✅            | ✅*               |
| Edit Agenda         | ✅            | ✅            | ✅*               |
| Submit For Review   | ✅            | ❌            | ✅*               |
| Approve Agenda      | ✅            | ✅            | ❌                |
| Reject Agenda       | ✅            | ✅            | ❌                |
| Request Revision    | ✅            | ✅            | ❌                |
| Publish Agenda      | ✅            | ✅            | ❌                |
| Soft Delete Agenda  | ✅            | ✅            | ✅*               |
| Restore Agenda      | ✅            | ✅            | ❌                |
| View Review History | ✅            | ✅            | ✅*               |

### Notes

ADMIN_KOMISARIAT may delete only:

* Draft
* Rejected

agendas belonging to their own commissariat.

---

# 2.10 Gallery Management

| Action            | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| ----------------- | ------------ | ------------ | ---------------- |
| Create Album      | ✅            | ✅            | ❌                |
| Upload Photos     | ✅            | ✅            | ❌                |
| Publish Album     | ✅            | ✅            | ❌                |
| Archive Album     | ✅            | ✅            | ❌                |
| Soft Delete Album | ✅            | ✅            | ❌                |
| Restore Album     | ✅            | ✅            | ❌                |

Workflow:

Draft → Published → Archived

---

# 2.11 Document Management

| Action               | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| -------------------- | ------------ | ------------ | ---------------- |
| Upload Document      | ✅            | ✅            | ❌                |
| Edit Document        | ✅            | ✅            | ❌                |
| Publish Document     | ✅            | ✅            | ❌                |
| Archive Document     | ✅            | ✅            | ❌                |
| Soft Delete Document | ✅            | ✅            | ❌                |
| Restore Document     | ✅            | ✅            | ❌                |

Workflow:

Draft → Published → Archived

---

# 2.12 Organization & Period Management

| Action               | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| -------------------- | ------------ | ------------ | ---------------- |
| Create Period        | ✅            | ✅            | ❌                |
| Archive Period       | ✅            | ✅            | ❌                |
| Manage Positions     | ✅            | ✅            | ❌                |
| Manage Board Members | ✅            | ✅            | ❌                |

---

# 2.13 Notifications

| Action                    | SYSTEM_ADMIN | ADMIN_CABANG | ADMIN_KOMISARIAT |
| ------------------------- | ------------ | ------------ | ---------------- |
| View Notifications        | ✅            | ✅            | ✅                |
| Mark Notification As Read | ✅            | ✅            | ✅                |

---

# 3. Ownership Rules

ADMIN_KOMISARIAT hanya dapat mengakses data yang memiliki:

```text
commissariat_id = current_user.commissariat_id
```

Berlaku untuk:

* Articles
* Agendas
* Commissariat Profile
* Cadre Verification
* Review History

---

# 4. Workflow Bypass Rules

SYSTEM_ADMIN dapat melewati seluruh workflow sistem.

Contoh:

* Direct Publish Article
* Direct Publish Agenda
* Direct Approve Profile
* Direct Approve Cadre Verification

---

# 5. Approval Metadata

Setiap approval wajib menyimpan:

* approved_by
* approved_at

Berlaku untuk:

* Articles
* Agendas
* Commissariat Profiles
* Cadre Verification
