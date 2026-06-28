import { cache } from 'react'
import { prisma } from '@/shared/api/prisma/client'

/** Singleton WebsiteSetting record (atau null bila belum di-seed / DB error). React.cache deduplicates across layout + page. */
export const getWebsiteSettings = cache(async () => {
  try {
    return await prisma.websiteSetting.findFirst()
  } catch (e) {
    console.error('getWebsiteSettings failed:', e)
    return null
  }
})
