# API Specification

## Purpose
Dokumen ini mendefinisikan kontrak komunikasi, validasi, dan otorisasi *server-side* untuk CMS HMI Cabang Semarang, dengan memprioritaskan arsitektur **Next.js Server Actions**.

---

## 1. API Architecture

### Pendekatan Server Actions First
Semua mutasi data (Create, Update, Delete) di dalam CMS akan menggunakan **Next.js Server Actions**. 
* **Alasan:** Menjamin tipe data (*end-to-end type safety*) antara antarmuka klien dan server, menghilangkan *boilerplate* REST API (seperti rute `fetch`, *method checking*), dan terintegrasi mulus dengan *Progressive Enhancement* pada Form React 19.

### Pengecualian (Kapan menggunakan Route Handlers)
REST API (Route Handlers `app/api/...`) hanya diizinkan untuk:
1. *Webhooks* (misalnya notifikasi pembayaran, jika ada kelak).
2. Streaming file statis/dokumen berukuran sangat besar (*Signed URL Streaming*).
3. Integrasi pihak ketiga (Ekspor/Impor data).

### Data Flow Architecture
```txt
Client Component (Form)
      ↓ Memanggil Server Action
Server Action (Berjalan di Server)
      ↓ 1. Cek Sesi (Supabase Auth)
      ↓ 2. Validasi Hak Akses (Role/Ownership)
      ↓ 3. Validasi Data (Zod)
Prisma ORM (Di dalam Action)
      ↓
PostgreSQL (Supabase)
```

---

## 2. Authentication APIs

* **`login(credentials)`**: Mengotentikasi pengguna via Supabase Auth. Menyimpan *session cookie*.
* **`logout()`**: Menghapus *session cookie*.
* **`forgotPassword(email)`**: Mengirim email instruksi *reset password*.
* **`resetPassword(token, newPassword)`**: Menyimpan *password* baru.
* **`inviteUser(data)`**: 
  * **Permissions:** SYSTEM_ADMIN (Untuk semua), ADMIN_CABANG (Hanya untuk Komisariat).
  * **Workflow:** Membuat *magic link* di Supabase Auth, mengirim email, menambah entri ke tabel `users`.
* **`forceResetPassword(userId)`**:
  * **Permissions:** SYSTEM_ADMIN, ADMIN_CABANG. Mengirim email *reset password* paksa ke email tujuan.

---

## 3. Article APIs

Setiap aksi wajib menerima dan mengembalikan struktur tipe `ActionState` (dijelaskan di Bagian 15).

* **`createArticle(data)`** & **`updateArticle(id, data)`**
  * **Permissions:** SYSTEM_ADMIN, ADMIN_CABANG, ADMIN_KOMISARIAT.
  * **Rule:** Komisariat hanya dapat mengubah artikel dengan `status == DRAFT || REJECTED` miliknya sendiri.
* **`submitArticle(id)`**
  * Mengubah status menjadi `SUBMITTED`. Memicu **Notification** ke Admin Cabang.
* **`approveArticle(id, note)`** / **`rejectArticle(id, note)`** / **`requestArticleRevision(id, note)`**
  * **Permissions:** SYSTEM_ADMIN, ADMIN_CABANG.
  * **Side Effects:** Mengubah *status*, memasukkan entri ke `review_histories`, dan mengirim notifikasi ke Komisariat.
* **`publishArticle(id)`**
  * Mengubah status menjadi `PUBLISHED`, menyimpan `published_at`.
* **`archiveArticle(id)`** / **`restoreArticle(id)`** / **`softDeleteArticle(id)`**
  * **Permissions:** SYSTEM_ADMIN, ADMIN_CABANG, ADMIN_KOMISARIAT (hanya *delete draft* miliknya).

---

## 4. Agenda APIs

Memiliki struktur yang persis sama dengan Article APIs, beroperasi pada tabel `agendas` dan relasi `agenda_links`.

* **`createAgenda` / `updateAgenda` / `submitAgenda`**
* **`approveAgenda` / `rejectAgenda` / `requestAgendaRevision`**
* **`publishAgenda` / `archiveAgenda` / `restoreAgenda` / `softDeleteAgenda`**
* **Workflow:** Admin Komisariat membuat draf -> Cabang menyetujui -> Dipublikasikan di halaman publik.

---

## 5. Commissariat APIs (Profile Review)

Beroperasi pada tabel `commissariats` dan `commissariat_profile_submissions`.

* **`updateProfileDraft(commissariat_id, data)`**
  * **Permissions:** ADMIN_KOMISARIAT.
  * **Action:** Membuat/mengubah baris di `commissariat_profile_submissions` dengan status `DRAFT`.
* **`submitProfileReview(submission_id)`**
  * Mengubah status *submission* menjadi `SUBMITTED`.
* **`approveProfile(submission_id, note)`**
  * **Permissions:** ADMIN_CABANG, SYSTEM_ADMIN.
  * **Workflow:** 
    1. Update status *submission* menjadi `APPROVED`.
    2. *Copy* field-field dari *submission* ke dalam tabel utama `commissariats`.
    3. Tulis *audit log* dan *review history*.
* **`rejectProfile(submission_id, note)`** / **`requestProfileRevision(...)`**
  * Memperbarui status *submission* tanpa menyentuh tabel `commissariats`.

---

## 6. Cadre Verification APIs

* **`uploadVerificationFile(formData)`**
  * Mengunggah file ke folder Cloudinary `secure-verifications` (melalui Cloudinary SDK).
  * Memasukkan entri ke `cadre_verifications` dengan status `PENDING`.
* **`approveVerification(id, rowCount)`**
  * **Permissions:** ADMIN_CABANG, SYSTEM_ADMIN.
  * **Action:** Update status ke `VERIFIED`, memasukkan `row_count` yang disetujui, mencatat `verified_by`.
* **`rejectVerification(id, note)`**
  * Menolak verifikasi.

---

## 7. Gallery APIs

Hanya dapat dikelola oleh ADMIN_CABANG dan SYSTEM_ADMIN.

* **`createAlbum(data)`** / **`updateAlbum(id, data)`**
* **`publishAlbum(id)`** / **`archiveAlbum(id)`**
* **`uploadPhoto(albumId, formData)`**
  * Mengunggah gambar beresolusi tinggi ke folder Cloudinary `public-media`, lalu menyisipkan URL hasil optimasi `webp`/`avif` ke `gallery_photos`.
* **`reorderPhotos(albumId, orderArray)`**
  * Memperbarui kolom `sort_order` pada kumpulan ID gambar secara massal.

---

## 8. Document APIs

Hanya dikelola oleh ADMIN_CABANG dan SYSTEM_ADMIN.

* **`createDocument(data, file)`** / **`updateDocument(id, data)`**
  * Mengunggah PDF ke folder Cloudinary `secure-documents` menggunakan otentikasi privat.
* **`publishDocument(id)`** / **`archiveDocument(id)`**
* **`downloadDocument(id)`**
  * Action ini memvalidasi permintaan, mencatat analitik jika diperlukan, dan mengembalikan *Signed URL* dari Supabase Storage.

---

## 9. Organization APIs (Periods & Positions)

* **`createPeriod(data)`** / **`activatePeriod(id)`** / **`archivePeriod(id)`**
* **`createPosition(data)`** / **`updatePosition(id, data)`**
* **`createBoardMember(data)`** / **`updateBoardMember(id, data)`**
  * Mengunggah foto pengurus ke `public-media` (jika ada) dan menautkannya ke `board_members`.

---

## 10. Taxonomy APIs

* **`createCategory(data)`** / **`updateCategory(...)`** / **`archiveCategory(...)`**
* **`createTag(data)`** / **`updateTag(...)`** / **`archiveTag(...)`**

---

## 11. Notification APIs

* **`listNotifications()`**: Mengambil notifikasi dengan *infinite scrolling* menggunakan React Query.
* **`markAsRead(notificationId)`**: Mengubah `is_read = true`.

---

## 12. Audit Log Behavior

**Mekanisme Otomatis pada Setiap Server Action Mutasi:**
Semua aksi Create/Update/Delete akan memanggil fungsi utilitas pembungkus (misal `withAuditLog`) yang melakukan:
* **Actor Tracking:** Mengekstrak ID Pengguna dari sesi Supabase Auth.
* **IP & Browser Tracking:** Mengekstrak informasi dari `headers().get('x-forwarded-for')` dan `headers().get('user-agent')`.
* **Database Action:** Menggunakan *Prisma Transaction* untuk memastikan perubahan data dan penyimpanan *Audit Log* (beserta nilai `old_data` dan `new_data`) disimpan serentak secara atomik.

---

## 13. Storage APIs

Manajemen unggahan disentralisasi ke dalam fungsi pustaka (seperti `uploadFileToStorage`).

* **Validasi File (Zod di Action):**
  * Media (Logo, Flyer, Gallery): `.jpg`, `.png`, `.webp`, `.svg`. Maksimal: 2MB.
  * Verifikasi Kader: `.xlsx`, `.xls`, `.csv`. Maksimal: 5MB.
  * Dokumen: `.pdf`. Maksimal: 10MB.
* **Media Optimization Pipeline:**
  * Kompresi dan optimasi gambar akan dilayani *on-the-fly* oleh komponen `next/image` di sisi klien. Supabase Storage murni sebagai tempat penyimpanan file asli.

---

## 14. Validation Strategy

* **Placement:**
  * Skema Zod umum diletakkan di `shared/schemas` (contoh: `PaginationSchema`, `ImageUploadSchema`).
  * Skema khusus aksi diletakkan di dalam folder fitur: `features/article/model/schemas.ts`.
* **Validation Flow:**
  1. *Action* menerima `FormData` atau objek *payload*.
  2. Divalidasi via `zodSchema.safeParse(data)`.
  3. Jika gagal, kembalikan objek `FieldErrors` ke klien untuk dirender di komponen UI (Form React Hook).

---

## 15. Error Handling Strategy

Semua Server Action harus mengembalikan struktur standar ini (tanpa melontarkan *unhandled exception* ke klien):

```ts
export type ActionState<T = any> = {
  success: boolean;
  message: string;          // Pesan sukses/gagal yang ramah pengguna
  data?: T;                 // Data yang dikembalikan jika sukses
  fieldErrors?: Record<string, string[]>; // Error spesifik pada form (Zod)
  errorCode?: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'SERVER_ERROR';
};
```
* Pengecekan otorisasi yang gagal mengembalikan `UNAUTHORIZED`.
* `try-catch` harus menangkap *error* *database* dan mengembalikan pesan yang aman tanpa membocorkan skema SQL ke klien.

---

# 16. Final Readiness Assessment

Are we ready for:
**DESIGN.md**

**YES**

**Alasan:**
Dokumen ini dengan ketat telah mengunci lapisan kontrak (*contract layer*) antara *frontend* dan *backend*. Kita telah memutuskan:
1. Tidak ada REST API kuno; kita menggunakan **Server Actions** dan integrasi Zod penuh.
2. Respons *error* memiliki struktur yang sangat terstandarisasi.
3. Semua tanggung jawab *permission* dan otorisasi dari `ROLE_PERMISSION_MATRIX` telah dikaitkan dengan fungsi API spesifiknya.
4. *Side-effects* krusial (seperti *Audit Log* dan Notifikasi) telah didefinisikan sebagai kewajiban di setiap *action*.

Karena semua aturan manipulasi data sudah terkunci kuat, kita kini dapat fokus memikirkan wajah (*User Interface*) dan bahasa desain dari aplikasi ini dalam `DESIGN.md`.
