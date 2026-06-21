# SKILLS.md: Implementation Standards & Coding Conventions

## Purpose
Dokumen ini menetapkan standar implementasi, konvensi kode, dan panduan praktis untuk pengembangan **HMI Semarang CMS**. Dokumen ini menjadi referensi teknis primer bagi pengembang dan agen AI dalam menyusun fitur aplikasi.

---

## 1. General Principles

* **Simplicity First:** Pilihlah solusi paling sederhana yang menyelesaikan masalah. Hindari abstraksi dini.
* **Readability over Cleverness:** Kode akan lebih sering dibaca daripada ditulis. Kode bergaya deklaratif dan eksplisit lebih disukai daripada kode cerdik satu baris (*one-liner*) yang sulit dipahami.
* **Consistency over Personal Preference:** Patuhi pola yang sudah ditetapkan dalam panduan arsitektur FSD. Jangan menggunakan pola desain pribadi yang menyimpang dari standar tim.
* **Documentation-Driven Development:** 
  * Ikuti dokumentasi yang ada sebelum menulis baris kode pertama.
  * *Never invent architecture:* Jangan pernah merancang ulang fondasi lapisan di luar batasan FSD.
  * *Never bypass documented workflows:* Alur kerja spesifik (seperti *Profile Review Workflow*) harus diikuti secara ketat.

---

## 2. TypeScript Conventions

* **Strict Mode:** TypeScript `strict` selalu aktif.
* **No `any`:** Penggunaan `any` dilarang mutlak. Gunakan `unknown` jika tipe benar-benar tidak terprediksi, lalu lakukan *type narrowing*.
* **Type over Interface:** Selalu gunakan `type` untuk mendefinisikan bentuk data (`type User = {}`), kecuali jika Anda memerlukan ekstensibilitas (seperti *declaration merging*).
* **Explicit Return Types:** Fungsi publik (terutama Server Actions) harus mendefinisikan tipe kembaliannya secara eksplisit.

**Contoh:**
```typescript
export type ActionState<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getUserProfile(userId: string): Promise<ActionState<User>> {
  // implementation
}
```

---

## 3. Naming Conventions

Pemberian nama file dan struktur diwajibkan mematuhi standar repositori tunggal berikut:

* **Folders:** Seluruh map wajib menggunakan `kebab-case`. Contoh: `article-management`, `review-center`.
* **Next.js Routes:** Seluruh direktori rute *App Router* dan file spesifiknya wajib mematuhi aturan kerangka kerja (semua huruf kecil). Contoh: `app/dashboard/page.tsx`.
* **React Components:** File antarmuka (*UI*, *Widget*, *Feature*) wajib menggunakan `PascalCase.tsx`. Contoh: `ArticleCard.tsx`, `Button.tsx`.
* **Hooks:** File fungsi reaktif wajib menggunakan struktur `useSomething.ts`. Contoh: `useAuth.ts`.
* **Server Actions:** Seluruh titik akhir mutasi wajib menggunakan file statis bernama `actions.ts`.
* **Validation:** File validasi tipe Zod wajib dinamai `schema.ts`.
* **Types / Interfaces:** Deklarasi *TypeScript* wajib diletakkan di `types.ts` dengan penamaan variabel tipe *PascalCase*.
* **Constants & Configs:** File penyimpan statis dinamai `constants.ts` dan `config.ts`.
* **Utilities:** File fungsi murni pembantu (*Helpers*) wajib menggunakan `kebab-case.ts`. Contoh: `format-date.ts`.
* **Enums:** *PascalCase* untuk nama *enum*, dan *UPPER_SNAKE_CASE* untuk nilainya. Contoh: `UserRole.SYSTEM_ADMIN`.

---

## 4. FSD Conventions

Patuh pada FSD_ARCHITECTURE.md:

* **app:** Pengaturan kerangka utama (Router, Global Layouts, Providers). Jangan letakkan logika bisnis di sini.
* **pages:** Halaman Next.js (komposisi dari Widget dan Features).
* **widgets:** Blok UI independen yang bisa digunakan ulang (mis. `Navbar`, `Sidebar`, `ArticleTable`). Boleh mengimpor *Features* dan *Entities*.
* **features:** Logika bisnis spesifik atau aksi pemicu interaksi (mis. formulir buatan/edit). Boleh mengimpor *Entities*.
* **entities:** Domain terisolasi murni (model data `User`, `Article`, tipe Zod). Hanya boleh mengimpor dari `shared`.
* **shared:** Kode independen yang digunakan di mana-mana (UI komponen shadcn, utilitas, `supabase` client, `prisma` client).

**Aturan Kepemilikan (Ownership Rules):**
Lapisan yang lebih rendah **tidak boleh** mengimpor lapisan yang lebih tinggi (contoh: `shared` tidak boleh mengimpor `features`).
Lapisan dengan tingkat yang sama **tidak boleh** saling mengimpor langsung kecuali didesain sebagai *public API*.

---

## 5. React Conventions

* **Server Components by Default:** Secara asali, semua komponen harus merupakan React Server Components (RSC) untuk memaksimalkan kinerja beban awal dan interaksi basis data tanpa *overhead* API.
* **Client Components:** HANYA gunakan `"use client"` di baris paling atas apabila komponen Anda membutuhkan:
  * *Hooks* state React (`useState`, `useEffect`, `useReducer`).
  * *Event listeners* browser (`onClick`, `onChange`).
  * Integrasi pustaka sisi klien pihak ketiga (Zustand, React Hook Form).
* Jangan menjadikan letak formulir raksasa sebagai Server Component; jadikan klien.

---

## 6. Next.js App Router Conventions

* **Route Structure:** Direktori mencerminkan URL rute fisik (misal: `src/app/dashboard/articles/page.tsx`).
* **Layouts:** Gunakan `layout.tsx` untuk UI pembungkus persisten antar navigasi (navigasi sisi kiri CMS).
* **loading.tsx:** Wajib disediakan di dalam modul CMS untuk transisi pemuatan *suspense*, tetapi fallback visual boleh kosong agar navigasi tidak menampilkan placeholder kerangka.
* **error.tsx:** Wajib ada untuk menangkap kegagalan fatal rendering sisi server.
* **not-found.tsx:** Sesuaikan untuk Website Publik (halaman atraktif 404) dan CMS (tampilan error dashboard).

---

## 7. Server Actions Conventions

* **Location:** Di dalam `features/{nama-fitur}/model/actions.ts`.
* **Naming:** Menggunakan skema `doSomethingAction` (mis. `createArticleAction`).
* **Rules:**
  1. **Authorization First:** Periksa hak akses Supabase *Session* & kecocokan `UserRole` pengguna dengan entitas yang dimanipulasi.
  2. **Validation Second:** *Parse* secara aman *payload* masukan dengan Zod.
  3. **Business Logic Third:** Lakukan interaksi basis data.

---

## 8. Prisma Conventions

* **Client Location:** Inisialisasi dilakukan sebagai *Singleton* di `src/shared/api/prisma/client.ts`.
* **Query Patterns:** Sebisa mungkin ambil relasi sekaligus menggunakan `include` untuk menghindari *duplicated queries* (N+1 query problem).
* **Transaction Usage:** Untuk mutasi jamak yang bersinggungan erat (misal: "Approve Article" diikuti "Create Audit Log" dan "Create Notification"), semua **wajib** dibungkus dalam kueri `$transaction`.

---

## 9. Supabase Conventions

* **Auth:** Verifikasi sesi *server-side* selalu merujuk pada *helper* `@supabase/ssr` `createServerClient`.
* **Storage Interaction:** Agent harus memisahkan unggahan file ke layanan eksternal (Cloudinary). Server Action mengurus *buffer* ke API Cloudinary.
* **Bucket Usage:** Folder `public-media` untuk foto logo/galeri (bisa dibaca dunia), `secure-documents` dan `secure-verifications` di Cloudinary diakses khusus.
* **Service Role Key:** Kunci *Service Role* (`SUPABASE_SERVICE_ROLE_KEY`) TIDAK BOLEH sekalipun dibocorkan ke *Client Component*.

---

## 10. TanStack Query Conventions

* **When to use:** Operasi asinkron pembacaan (*read*) dari sisi klien (pencarian teks *real-time*, paginasi tanpa pindah halaman, filter dinamis).
* **When NOT to use:** Jangan gunakan untuk memicu *Server Actions* mutasi. Mutasi sebaiknya menggunakan `useActionState` atau interupsi dasar React Hook Form.
* **Rules:** Konsisten dalam penamaan *Query Keys* (mis. `['articles', { status: 'PUBLISHED', page: 1 }]`). Eksekusi fungsi `queryClient.invalidateQueries` setelah mutasi *Server Actions* sukses agar *client state* tidak kadaluarsa.

---

## 11. Zustand Conventions

* **Allowed Use Cases Only:** Gunakan murni untuk *UI State* persisten sisi klien, seperti status bilah navigasi samping (*sidebar collapse*), filter pencarian global sementara, atau status *wizard modal multi-step*.
* **Do NOT use for Server Data:** *Fetch/Cache* data server wajib menggunakan TanStack Query.

---

## 12. React Hook Form Conventions

* **Form Architecture:** Formulir harus diekstrak di dalam struktur lapisan *Feature*.
* **Validation Flow:** Resolver form harus menggunakan integrasi Zod (`zodResolver`).
* **Submission Flow:**
  1. Pengguna klik submit.
  2. RHF memvalidasi dengan Zod.
  3. Jika gagal, RHF menampilkan peringatan merah bawah kolom.
  4. Jika sukses, jalankan asinkronus pemanggilan *Server Action*. Set *UI loading spinner* dari fungsi transisi React.

---

## 13. Zod Conventions

* **Schema Location:** Ditempatkan dekat entitas yang berelasi atau dalam `/features/{nama}/model/schema.ts`.
* **Naming:** Menggunakan akhiran `Schema` (misal: `createArticleSchema`).
* **Shared Schemas:** Ekstrak Zod ekstensif (seperti validasi nomor HP atau panjang *string*) untuk digunakan secara *universal*.
* **Server & Client Validation:** Skema Zod yang sama *WAJIB* digunakan oleh *React Hook Form* di sisi klien dan oleh `parse` di dalam *Server Action* untuk menjamin sekuritas lapisan server.

---

## 14. UI Conventions (Based on DESIGN.md)

* **Buttons:** `default` (Aksi Utama), `secondary` (Alternatif), `destructive` (Bahaya), `ghost` (Ikon/Aksi minor). Tombol wajib memiliki varian *loading spinner* saat asinkron berjalan.
* **Cards:** Beri batas jelas antar kartu untuk form input dan ringkasan data.
* **Dialogs/Drawers:** Jangan pakai dialog untuk *form* raksasa melebihi 1 layar. Gunakan halaman terpisah. Drawers digunakan untuk *mobile UX*.
* **Forms:** Label berposisi atas (*top-aligned*). Bintang merah untuk tanda wajib isi.
* **Empty States & Loading States:** Sajikan fallback kosong saat *loading* rute/widget, spinner untuk aksi eksplisit, dan kotak pesan grafis bersahabat saat entitas berstatus kosong.

---

## 15. Data Table Conventions (CMS)

* **Search:** Filter teks sederhana sudut kiri atas.
* **Filters:** *Dropdown* filter status di sisi kanan atas.
* **Pagination:** Navigasi angka dan "Sebelasnya/Selanjutnya" pada dasar tabel jika data melampaui limit.
* **Actions Column:** Baris kolom sejajar (*pinned right*) dengan ikon 3 titik yang men-trigger *Dropdown Menu*.

---

## 16. Error Handling Conventions

* **User-Facing Errors:** Pesan UI ramah (*toast* atau *alert box*). Misal: "Gagal menyimpan draf, mohon periksa koneksi."
* **Validation Errors:** Tampil langsung sebagai anotasi merah di bawah kolom input formulir.
* **Permission Errors:** Tampilan *Unauthorized* spesifik jika mencoba mengakali URL atau *Action*.
* **Unexpected Errors:** Cegat dan telan log rahasia ke konsol server; jangan tampilkan jejak tumpukan (*stack trace*) fatal ke pengguna di antarmuka publik.

---

## 17. Notification Conventions

* **When Created:** Notifikasi sistem hanya dilepas setelah suatu status *Action* berubah tervalidasi.
* **Contoh Kasus Wajib Notifikasi:**
  * Administrator Komisariat men-*submit* Artikel. (Notif ke Admin Cabang)
  * Admin Cabang *Approve* Artikel (Notif ke Admin Komisariat)
  * Verifikasi Kader (*Excel File*) berhasil di-Approve.

---

## 18. Audit Log Conventions

* **Which Actions:** Seluruh operasi `CREATE`, `UPDATE`, `DELETE` dan manipulasi status yang mengubah nilai inti database *WAJIB* dimasukkan ke *Audit Log*.
* **Metadata:** Log harus menampung `entity_type`, `entity_id`, ID aktor (siapa yang melalukan), serta *dump* singkat `old_data` dan `new_data` dalam format JSON.

---

## 19. Testing Conventions

* **Unit Testing:** Lakukan hanya untuk mengisolasi logika yang murni bisnis (seperti kalkulasi status kelolosan data atau algoritma transformasi utilitas).
* **Integration Testing:** Minimal pada alur kerja krusial (misal: "User A Submit, User B Meninjau, Status berubah").
* **Keep Lightweight:** Pada fase MVP, fokus pada integritas tipe kuat TypeScript daripada memaksakan pengujian *End-to-End* (*E2E*) masif yang merusak laju iterasi awal.

---

## 20. Definition of Done (DoD)

Sebuah modul / tiket tidak dapat dianggap selesai kecuali:
1. Implementasi kode tuntas tanpa *bug* kritikal.
2. Cek tipe asertif TypeScript 100% lolos (tanpa abaikan `// @ts-ignore`).
3. Linter (ESLint) bersih.
4. Dokumentasi teknis/Arsitektural di folder `docs/` disesuaikan jika ada penyimpangan signifikan dari rencana.
5. Menulis rangkuman di `CHANGELOG.md` (jika diminta dalam alur versi kerja).

---

## 21. AI Agent Implementation Rules

Segala eksekusi mandiri agen *Antigravity* / asisten AI diwajibkan tunduk pada konvensi ini, dipadukan dengan aturan `AGENTS.md`.

**Requirements for AI:**
* **Read First:** Wajib memindai `docs/` sebelum menulis atau mengubah alur sistemik yang mapan.
* **Plan First:** Gunakan berkas artefak `implementation_plan.md` di atas aksi refaktor besar (*planning_mode*).
* **Ask Open Questions:** Selalu ajukan pertanyaan via teks alih-alih meraba-raba intensi pengguna mengenai UX spesifik yang tak dimuat dalam dokumen.
* **Never Skip Validation:** Integrasi antarmuka wajib membawa penjagaan Zod untuk form masukan.
* **Never Bypass Architecture:** Paksa agen Anda menyusun komponen di polder yang direstui oleh *Feature-Sliced Design* (FSD). Jangan pernah mengotori map `src/app/` dengan *dumb UI components*.
