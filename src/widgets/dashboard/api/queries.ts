import { prisma } from '@/shared/api/prisma/client'
import { unstable_cache } from 'next/cache'

export const getCabangDashboardStats = unstable_cache(
  async () => {
    const [
      totalArticles,
      totalAgendas,
      totalDocuments,
      totalCommissariats,
      pendingArticles,
      pendingAgendas,
      pendingVerifications,
      pendingProfiles
    ] = await Promise.all([
      prisma.article.count({ where: { status: 'PUBLISHED', deleted_at: null } }),
      prisma.agenda.count({ where: { status: 'PUBLISHED', deleted_at: null } }),
      prisma.document.count({ where: { status: 'PUBLISHED', deleted_at: null } }),
      prisma.commissariat.count({ where: { is_active: true } }),
      prisma.article.count({ where: { status: 'SUBMITTED', deleted_at: null } }),
      prisma.agenda.count({ where: { status: 'SUBMITTED', deleted_at: null } }),
      prisma.cadreVerification.count({ where: { status: 'PENDING' } }),
      prisma.commissariatProfileSubmission.count({ where: { status: 'SUBMITTED' } })
    ])

    return {
      totals: {
        articles: totalArticles,
        agendas: totalAgendas,
        documents: totalDocuments,
        commissariats: totalCommissariats
      },
      pendingReview: {
        articles: pendingArticles,
        agendas: pendingAgendas,
        verifications: pendingVerifications,
        profiles: pendingProfiles,
        total: pendingArticles + pendingAgendas + pendingVerifications + pendingProfiles
      }
    }
  },
  ['dashboard-cabang-stats'],
  { revalidate: 60, tags: ['dashboard'] }
)

export const getTopCommissariatsLeaderboard = unstable_cache(
  async () => {
    const leaderboard = await prisma.article.groupBy({
      by: ['commissariat_id'],
      where: { status: 'PUBLISHED', deleted_at: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    })

    const commIds = leaderboard.map(l => l.commissariat_id)
    const commissariats = await prisma.commissariat.findMany({
      where: { id: { in: commIds } },
      select: { id: true, name: true, logo_url: true }
    })

    const enrichedLeaderboard = leaderboard.map(l => {
      const comm = commissariats.find(c => c.id === l.commissariat_id)
      return {
        commissariatId: l.commissariat_id,
        name: comm?.name || 'Komisariat',
        logoUrl: comm?.logo_url,
        publishedCount: l._count.id
      }
    })

    return enrichedLeaderboard
  },
  ['dashboard-leaderboard'],
  { revalidate: 60, tags: ['dashboard'] }
)

export const getRecentActivityLogs = unstable_cache(
  async (limit = 10) => {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
    })
    
    const userIds = logs.map(l => l.actor_id).filter(Boolean) as string[]
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, role: true }
    })

    return logs.map(log => {
      const u = users.find(u => u.id === log.actor_id)
      return {
        ...log,
        actor: u ? { ...u, name: u.email.split('@')[0] } : null
      }
    })
  },
  ['dashboard-recent-activity'],
  { revalidate: 15, tags: ['dashboard'] }
)

export const getCommissariatDashboardStats = unstable_cache(
  async (commissariatId: string) => {
    const [
      publishedArticles,
      draftArticles,
      rejectedArticles,
      publishedAgendas,
      draftAgendas
    ] = await Promise.all([
      prisma.article.count({ where: { commissariat_id: commissariatId, status: 'PUBLISHED', deleted_at: null } }),
      prisma.article.count({ where: { commissariat_id: commissariatId, status: { in: ['DRAFT', 'SUBMITTED'] }, deleted_at: null } }),
      prisma.article.count({ where: { commissariat_id: commissariatId, status: 'REJECTED', deleted_at: null } }),
      prisma.agenda.count({ where: { commissariat_id: commissariatId, status: 'PUBLISHED', deleted_at: null } }),
      prisma.agenda.count({ where: { commissariat_id: commissariatId, status: { in: ['DRAFT', 'SUBMITTED'] }, deleted_at: null } }),
    ])

    const pendingVerifications = await prisma.cadreVerification.count({ where: { commissariat_id: commissariatId, status: 'PENDING' } })
    const pendingProfiles = await prisma.commissariatProfileSubmission.count({ where: { commissariat_id: commissariatId, status: 'SUBMITTED' } })

    return {
      articles: {
        published: publishedArticles,
        draftsAndSubmitted: draftArticles,
        rejected: rejectedArticles
      },
      agendas: {
        published: publishedAgendas,
        draftsAndSubmitted: draftAgendas
      },
      pendingSystems: {
        verifications: pendingVerifications,
        profiles: pendingProfiles
      }
    }
  },
  ['dashboard-commissariat-stats'],
  { revalidate: 60, tags: ['dashboard'] }
)
