import { getWebsiteSettings } from '@/features/website-settings/api/queries'
import { OpeningSplash } from '@/widgets/home/ui/OpeningSplash'
import { HomeHero } from '@/widgets/home/ui/HomeHero'
import { HomeAbout } from '@/widgets/home/ui/HomeAbout'
import { HomeArticles } from '@/widgets/home/ui/HomeArticles'

export const revalidate = 300

export default async function HomePage() {
  const settings = await getWebsiteSettings()

  return (
    <>
      <OpeningSplash />
      <HomeHero heroImageUrl={settings?.hero_image_url} />
      <HomeAbout aboutImageUrl={settings?.about_image_url} />
      <HomeArticles />
    </>
  )
}
