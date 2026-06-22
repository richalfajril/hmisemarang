'use server'
import { prisma } from '@/shared/api/prisma/client'

import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'



export type SearchResult = {
  id: string
  title: string
  subtitle: string
  type: 'ARTICLE' | 'AGENDA' | 'DOCUMENT' | 'COMMISSARIAT'
  url: string
}

export async function globalSearchAction(query: string): Promise<SearchResult[]> {
  const session = await getUserSession()
  if (!session) return []

  const isAdmin = session.user.role === 'SYSTEM_ADMIN' || session.user.role === 'ADMIN_CABANG'
  const commissariatId = session.user.commissariatId

  if (!query || query.trim().length < 2) return []
  const searchTerm = query.trim()

  const articleWhere: any = {
    OR: [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } }
    ],
    deleted_at: null
  }
  if (!isAdmin) {
    articleWhere.commissariat_id = commissariatId
  }

  const agendaWhere: any = {
    OR: [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } }
    ],
    deleted_at: null
  }
  if (!isAdmin) {
    agendaWhere.commissariat_id = commissariatId
  }

  // We do parallel searches, using Prisma's `contains` with mode: 'insensitive'
  const [articles, agendas, documents, commissariats] = await Promise.all([
    prisma.article.findMany({
      where: articleWhere,
      take: 5,
      select: { id: true, title: true, commissariat: { select: { name: true } } }
    }),
    prisma.agenda.findMany({
      where: agendaWhere,
      take: 3,
      select: { id: true, title: true, commissariat: { select: { name: true } } }
    }),
    isAdmin ? prisma.document.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ],
        deleted_at: null
      },
      take: 3,
      select: { id: true, title: true, category: { select: { name: true } } }
    }) : Promise.resolve([]),
    isAdmin ? prisma.commissariat.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { campus_name: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      take: 3,
      select: { id: true, name: true, campus_name: true }
    }) : Promise.resolve([])
  ])

  const results: SearchResult[] = []

  articles.forEach(a => {
    results.push({
      id: a.id,
      title: a.title,
      subtitle: a.commissariat?.name || 'Cabang',
      type: 'ARTICLE',
      url: `/dashboard/articles/${a.id}/edit`
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
      subtitle: d.category?.name || 'Tidak ada kategori',
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
