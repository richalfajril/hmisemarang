import { cache } from 'react'
import { prisma } from '@/shared/api/prisma/client'

/** Singleton WebsiteSetting record (atau null bila belum di-seed). React.cache deduplicates across layout + page. */
export const getWebsiteSettings = cache(async () =>
  prisma.websiteSetting.findFirst()
)
