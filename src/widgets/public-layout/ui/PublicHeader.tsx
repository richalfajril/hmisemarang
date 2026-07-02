'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/Sheet'
import { cn } from '@/shared/lib/utils'
import {
  DEFAULT_DARK_LOGO_URL,
  DEFAULT_LOGO_URL,
  DEFAULT_SITE_NAME,
  PUBLIC_NAV_LINKS,
} from '../config/site'

type Props = {
  siteName?: string | null
  logoUrl?: string | null
  darkLogoUrl?: string | null
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function PublicHeader({ siteName, logoUrl, darkLogoUrl }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Halaman dengan hero band gelap di atas → navbar transparan sebelum scroll.
  const HERO_ROUTES = ['/', '/struktur-organisasi', '/artikel', '/dokumen', '/komisariat', '/agenda', '/galeri']
  const isHeroRoute = HERO_ROUTES.includes(pathname)

  useEffect(() => {
    if (!isHeroRoute) return
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHeroRoute])

  // Solid kecuali di halaman ber-hero gelap sebelum scroll
  const isTransparent = isHeroRoute && !scrolled

  const name = siteName || DEFAULT_SITE_NAME
  const whiteLogo = logoUrl || DEFAULT_LOGO_URL

  const logoSrc = isTransparent
    ? (darkLogoUrl || DEFAULT_DARK_LOGO_URL)
    : whiteLogo

  const Brand = (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      onClick={() => setOpen(false)}
    >
      <Image
        src={logoSrc}
        alt={name}
        width={96}
        height={96}
        className="h-24 w-24 object-contain"
        priority
      />
    </Link>
  )

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'border-b bg-white shadow-sm'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {Brand}

        <nav className="hidden items-center gap-1 lg:flex">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isTransparent
                  ? isActive(pathname, link.href)
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                  : isActive(pathname, link.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isTransparent ? (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn('lg:hidden', isTransparent && 'text-white hover:bg-white/10 hover:text-white')}
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4">
                {PUBLIC_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
                      isActive(pathname, link.href)
                        ? 'bg-muted text-primary'
                        : 'text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="mt-3">
                  <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
