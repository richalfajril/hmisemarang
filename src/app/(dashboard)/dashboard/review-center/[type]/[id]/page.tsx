import { prisma } from '@/shared/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ReviewSplitScreen } from '@/features/content-review/ui/ReviewSplitScreen'
import { ReviewEntityType } from '@/features/content-review/api/schema'
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

  if (type === 'ARTICLE') {
    const article = await prisma.article.findUnique({
      where: { id },
      include: { commissariat: true, category: true }
    })
    
    if (!article || article.status !== 'SUBMITTED') notFound()

    previewData = {
      title: article.title,
      subtitle: `Oleh: ${article.commissariat.name}`,
      contentHtml: article.content,
      imageUrl: article.featured_image_url ? getOptimizedUrl(article.featured_image_url) : undefined,
      metadata: [
        { label: 'Kategori', value: article.category.name },
        { label: 'Penulis / Slug', value: article.slug },
      ]
    }
  } else if (type === 'AGENDA') {
    const agenda = await prisma.agenda.findUnique({
      where: { id },
      include: { commissariat: true }
    })
    
    if (!agenda || agenda.status !== 'SUBMITTED') notFound()

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
    
    if (!profile || profile.status !== 'SUBMITTED') notFound()

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
    
    if (!cv || cv.status !== 'PENDING') notFound()

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <ReviewSplitScreen 
        entityType={type as ReviewEntityType}
        entityId={id}
        previewData={previewData!}
      />
    </div>
  )
}
