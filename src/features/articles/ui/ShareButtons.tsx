'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { FaWhatsapp, FaXTwitter, FaFacebookF } from 'react-icons/fa6'
import { toast } from 'sonner'

/** Tombol berbagi artikel: WhatsApp, X, Facebook, Salin Link. */
export function ShareButtons({ title, className = '' }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const text = encodeURIComponent(title)
  const u = encodeURIComponent(url)

  const links = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${text}%20${u}`, Icon: FaWhatsapp, className: 'hover:bg-emerald-500 hover:text-white hover:border-emerald-500' },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${text}&url=${u}`, Icon: FaXTwitter, className: 'hover:bg-foreground hover:text-background hover:border-foreground' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FaFacebookF, className: 'hover:bg-blue-600 hover:text-white hover:border-blue-600' },
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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {links.map(({ label, href, Icon, className: c }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${label}`}
          className={`flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors ${c}`}
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
}
