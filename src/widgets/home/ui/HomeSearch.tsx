'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'

export function HomeSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-center gap-2"
          role="search"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari artikel, agenda, komisariat..."
              className="h-11 pl-10"
              aria-label="Pencarian situs"
            />
          </div>
          <Button type="submit" size="lg" className="h-11">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Cari</span>
          </Button>
        </form>
      </div>
    </section>
  )
}
