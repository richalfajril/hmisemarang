'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

/** Search di PageHero → tulis ke ?q= (dibaca komponen list di bawah). */
export function HeroSearchBox({ placeholder = 'Cari...' }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? '')

  const apply = (value: string) => {
    setQ(value)
    const params = new URLSearchParams(sp.toString())
    if (value.trim()) params.set('q', value)
    else params.delete('q')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex w-full items-center overflow-hidden rounded-full border border-white/20 bg-white shadow-lg lg:w-96">
      <input
        type="text"
        value={q}
        onChange={(e) => apply(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-5 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <span className="m-1.5 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Cari</span>
      </span>
    </div>
  )
}
