# Design System & UI/UX Guidelines

## Purpose
Dokumen ini mendefinisikan prinsip-prinsip desain antarmuka, identitas merek, sistem warna, dan panduan komponen untuk HMI Semarang CMS. Dokumen ini didasarkan murni pada konfigurasi teknis yang saat ini terpasang (Tailwind CSS v4 & shadcn/ui).

---

## 1. Design Principles

* **Consistency:** Elemen UI yang berulang (seperti *form*, tabel, dan tombol) harus berperilaku dan terlihat persis sama di seluruh modul CMS.
* **Clarity:** Fungsi utama layar harus segera dikenali tanpa instruksi tambahan. Hindari *cognitive overload*.
* **Accessibility:** Semua elemen interaktif harus dapat dijangkau oleh *keyboard* dan memiliki rasio kontras warna yang baik (WCAG).
* **Performance:** Animasi hanya digunakan untuk *micro-interactions* (seperti *hover* atau *loader*). Jangan gunakan animasi masuk (*fade-in* berlebihan) yang memperlambat rendering konten teks utama.
* **Content-First Design:** Desain harus mengabdi pada konten (Artikel, Agenda), bukan sebaliknya. UI hanya bertindak sebagai bingkai penyaji.
  * **Public Website:** Fokus pada *Readability* dan pemuatan awal yang sangat cepat.
  * **CMS Dashboard:** Fokus pada *Data Density*, navigasi cepat, dan pembedahan status alur kerja (seperti Draf vs Disetujui).

---

## 2. Brand Identity

Sistem ini merepresentasikan **HMI Cabang Semarang**.
* **Visual Direction:** Profesional, modern, namun sangat menghormati nilai organisatoris. Antarmuka harus terasa solid dan terpercaya.
* **Design Goals:** Menyeimbangkan nuansa portal berita modern dengan perangkat kerja administratif internal (CMS) yang rapi.
* **Readability:** Prioritas absolut. Kontras teks harus tajam, ukuran *font* ideal untuk bacaan panjang (artikel dan draf kajian).

---

## 3. Color System

Sistem warna ini menggunakan format `oklch` bawaan dari inisialisasi awal (*preset* khusus dengan identitas Hijau HMI).

**Token Aktual (Berdasarkan `globals.css`):**
* `--background` / `--foreground`: Latar belakang utama halaman dan teks utamanya.
* `--primary` / `--primary-foreground`: Menggunakan warna hijau khas HMI (`oklch(0.508 0.118 165.612)`). Untuk tombol aksi utama, tautan aktif, dan penekanan visual.
* `--secondary` / `--secondary-foreground`: Latar belakang komponen netral dan tombol sekunder.
* `--muted` / `--muted-foreground`: Teks tambahan (*hints*, tanggal) dan *state* nonaktif.
* `--accent` / `--accent-foreground`: Status *hover* atau elemen dekoratif ringan.
* `--card` / `--card-foreground`: Latar belakang kartu penampung data.
* `--popover` / `--popover-foreground`: Latar belakang *dropdown*, *tooltip*, dan menu konteks.
* `--border` / `--input` / `--ring`: Batas garis elemen, batas kolom *input*, dan cincin fokus *keyboard*.
* `--sidebar` (dan kawan-kawan): Token warna terpisah khusus untuk navigasi CMS.

**Semantic Colors:**
* **Success:** *(Saat ini belum didefinisikan secara khusus di `globals.css`, sementara akan di-mapping ke skema utilitas hijau Tailwind bawaan atau menggunakan icon untuk konteks).*
* **Warning:** *(Sementara mengandalkan utilitas Tailwind bawaan kuning/oranye).*
* **Destructive:** `--destructive` (Oklch kemerahan) digunakan untuk aksi berbahaya (Hapus, Tolak).

---

## 4. Typography

CMS ini akan menggunakan satu *Font Family* utama untuk menjaga konsistensi.

* **Font Family:** `var(--font-sans)` (Akan ditentukan kemudian, misal Inter atau Plus Jakarta Sans di *Root Layout*).
* **Font Scale:** Mengandalkan utilitas `text-sm`, `text-base`, `text-lg`, `text-xl` dari Tailwind v4.

**Hierarchy Rules:**
* **H1:** Judul Halaman / Judul Artikel (`text-4xl font-extrabold`). Hanya boleh ada satu H1 per halaman.
* **H2:** Sub-seksi Utama (`text-2xl font-bold`).
* **H3:** Judul Komponen / Widget (`text-xl font-semibold`).
* **H4 - H6:** Sub-komponen detail.
* **Body Text:** `text-base` untuk membaca artikel, `text-sm` untuk data tabular/CMS.

---

## 5. Spacing System

Menggunakan utilitas *rem-based* Tailwind v4.

* **Spacing Scale:** Berbasis 4px (`p-1` = 0.25rem = 4px).
* **Section Spacing:** Gunakan `py-16` atau `py-24` untuk jeda antar blok di *website* publik.
* **Card Spacing:** Padding internal kartu wajib menggunakan `p-6`.
* **Form Spacing:** Jarak vertikal antar elemen input wajib menggunakan `space-y-4` atau `gap-4`.

---

## 6. Border Radius

Menggunakan skala khusus *radius* komputasional dari `globals.css`.

**Tokens Aktual:**
* `--radius` (Nilai dasar: `0.625rem` / 10px).
* Turunan: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, hingga `--radius-4xl`.

**Usage Rules:**
* Elemen interaktif kecil (Button, Input): `--radius-md`
* Penampung besar (Card, Dialog, Drawer): `--radius-lg` atau `--radius-xl`
* Gambar profil/Logo: Penuh membulat (`rounded-full`).

---

## 7. Layout Rules

### Public Website
* **Container Width:** Gunakan utilitas standar kelas `container` (terpusat dengan *padding* horizontal).
* **Article Width:** Konten bacaan utama dibatasi maksimal `max-w-3xl` agar mata tidak terlalu jauh melirik (optimalisasi tipografi).
* **Section Spacing:** Konsisten menggunakan margin vertikal untuk memisahkan Hero, Carousel, dan Footer.

### CMS Dashboard
* **Dashboard Layout:** Menggunakan tata letak *Sidebar* sisi kiri.
* **Sidebar:** Berisi navigasi sistem dan menu *switch* Komisariat. Berwarna spesifik (mengikuti token `--sidebar`).
* **Content Area:** Latar belakang abu-abu terang (atau `--muted`/hitam dalam *dark mode*) dengan form/tabel dibungkus di dalam `--card` putih bersudut melengkung.

---

## 8. Responsive Design

Strategi **Mobile-First**.

* **Breakpoints (Tailwind v4 Default):**
  * `sm:` 40rem (640px) - Ponsel besar/Tablet portrait
  * `md:` 48rem (768px) - Tablet
  * `lg:` 64rem (1024px) - Laptop
  * `xl:` 80rem (1280px) - Desktop
  * `2xl:` 96rem (1536px) - Layar super besar
* **Public Website:** Wajib 100% *mobile responsive*. Menu atas harus berubah menjadi *Hamburger menu* di ukuran `md` ke bawah.
* **CMS Dashboard:** Navigasi *sidebar* harus dapat bersembunyi (kolaps ke *drawer* bawah/samping) di perangkat kecil. Tabel data menggunakan pergeseran horizontal (`overflow-x-auto`).

---

## 9. Component Usage Rules

Berdasarkan *shadcn/ui* yang akan diinstal nanti:

* **Button:** Untuk aksi eksplisit. Gunakan `variant="default"` untuk aksi primer, `variant="secondary"` untuk aksi opsional, `variant="destructive"` untuk Hapus/Tolak, dan `variant="ghost"` untuk *toolbar* ikon.
* **Card:** Penampung isolasi untuk statistik dasbor dan bentuk formulir masukan.
* **Input / Textarea / Select:** Untuk masukan data standar.
* **Dialog (Modal):** Untuk konfirmasi yang menghentikan alur kerja (misal: "Yakin ingin menolak artikel ini?"). Jangan digunakan untuk memuat formulir masukan panjang.
* **Drawer:** Khusus digunakan pada mode *mobile* sebagai pengganti *Dialog* atau *Menu*.
* **Dropdown Menu:** Untuk daftar aksi per baris di dalam tabel (opsi edit, hapus, detail).
* **Badge:** Menunjukkan *status* suatu entitas (misal: `DRAFT` abu-abu, `APPROVED` hijau).
* **Table:** Untuk mempresentasikan koleksi data CMS. Wajib memiliki batas baris minimalis.
* **Tabs:** Untuk memecah tampilan dalam konteks yang sama (Misal: Pengaturan -> Tab Umum, Tab Profil, Tab Keamanan).
* **Pagination:** Navigasi antar halaman tabel.
* **Tooltip:** Penjelasan ringkas pada ikon fungsi (*Action Button* di tabel).
* **Alert:** Menampilkan peringatan global berdasar hasil Server Actions.

---

## 10. Form Design Rules

* **Labels:** Berada di atas input (*top-aligned*) untuk keterbacaan yang cepat.
* **Descriptions:** Teks kecil bernada abu-abu (`--muted-foreground`) di bawah input untuk memperjelas konteks isian.
* **Validation Messages:** Berada persis di bawah input dengan warna teks merah (`--destructive`). Pesan harus ramah dan eksplisit ("Judul tidak boleh kosong").
* **Required Fields:** Ditandai dengan karakter asterik merah (`*`). Input opsional harus secara eksplisit mencantumkan teks `(Opsional)` pada labelnya.
* **Error States:** Saat *error*, garis batas kotak isian harus berubah menjadi warna merah (`border-destructive`).

---

## 11. Table Design Rules

* **Pagination:** Wajib ada untuk tabel apa pun yang berpotensi memiliki baris > 10.
* **Search:** Bidang pencarian diletakkan di sudut kiri atas tabel. Cukup cari berdasarkan parameter inti (misal: Cari berdasarkan Judul).
* **Filters:** *Dropdown* filter status (misal: Filter berdasarkan Status "DRAFT", "PUBLISHED") diletakkan di sisi kanan atas, berdekatan dengan fungsi pencarian.
* **Actions Column:** Ditempatkan paling kanan, lebarnya statis, berisi menu tiga titik (*Dropdown Menu*).

---

## 12. Loading States

* **Skeleton:** Tampilan *placeholder* kelabu beranimasi nafas lambat (*pulse*). Digunakan untuk pemuatan konten awal (misal: *Article Card* di dasbor).
* **Spinner:** Ikon putar (biasanya `lucide-react/Loader2`). Digunakan secara spesifik *di dalam tombol aksi* (saat form *submit* sedang berproses Server Action).
* **Optimistic Updates:** Diatur via *React Query*. (Misal: menekan ikon *mark as read* pada notifikasi akan langsung memudarkan notifikasi meski proses API di latar belakang belum selesai).

---

## 13. Empty States

Saat tabel atau senarai tidak menemukan baris data:
Gunakan desain kotak tebal (`--muted` border), ikon pudar, dan kalimat penjelas yang bersahabat:
* **Articles:** "Belum ada tulisan yang ditemukan. [Buat Draf Pertama]"
* **Agendas:** "Belum ada jadwal tersimpan."
* **Documents:** "Direktori dokumen kosong."
* **Galleries:** "Album foto masih kosong."
* **Notifications:** "Tidak ada pemberitahuan baru."

---

## 14. Accessibility Rules

* **Keyboard Navigation:** Komponen `shadcn/ui` telah mengatasi ini secara *default*. Selalu pastikan elemen *custom* interaktif menggunakan tag `<button>` atau `<a>`, bukan `<div onClick>`.
* **Focus States:** Selalu pertahankan cincin fokus visual (`focus-visible:ring-ring`). Jangan disembunyikan.
* **Color Contrast:** Hindari meletakkan warna kelabu (`--muted-foreground`) di atas latar belakang kelabu sekunder tanpa mengecek keterbacaan.
* **Aria Guidance:** Berikan atribut `aria-label` untuk ikon tombol yang tidak memiliki teks di sebelahnya.

---

## 15. Media Rules

Aplikasi ini menggunakan penegakan rasio ketat untuk gambar:

* **Article Thumbnail:** Rasio `16:9` (misal: 800x450). Digunakan standar *landscape*.
* **Agenda Flyer:** Rasio `4:5` (misal: 1080x1350). Standar *portrait* Instagram.
* **Commissariat Logo:** Rasio `1:1` (Persegi/Bulat sempurna).
* **Gallery:** Rasio bebas, namun idealnya gambar dioptimalkan dengan Next.js Image component (konversi otomatis ke format `webp` sebelum dirender ke klien) untuk mengecilkan ukuran jaringan.

---

## 16. Final Design Principles Summary

**The Golden Rules:**
1. **Never Invent Outside the Tokens:** Jika membutuhkan warna abu-abu, gunakan `--muted` atau `--secondary`, jangan menulis kode `bg-[#d3d3d3]`.
2. **Server Action UX First:** Tombol simpan wajib memiliki *spinner* *loading* terpadu agar mencegah pengguna mengklik dua kali (*double submission*).
3. **Form Error Clarity:** Pesan kegagalan form wajib dimuntahkan langsung tepat di bawah kotak isian, bukan via pesan sistem mengambang yang membingungkan.
4. **Responsiveness is Mandatory:** Jangan serahkan rilis kode halaman apa pun ke produksi sebelum mengubah ukuran lebar layar peramban dari desktop menjadi lebar ponsel seluler (`sm`), dan memastikan tidak ada elemen yang meluap ke samping (*overflow-x*).
