# DATABASE_SCHEMA.md

## Purpose

Dokumen ini mendefinisikan struktur data utama CMS HMI Cabang Semarang.

Schema dirancang untuk:

* 1 Cabang
* ±36 Komisariat
* Workflow Review
* Multi Periode Kepengurusan
* Audit Log
* Notification System
* Cadre Verification
* Public Website

---

# 1. Enums

## UserRole

```txt
SYSTEM_ADMIN
ADMIN_CABANG
ADMIN_KOMISARIAT
```

---

## ArticleStatus

```txt
DRAFT
SUBMITTED
REVISION
APPROVED
PUBLISHED
REJECTED
ARCHIVED
```

---

## AgendaStatus

```txt
DRAFT
SUBMITTED
REVISION
APPROVED
PUBLISHED
REJECTED
ARCHIVED
```

---

## ProfileSubmissionStatus

```txt
DRAFT
SUBMITTED
REVISION
APPROVED
REJECTED
```

---

## GalleryStatus

```txt
DRAFT
PUBLISHED
ARCHIVED
```

---

## DocumentStatus

```txt
DRAFT
PUBLISHED
ARCHIVED
```

---

## ReviewAction

```txt
APPROVED
REJECTED
REVISION_REQUESTED
```

---

## VerificationStatus

```txt
PENDING
VERIFIED
REJECTED
```

---

# 2. Core Tables

## users

Purpose:

Menyimpan akun login CMS.

Fields:

* id
* role
* email
* password_hash
* commissariat_id (nullable)
* last_login_at
* created_at
* updated_at
* archived_at

Relationships:

```txt
User
N:1
Commissariat
```

nullable untuk:

* SYSTEM_ADMIN
* ADMIN_CABANG

---

## commissariats

Purpose:

Data master komisariat (Published Profile).

Fields:

* id
* name
* slug
* logo_url
* campus_name
* about
* chairman_name
* chairman_about
* cadre_count
* secretariat_photo_url
* map_url
* instagram_url
* address
* is_active
* created_at
* updated_at

Relationships:

```txt
Commissariat
1:N
Articles

Commissariat
1:N
Agendas

Commissariat
1:N
CadreVerifications

Commissariat
1:N
ProfileSubmissions
```

---

## commissariat_profile_submissions

Purpose:

Store pending profile changes separately from the published commissariat profile.

Fields:

* id
* commissariat_id
* status
* name
* logo_url
* campus_name
* about
* chairman_name
* chairman_about
* secretariat_photo_url
* map_url
* instagram_url
* address
* submitted_at
* approved_at
* approved_by
* created_by
* updated_by
* created_at
* updated_at

Relationships:

```txt
Commissariat
1:N
ProfileSubmissions

ProfileSubmission
1:N
ReviewHistory
```

---

# 3. Article Module

## article_categories

Fields:

* id
* name
* slug
* is_active

Relationship:

```txt
Category
1:N
Articles
```

---

## tags

Fields:

* id
* name
* slug
* is_active

---

## article_tags

Purpose:

Many-to-Many bridge.

Fields:

* article_id
* tag_id

---

## articles

Fields:

* id

* commissariat_id

* category_id

* title

* slug

* excerpt

* content

* featured_image_url

* author_name

* author_commissariat

* status

* submitted_at

* approved_at

* published_at

* approved_by

* created_by

* updated_by

* created_at

* updated_at

* deleted_at

* deleted_by

Relationships:

```txt
Commissariat
1:N
Articles

Category
1:N
Articles

Articles
N:M
Tags

Article
1:N
ReviewHistory
```

---

# 4. Agenda Module

## agendas

Fields:

* id

* commissariat_id (nullable)

* title

* slug

* flyer_url

* description

* short_description

* start_datetime

* end_datetime

* location_name

* location_url

* status

* submitted_at

* approved_at

* published_at

* approved_by

* created_by

* updated_by

* created_at

* updated_at

* deleted_at

* deleted_by

Relationships:

```txt
Commissariat
1:N
Agendas
```

nullable = agenda cabang.

---

## agenda_links

Purpose:

CTA buttons.

Fields:

* id

* agenda_id

* title

* url

* sort_order

Relationship:

```txt
Agenda
1:N
AgendaLinks
```

---

# 5. Gallery Module

## gallery_albums

Fields:

* id

* title

* slug

* description

* cover_image_url

* status

* created_by

* updated_by

* created_at

* updated_at

* deleted_at

* deleted_by

Relationships:

```txt
GalleryAlbum
1:N
GalleryPhotos
```

---

## gallery_photos

Fields:

* id

* album_id

* image_url

* caption

* sort_order

* created_at

---

# 6. Document Module

## document_categories

Fields:

* id
* name
* slug
* is_active

---

## documents

Fields:

* id

* category_id

* title

* slug

* description

* file_url

* file_size

* status

* published_at

* created_by

* updated_by

* created_at

* updated_at

* deleted_at

* deleted_by

Relationships:

```txt
DocumentCategory
1:N
Documents
```

---

# 7. Review Workflow

## review_histories

Purpose:

Menyimpan seluruh histori review.

Fields:

* id

* entity_type

* entity_id

* reviewer_id

* action

* note

* created_at

Supported Entity:

```txt
ARTICLE
AGENDA
COMMISSARIAT_PROFILE
```

---

# 8. Cadre Verification

## cadre_verifications

Fields:

* id

* commissariat_id

* file_url

* row_count

* status

* note

* verified_by

* verified_at

* created_at

Relationships:

```txt
Commissariat
1:N
CadreVerification
```

Public cadre count:

```txt
latest VERIFIED row_count
```

---

# 9. Organization Module

## periods

Fields:

* id

* name

* start_year

* end_year

* is_active

* created_at

---

## positions

Fields:

* id

* period_id

* name

* layout_type

* sort_order

Relationships:

```txt
Period
1:N
Position
```

---

## board_members

Fields:

* id

* period_id

* position_id

* full_name

* photo_url

* short_bio (maks 200 karakter)

* social_links (JSON array `{ platform, url }`, menggantikan `instagram_url`)

* university_id (FK → universities, kampus asal pengurus)

* commissariat_id (FK → commissariats, komisariat asal pengurus)

* created_at

Relationships:

```txt
Position 1:N BoardMember
University 1:N BoardMember
Commissariat 1:N BoardMember
```

> Catatan: grup tata letak kartu ditentukan oleh `positions.layout_type` (`KSB` | `KETUA_BIDANG` | `LAINNYA`). Kewajiban field (foto, nama, jabatan, kampus, komisariat) diberlakukan di level validasi server; kolom DB tetap nullable.

---

# 10. Notifications

## notifications

Fields:

* id

* user_id

* title

* message

* type

* link_url

* is_read

* created_at

Relationships:

```txt
User
1:N
Notification
```

---

# 11. Audit Log

## audit_logs

Fields:

* id

* actor_id

* entity_type

* entity_id

* action

* old_data

* new_data

* ip_address

* browser

* device

* created_at

Retention:

Permanent

---

# 12. Website Settings

## website_settings

Purpose:

Single configuration table.

Fields:

* id

* site_name

* logo_url

* favicon_url

* seo_title

* seo_description

* contact_email

* instagram_url

* address

* footer_text

* created_at

* updated_at

Expected Rows:

```txt
1
```

Singleton table.

---

# 13. Ownership Rules

ADMIN_KOMISARIAT hanya dapat mengakses:

```txt
articles.commissariat_id
=
current_user.commissariat_id

agendas.commissariat_id
=
current_user.commissariat_id

cadre_verifications.commissariat_id
=
current_user.commissariat_id

commissariat_profile_submissions.commissariat_id
=
current_user.commissariat_id
```

---

# 14. Soft Delete Strategy

Soft Delete Enabled:

* Articles
* Agendas
* Gallery Albums
* Documents

Fields:

```txt
deleted_at
deleted_by
```

No soft delete:

* Commissariats
* Categories
* Tags
* Periods

Menggunakan:

```txt
is_active
```

atau

```txt
archived
```

---

# 15. Recommended Indexes

Users

* email (unique)
* commissariat_id

Commissariats

* slug (unique)

Commissariat Profile Submissions

* commissariat_id
* status

Articles

* slug (unique)
* status
* commissariat_id
* category_id
* published_at

Agendas

* slug (unique)
* status
* start_datetime
* end_datetime

Documents

* slug (unique)
* category_id

Cadre Verifications

* commissariat_id
* status

Notifications

* user_id
* is_read

Review Histories

* entity_type, entity_id (composite)

Audit Logs

* actor_id
* entity_type
* created_at
