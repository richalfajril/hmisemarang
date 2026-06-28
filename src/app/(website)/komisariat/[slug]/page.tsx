import { ComingSoon } from '@/shared/ui/ComingSoon'

export const metadata = { title: 'Komisariat' }

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await params
  return (
    <ComingSoon
      title="Komisariat"
      description="Halaman detail komisariat sedang dalam pengembangan dan akan tersedia pada rilis berikutnya."
    />
  )
}
