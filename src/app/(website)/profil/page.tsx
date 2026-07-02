import { ComingSoon } from '@/shared/ui/ComingSoon'

// noindex sementara: halaman masih ComingSoon. Cabut saat konten profil jadi.
export const metadata = {
  title: 'Profil',
  description: 'Profil HMI Cabang Semarang (HMI Semarang) — sejarah, visi, misi, dan nilai dasar perjuangan.',
  robots: { index: false, follow: true },
}

export default function Page() {
  return <ComingSoon title="Profil" />
}
