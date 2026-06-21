'use server'

import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'

const prisma = new PrismaClient()

export type SearchResult = {
  id: string
  title: string
  subtitle: string
  type: 'ARTICLE' | 'AGENDA' | 'DOCUMENT' | 'COMMISSARIAT'
  url: string
}

export async function globalSearchAction(query: string): Promise<SearchResult[]> {
  const session = await getUserSession()
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    return []
  }

  if (!query || query.trim().length < 2) return []
  const searchTerm = query.trim()

  // We do parallel searches, using Prisma's `contains` with mode: 'insensitive'
  const [articles, agendas, documents, commissariats] = await Promise.all([
    prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } }
        ],
        deleted_at: null
      },
      take: 5,
      select: { id: true, title: true, commissariat: { select: { name: true } } }
    }),
    prisma.agenda.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ],
        deleted_at: null
      },
      take: 3,
      select: { id: true, title: true, commissariat: { select: { name: true } } }
    }),
    prisma.document.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ],
        deleted_at: null
      },
      take: 3,
      select: { id: true, title: true, category: { select: { name: true } } }
    }),
    prisma.commissariat.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { campus_name: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      take: 3,
      select: { id: true, name: true, campus_name: true }
    })
  ])

  const results: SearchResult[] = []

  articles.forEach(a => {
    results.push({
      id: a.id,
      title: a.title,
      subtitle: a.commissariat.name,
      type: 'ARTICLE',
      url: `/dashboard/articles/${a.id}/edit` // or view page if implemented
    })
  })

  agendas.forEach(a => {
    results.push({
      id: a.id,
      title: a.title,
      subtitle: a.commissariat?.name || 'Cabang',
      type: 'AGENDA',
      url: `/dashboard/agendas/${a.id}/edit`
    })
  })

  documents.forEach(d => {
    results.push({
      id: d.id,
      title: d.title,
      subtitle: d.category.name,
      type: 'DOCUMENT',
      url: `/dashboard/documents/${d.id}/edit`
    })
  })

  commissariats.forEach(c => {
    results.push({
      id: c.id,
      title: c.name,
      subtitle: c.campus_name || '-',
      type: 'COMMISSARIAT',
      url: `/dashboard/organization/commissariats/${c.id}`
    })
  })

  return results
}
