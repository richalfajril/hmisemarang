# Pemisahan Tegas State Management (Zustand vs TanStack Query)

## Context
Aplikasi ini melahap banyak manipulasi tampilan berfase (pembukaan panel laci samping, modal perombakan status interaktif) yang bercampur baur dengan penarikan data mentah berlimpah ruah (seperti *filter* tabel, antrean panjang log sistem).

## Problem
Meleburkan kedua muatan (Data UI Lokal dan Data Caching Server) ke dalam satu perangkat *State Management* (entah itu `Redux` atau `Zustand` penuh) akan menciptakan kode rumit untuk penanda *Loading*/*Error* dan peremajaan basis data kadaluwarsa.

## Decision
Menarik garis pemisah absolut:
* Pustaka `Zustand` ditugaskan murni khusus menopang *Client UI State* pasif (seperti menu navigasi lipat, tahap per tahap konfirmasi panel).
* Pustaka `TanStack Query` dikalungkan eksklusif untuk *Server Data State* (pengambilan antrean halaman, pemanggilan tabel asinkron yang bisa di-*invalidate* paksa ketika mutasi baru selesai berjalan).

## Consequences
Penyusunan kerangka struktur pengatur sistem sedikit melar (mengkonfigurasi ganda penyedia). Namun masalah seperti pelaporan *Spinner* tak beralasan atau re-render React beruntun tercegah maksimal. Sinkronisasi data mutakhir dapat langsung di-*invalidate* menggunakan Query Key-nya.

## Related Documents
* `TECH_STACK.md`
* `SKILLS.md`
