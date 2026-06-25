import { Search } from 'lucide-react'
import { EmptyState } from '@/shared/ui/EmptyState'

export const metadata = {
  title: 'Pencarian',
}

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await props.searchParams
  const query = (q ?? '').trim()

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 md:pb-16">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Hasil Pencarian</h1>
      {query && (
        <p className="mt-2 text-sm text-muted-foreground">
          Kata kunci: <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
        </p>
      )}

      <div className="mt-8">
        <EmptyState
          icon={<Search className="h-10 w-10 text-muted-foreground" />}
          title="Pencarian segera hadir"
          description="Fitur pencarian penuh sedang dalam pengembangan. Sementara ini, jelajahi konten melalui menu navigasi."
        />
      </div>
    </div>
  )
}
