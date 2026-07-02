import { Fragment } from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/Breadcrumb'
import { SectionHeaderCenter, SectionHeaderLeft } from '@/shared/ui/SectionHeader'

export type Crumb = { label: string; href?: string }

type Props = {
  breadcrumb: Crumb[]
  eyebrow: string
  heading: string
  subheading?: string
  /** Perataan header. Default center. */
  align?: 'center' | 'left'
  /** CTA (hanya untuk align left). */
  cta?: { label: string; href: string }
  /** Elemen di sisi kanan header (sebaris), mis. search. Untuk align left. */
  action?: React.ReactNode
  /** Slot bebas per-halaman (mis. switcher periode) di bawah header. */
  children?: React.ReactNode
}

/**
 * Hero band emerald untuk halaman publik: breadcrumb + section header (center/left)
 * + slot children. Konten halaman dirender terpisah di bawah hero (bg terang).
 */
export function PageHero({ breadcrumb, eyebrow, heading, subheading, align = 'center', cta, action, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 pb-14 pt-20 sm:pt-24">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="pagehero-geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 3 L57 30 L30 57 L3 30 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pagehero-geo)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-5">
        <Breadcrumb>
          <BreadcrumbList className="text-white/70">
            {breadcrumb.map((c, i) => {
              const last = i === breadcrumb.length - 1
              return (
                <Fragment key={`${c.label}-${i}`}>
                  <BreadcrumbItem>
                    {last || !c.href ? (
                      <BreadcrumbPage className="font-medium text-white">{c.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={c.href} className="hover:text-white">
                          {c.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!last && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className={cn('mt-8', action && 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between')}>
          {align === 'center' ? (
            <SectionHeaderCenter inverted eyebrow={eyebrow} heading={heading} subheading={subheading} />
          ) : (
            <SectionHeaderLeft inverted eyebrow={eyebrow} heading={heading} subheading={subheading} cta={cta} />
          )}
          {action && <div className="w-full lg:w-auto lg:shrink-0">{action}</div>}
        </div>

        {children && (
          <div className={cn('mt-8', align === 'center' && 'flex justify-center')}>{children}</div>
        )}
      </div>
    </section>
  )
}
