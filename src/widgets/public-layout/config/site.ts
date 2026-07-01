/** Branding & navigasi situs publik. Dipakai PublicHeader, PublicFooter, splash. */

export const DEFAULT_SITE_NAME = 'HMI Cabang Semarang'

/** Logo putih / white theme (untuk latar gelap — footer, navbar solid). */
export const DEFAULT_LOGO_URL =
  'https://res.cloudinary.com/dbndgotx4/image/upload/v1782097475/Logo_White_Theme_dieii8.png'

/** Logo dark theme (untuk navbar transparan di atas hero). */
export const DEFAULT_DARK_LOGO_URL =
  'https://res.cloudinary.com/dbndgotx4/image/upload/v1782097476/Logo_Dark_Theme_q1sfhq.png'

export type NavLink = { label: string; href: string }

export const PUBLIC_NAV_LINKS: NavLink[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  { label: 'Struktur', href: '/struktur-organisasi' },
  { label: 'Artikel', href: '/artikel' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Komisariat', href: '/komisariat' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Dokumen', href: '/dokumen' },
  { label: 'Kontak', href: '/kontak' },
]
