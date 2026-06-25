'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function HeroSearchBar() {
  const [q, setQ] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl items-center overflow-hidden rounded-full bg-white shadow-2xl"
    >
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari artikel, agenda, komisariat..."
        className="flex-1 bg-transparent px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none sm:text-base"
      />
      <button
        type="submit"
        className="m-1.5 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Cari</span>
      </button>
    </form>
  )
}
