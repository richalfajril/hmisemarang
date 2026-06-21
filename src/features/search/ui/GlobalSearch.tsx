'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, FileText, CalendarRange, BookOpen, Building2, Loader2 } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { globalSearchAction, SearchResult } from '../api/actions'

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }
      setIsLoading(true)
      const data = await globalSearchAction(debouncedQuery)
      setResults(data)
      setIsLoading(false)
    }
    fetchResults()
  }, [debouncedQuery])

  const handleSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  const articles = results.filter(r => r.type === 'ARTICLE')
  const agendas = results.filter(r => r.type === 'AGENDA')
  const documents = results.filter(r => r.type === 'DOCUMENT')
  const commissariats = results.filter(r => r.type === 'COMMISSARIAT')

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border rounded-md transition-colors w-full max-w-sm"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Cari apa saja...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Ketik untuk mencari artikel, agenda, atau dokumen..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && (
            <div className="p-4 flex items-center justify-center text-sm text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Mencari data...
            </div>
          )}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>Tidak ada hasil yang ditemukan.</CommandEmpty>
          )}
          {!isLoading && query.length < 2 && (
            <CommandEmpty>Ketik minimal 2 karakter untuk mencari.</CommandEmpty>
          )}

          {articles.length > 0 && (
            <CommandGroup heading="Artikel">
              {articles.map((item) => (
                <CommandItem key={item.id} value={`article-${item.id}-${item.title}`} onSelect={() => handleSelect(item.url)}>
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {agendas.length > 0 && (
            <CommandGroup heading="Agenda">
              {agendas.map((item) => (
                <CommandItem key={item.id} value={`agenda-${item.id}-${item.title}`} onSelect={() => handleSelect(item.url)}>
                  <CalendarRange className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {documents.length > 0 && (
            <CommandGroup heading="Dokumen">
              {documents.map((item) => (
                <CommandItem key={item.id} value={`doc-${item.id}-${item.title}`} onSelect={() => handleSelect(item.url)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {commissariats.length > 0 && (
            <CommandGroup heading="Komisariat">
              {commissariats.map((item) => (
                <CommandItem key={item.id} value={`comm-${item.id}-${item.title}`} onSelect={() => handleSelect(item.url)}>
                  <Building2 className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
