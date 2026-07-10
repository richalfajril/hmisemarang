import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Building2, GraduationCap, MapPin, ArrowLeft, ExternalLink } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa6'
import { prisma } from '@/shared/api/prisma/client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/Breadcrumb'
import { SITE_URL } from '@/widgets/public-layout/config/site'

export const revalidate = 300

async function getCommissariat(slug: string) {
  try {
    return await prisma.commissariat.findFirst({
      where: { slug, is_active: true },
      include: { university: { select: { name: true } } },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const c = await getCommissariat(slug)
  if (!c) return { title: 'Komisariat' }
  return {
    title: c.name,
    description: c.about?.slice(0, 160) ?? `Profil ${c.name} — HMI Cabang Semarang.`,
    openGraph: c.logo_url ? { images: [c.logo_url] } : undefined,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = await getCommissariat(slug)
  if (!c) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Komisariat', item: `${SITE_URL}/komisariat` },
      { '@type': 'ListItem', position: 3, name: c.name, item: `${SITE_URL}/komisariat/${slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-24">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Beranda</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/komisariat">Komisariat</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px] text-primary">{c.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Section 1: logo (1/3) | nama, kampus, tentang (2/3) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border bg-white shadow-sm lg:col-span-1">
            {c.logo_url ? (
              <Image src={c.logo_url} alt={c.name} fill className="object-contain p-6" sizes="(min-width:1024px) 33vw, 100vw" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-emerald-200">
                <Building2 className="h-20 w-20" />
              </div>
            )}
          </div>
          <div className="min-w-0 lg:col-span-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">{c.name}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-primary" />
              {c.university?.name || c.campus_name || '-'}
            </p>
            <div className="mt-6">
              <h2 className="text-xl font-bold text-foreground">Tentang Komisariat</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{c.about || '-'}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-10 lg:col-span-2">
            {c.chairman_name && (
              <section className="rounded-3xl border bg-muted/30 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Ketua Umum</p>
                <p className="mt-1 text-lg font-bold text-foreground">{c.chairman_name}</p>
                {c.chairman_period && <p className="text-sm text-muted-foreground">Periode {c.chairman_period}</p>}
                {c.chairman_about && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{c.chairman_about}</p>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {c.secretariat_photo_url && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border">
                <Image src={c.secretariat_photo_url} alt={`Sekretariat ${c.name}`} fill className="object-cover" sizes="320px" />
              </div>
            )}

            {c.address && (
              <div className="rounded-2xl border p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> Sekretariat
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.address}</p>
                {c.map_url && (
                  <a href={c.map_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Lihat di Peta <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}

            {c.instagram_url && (
              <a
                href={c.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <FaInstagram className="h-4 w-4" /> Instagram
              </a>
            )}
          </aside>
        </div>

        <div className="mt-12 border-t pt-8">
          <Link href="/komisariat" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Komisariat
          </Link>
        </div>
      </div>
    </div>
  )
}
