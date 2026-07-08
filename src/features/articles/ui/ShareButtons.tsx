'use client'

import { useEffect, useState } from 'react'
import { Link2, Check, Share2 } from 'lucide-react'
import { FaWhatsapp, FaXTwitter, FaFacebookF } from 'react-icons/fa6'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'

/**
 * Tombol berbagi: WhatsApp, X, Facebook, Salin Link.
 * collapsible → di mobile jadi tombol "Bagikan" + dropdown; desktop tetap inline.
 */
export function ShareButtons({
  title,
  className = '',
  collapsible = false,
}: {
  title: string
  className?: string
  collapsible?: boolean
}) {
  const [copied, setCopied] = useState(false)
  // URL dibaca setelah mount agar SSR & client cocok (cegah hydration mismatch).
  const [url, setUrl] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setUrl(window.location.href), 0)
    return () => clearTimeout(id)
  }, [])
  const text = encodeURIComponent(title)
  const u = encodeURIComponent(url)

  const links = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${text}%20${u}`, Icon: FaWhatsapp, hover: 'hover:bg-emerald-500 hover:text-white hover:border-emerald-500' },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${text}&url=${u}`, Icon: FaXTwitter, hover: 'hover:bg-foreground hover:text-background hover:border-foreground' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FaFacebookF, hover: 'hover:bg-blue-600 hover:text-white hover:border-blue-600' },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link disalin.')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin link.')
    }
  }

  const inlineIcons = (
    <div className={`flex items-center gap-2 ${className}`}>
      {links.map(({ label, href, Icon, hover }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${label}`}
          className={`flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors ${hover}`}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Salin link"
        className="flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )

  if (!collapsible) return inlineIcons

  return (
    <>
      {/* Desktop: ikon inline */}
      <div className="hidden sm:block">{inlineIcons}</div>

      {/* Mobile: tombol Bagikan + dropdown */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
              Bagikan
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {links.map(({ label, href, Icon }) => (
              <DropdownMenuItem key={label} asChild>
                <a href={href} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </a>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); copy() }} className="cursor-pointer">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Link2 className="mr-2 h-4 w-4" />}
              Salin Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
