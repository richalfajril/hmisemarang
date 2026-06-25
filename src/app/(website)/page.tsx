import { getWebsiteSettings } from '@/features/website-settings/api/queries'
import { OpeningSplash } from '@/widgets/home/ui/OpeningSplash'
import { HomeHero } from '@/widgets/home/ui/HomeHero'

export const revalidate = 300

export default async function HomePage() {
  const settings = await getWebsiteSettings()

  return (
    <>
      <OpeningSplash />
      <HomeHero heroImageUrl={settings?.hero_image_url} />
    </>
  )
}
