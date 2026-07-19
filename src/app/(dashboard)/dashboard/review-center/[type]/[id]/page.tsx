import { prisma } from '@/shared/api/prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { notFound, redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { ReviewSplitScreen } from '@/features/content-review/ui/ReviewSplitScreen'
import { ArticleReadingView } from '@/features/articles/ui/ArticleReadingView'
import { ReviewEntityType } from '@/entities/review-history/model/schema'
import { getOptimizedUrl, generateSecureDownloadUrl } from '@/shared/lib/cloudinary'



export default async function ReviewDetailPage({ 
  params 
}: { 
  params: Promise<{ type: string, id: string }> 
}) {
  const session = await getUserSession()
  const { type, id } = await params
  
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG') {
    redirect('/dashboard')
  }

  const validTypes: ReviewEntityType[] = ['ARTICLE', 'AGENDA', 'COMMISSARIAT_PROFILE', 'CADRE_VERIFICATION']
  if (!validTypes.includes(type as ReviewEntityType)) {
    notFound()
  }

  let previewData: {
    title: string
    subtitle?: string
    contentHtml?: string
    imageUrl?: string
    fileDownloadUrl?: string
    metadata?: Array<{ label: string; value: string }>
  } | null = null
  // Slot pratinjau khusus (ARTICLE memakai ArticleReadingView agar identik dgn halaman publik).
  let previewSlot: ReactNode = undefined

  if (type === 'ARTICLE') {
    const article = await prisma.article.findUnique({
      where: { id },
      include: { commissariat: true, category: true, tags: true }
    })

    if (!article) notFound()
    // Sudah diproses (implicit refresh setelah kirim keputusan) → kembali ke antrean, bukan 404.
    if (article.status !== 'SUBMITTED') redirect('/dashboard/review-center')

    previewData = { title: article.title }
    previewSlot = (
      <ArticleReadingView
        title={article.title}
        content={article.content}
        categoryName={article.category.name}
        authorName={article.author_name}
        authorImageUrl={article.author_image_url}
        publishedAt={article.published_at}
        viewCount={article.view_count}
        featuredImageUrl={article.featured_image_url}
        featuredImageCaption={article.featured_image_caption}
        tags={article.tags.map((t) => t.name)}
      />
    )
  } else if (type === 'AGENDA') {
    const agenda = await prisma.agenda.findUnique({
      where: { id },
      include: { commissariat: true }
    })
    
    if (!agenda) notFound()
    if (agenda.status !== 'SUBMITTED') redirect('/dashboard/review-center')

    previewData = {
      title: agenda.title,
      subtitle: `Oleh: ${agenda.commissariat?.name || 'Cabang'}`,
      contentHtml: agenda.description,
      imageUrl: agenda.flyer_url ? getOptimizedUrl(agenda.flyer_url) : undefined,
      metadata: [
        { label: 'Waktu Mulai', value: new Date(agenda.start_datetime).toLocaleString('id-ID') },
        { label: 'Lokasi', value: agenda.location_name || 'Tidak ditentukan' },
      ]
    }
  } else if (type === 'COMMISSARIAT_PROFILE') {
    const profile = await prisma.commissariatProfileSubmission.findUnique({
      where: { id },
      include: { commissariat: true }
    })
    
    if (!profile) notFound()
    if (profile.status !== 'SUBMITTED') redirect('/dashboard/review-center')

    previewData = {
      title: profile.commissariat.name,
      subtitle: 'Pembaruan Profil Komisariat',
      imageUrl: profile.logo_url ? getOptimizedUrl(profile.logo_url) : undefined,
      metadata: [
        { label: 'Nama Baru', value: profile.name || '-' },
        { label: 'Kampus', value: profile.campus_name || '-' },
        { label: 'Ketua Umum', value: profile.chairman_name || '-' },
        { label: 'Instagram', value: profile.instagram_url || '-' },
      ]
    }
  } else if (type === 'CADRE_VERIFICATION') {
    const cv = await prisma.cadreVerification.findUnique({
      where: { id },
      include: { commissariat: true }
    })
    
    if (!cv) notFound()
    if (cv.status !== 'PENDING') redirect('/dashboard/review-center')

    previewData = {
      title: 'Pangkalan Data Kader',
      subtitle: `Oleh: ${cv.commissariat.name}`,
      metadata: [
        { label: 'Status', value: 'Menunggu Review Cabang' }
      ],
      fileDownloadUrl: cv.file_url ? generateSecureDownloadUrl(cv.file_url, 'raw') : undefined
    }
  } else {
    notFound()
  }

  return (
    <div className="w-full space-y-6 lg:p-6">
      <ReviewSplitScreen
        entityType={type as ReviewEntityType}
        entityId={id}
        previewData={previewData!}
        previewSlot={previewSlot}
      />
    </div>
  )
}
