import { ComingSoon } from '@/shared/ui/ComingSoon'

export const metadata = { title: 'Artikel' }

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await params
  return (
    <ComingSoon
      title="Artikel"
      description="Halaman detail artikel sedang dalam pengembangan dan akan tersedia pada rilis berikutnya."
    />
  )
}
