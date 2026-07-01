import type { Metadata } from 'next'
import { getWebsiteSettings } from '@/features/website-settings/api/queries'
import { PublicHeader } from '@/widgets/public-layout/ui/PublicHeader'
import { PublicFooter } from '@/widgets/public-layout/ui/PublicFooter'
import { DEFAULT_SITE_NAME } from '@/widgets/public-layout/config/site'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings()
  const name = settings?.site_name || DEFAULT_SITE_NAME
  return {
    title: {
      default: settings?.seo_title || name,
      template: `%s - ${name}`,
    },
    description:
      settings?.seo_description ||
      'Portal resmi HMI Cabang Semarang — kaderisasi, gagasan, dan pengabdian.',
  }
}

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getWebsiteSettings()

  return (
    <div className="flex min-h-svh flex-col">
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
