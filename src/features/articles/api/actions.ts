'use server'

import { revalidatePath } from 'next/cache'
import { PrismaClient, ArticleStatus } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { articleSchema } from './schema'
import { ActionState } from '@/shared/lib/action-state'
import { logAuditAction } from '@/shared/lib/audit-logger'

const prisma = new PrismaClient()

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function saveArticleDraftAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, message: 'Unauthorized. Please login.' }
    }

    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      featured_image_url: formData.get('featured_image_url') as string,
      category_id: formData.get('category_id') as string,
      author_name: formData.get('author_name') as string,
      author_commissariat: formData.get('author_commissariat') as string,
      tag_ids: formData.getAll('tag_ids') as string[],
    }

    const validatedFields = articleSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Gagal memvalidasi form. Silakan periksa kembali isian Anda.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const data = validatedFields.data
    const isEdit = !!formData.get('id')
    const articleId = formData.get('id') as string
    
    const finalSlug = data.slug || generateSlug(data.title)

    // Check if slug already exists (excluding current article if editing)
    const existing = await prisma.article.findUnique({
      where: { slug: finalSlug },
    })

    if (existing && (!isEdit || existing.id !== articleId)) {
      return { success: false, message: 'Slug/Judul sudah digunakan oleh artikel lain.' }
    }

    if (isEdit) {
      // Check permissions: only CABANG or owner KOMISARIAT can edit
      const existingArticle = await prisma.article.findUnique({
        where: { id: articleId },
      })
      
      if (!existingArticle) return { success: false, message: 'Artikel tidak ditemukan.' }
      
      if (session.user.role === 'ADMIN_KOMISARIAT' && existingArticle.commissariat_id !== session.user.commissariatId) {
        return { success: false, message: 'Anda tidak memiliki hak akses mengubah artikel ini.' }
      }

      await prisma.article.update({
        where: { id: articleId },
        data: {
          title: data.title,
          slug: finalSlug,
          excerpt: data.excerpt,
          content: data.content,
          featured_image_url: data.featured_image_url,
          category_id: data.category_id,
          author_name: data.author_name,
          author_commissariat: data.author_commissariat,
          updated_by: session.user.id,
          // Handle tags update if needed (disconnect all, connect new)
          tags: {
            set: [],
            connect: data.tag_ids.map(id => ({ id }))
          }
        },
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'Article',
        entity_id: articleId,
        action: 'UPDATED',
        newData: { title: data.title }
      })
    } else {
      await prisma.article.create({
        data: {
          commissariat_id: session.user.commissariatId as string,
          title: data.title,
          slug: finalSlug,
          excerpt: data.excerpt,
          content: data.content,
          featured_image_url: data.featured_image_url,
          category_id: data.category_id,
          author_name: data.author_name,
          author_commissariat: data.author_commissariat,
          status: ArticleStatus.DRAFT,
          created_by: session.user.id,
          updated_by: session.user.id,
          tags: {
            connect: data.tag_ids.map(id => ({ id }))
          }
        },
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'Article',
        entity_id: 'NEW',
        action: 'CREATED',
        newData: { title: data.title }
      })
    }

    revalidatePath('/dashboard/articles')
    return { success: true, message: isEdit ? 'Draf berhasil diperbarui.' : 'Draf artikel baru berhasil disimpan.' }

  } catch (error) {
    console.error('Save article draft error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem saat menyimpan artikel.' }
  }
}

export async function submitArticleAction(articleId: string) {
  try {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    })
    
    if (!existingArticle) throw new Error('Artikel tidak ditemukan')

    if (session.user.role === 'ADMIN_KOMISARIAT' && existingArticle.commissariat_id !== session.user.commissariatId) {
      throw new Error('Unauthorized access')
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        status: ArticleStatus.SUBMITTED,
        submitted_at: new Date(),
        updated_by: session.user.id,
      },
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'Article',
      entity_id: articleId,
      action: 'UPDATED',
      newData: { status: 'SUBMITTED' }
    })
    revalidatePath('/dashboard/articles')
    return { success: true, message: 'Artikel berhasil diajukan untuk peninjauan.' }
  } catch (error: unknown) {
    console.error('Submit article error:', error)
    return { success: false, message: (error as Error).message || 'Terjadi kesalahan sistem.' }
  }
}

export async function softDeleteArticleAction(articleId: string) {
  try {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    })
    
    if (!existingArticle) throw new Error('Artikel tidak ditemukan')

    if (session.user.role === 'ADMIN_KOMISARIAT' && existingArticle.commissariat_id !== session.user.commissariatId) {
      throw new Error('Unauthorized access')
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        deleted_at: new Date(),
        deleted_by: session.user.id,
      },
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'Article',
      entity_id: articleId,
      action: 'DELETED',
    })
    revalidatePath('/dashboard/articles')
    return { success: true, message: 'Artikel berhasil dihapus sementara.' }
  } catch (error: unknown) {
    console.error('Soft delete article error:', error)
    return { success: false, message: (error as Error).message || 'Terjadi kesalahan sistem.' }
  }
}
