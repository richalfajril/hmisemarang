import type { Metadata } from 'next'
import { getWebsiteSettings } from '@/features/website-settings/api/queries'
import { PublicHeader } from '@/widgets/public-layout/ui/PublicHeader'
import { PublicFooter } from '@/widgets/public-layout/ui/PublicFooter'
import {
  DEFAULT_SITE_NAME,
  DEFAULT_LOGO_URL,
  SITE_URL,
  SITE_KEYWORDS,
} from '@/widgets/public-layout/config/site'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings()
  const name = settings?.site_name || DEFAULT_SITE_NAME
  const title =
    settings?.seo_title || `${name} — Himpunan Mahasiswa Islam Cabang Semarang`
  const description =
    settings?.seo_description ||
    'HMI Cabang Semarang (HMI Semarang) — portal resmi Himpunan Mahasiswa Islam Cabang Semarang: kaderisasi, gagasan, artikel, agenda, dokumen, dan komisariat.'
  const heroForOg = /\.(mp4|webm|mov)(\?|$)/i.test(settings?.hero_image_url || '')
    ? undefined
    : settings?.hero_image_url
  const ogImage = heroForOg || settings?.logo_url || DEFAULT_LOGO_URL

  return {
    title: { default: title, template: `%s - ${name}` },
    description,
    keywords: SITE_KEYWORDS,
    applicationName: name,
    robots: { index: true, follow: true },
    icons: settings?.favicon_url
      ? { icon: settings.favicon_url, shortcut: settings.favicon_url, apple: settings.favicon_url }
      : { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }], shortcut: '/favicon.svg', apple: '/favicon.svg' },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: SITE_URL,
      siteName: 'Official Website HMI Cabang Semarang',
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getWebsiteSettings()

  const SITE_NAME_SERP = 'Official Website HMI Cabang Semarang'
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME_SERP,
      alternateName: ['HMI Cabang Semarang', 'HMI Semarang'],
      url: SITE_URL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME_SERP,
      alternateName: ['HMI Cabang Semarang', 'HMI Semarang', 'Himpunan Mahasiswa Islam Cabang Semarang'],
      url: SITE_URL,
      logo: settings?.logo_url || DEFAULT_LOGO_URL,
      email: settings?.contact_email || undefined,
      address: settings?.address
        ? { '@type': 'PostalAddress', streetAddress: settings.address, addressLocality: 'Semarang', addressRegion: 'Jawa Tengah', addressCountry: 'ID' }
        : undefined,
      sameAs: [settings?.instagram_url].filter(Boolean),
    },
  ]

  return (
    <div className="relative flex min-h-svh flex-col">
      {/* Sentinel puncak: navbar transparan selama 80px teratas terlihat.
          Dipantau IntersectionObserver di PublicHeader (kebal layout-shift). */}
      <div
        id="nav-sentinel"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-20 w-px"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicHeader
        siteName={settings?.site_name}
        logoUrl={settings?.logo_url}
        darkLogoUrl={settings?.dark_logo_url}
      />
      <main className="flex-1">{children}</main>
      <PublicFooter
        siteName={settings?.site_name}
        logoUrl={settings?.logo_url}
        contactEmail={settings?.contact_email}
        address={settings?.address}
        instagramUrl={settings?.instagram_url}
        footerText={settings?.footer_text}
      />
    </div>
  )
}
