'use server'

import { revalidatePath } from 'next/cache'
import { PrismaClient, DocumentStatus } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { documentSchema } from './schema'
import { ActionState } from '@/shared/lib/action-state'
import { logAuditAction } from '@/shared/lib/audit-logger'
import { uploadSecureFileToCloudinary, deleteFromCloudinary, generateSecureDownloadUrl } from '@/shared/lib/cloudinary'

const prisma = new PrismaClient()

// Auto-seeder category
export async function ensureDocumentCategoriesExist() {
  const count = await prisma.documentCategory.count()
  if (count === 0) {
    await prisma.documentCategory.createMany({
      data: [
        { name: 'Pedoman Pokok (AD/ART)', slug: 'ad-art' },
        { name: 'Standar Operasional (SOP)', slug: 'sop' },
        { name: 'Surat Keputusan / Edaran', slug: 'sk' },
      ],
      skipDuplicates: true
    })
  }
}

export async function saveDocumentAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getUserSession()
    // Hanya Cabang (SYSTEM_ADMIN / ADMIN_CABANG)
    if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
      return { success: false, message: 'Unauthorized. Hanya Admin Cabang yang dapat mengelola dokumen.' }
    }

    const documentId = formData.get('id') as string | null
    const file = formData.get('file') as File | null

    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category_id: formData.get('category_id') as string,
      status: formData.get('status') as string,
      file: file && file.size > 0 ? file : undefined, // If no file, pass undefined to schema
    }

    const validatedFields = documentSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Mohon periksa kembali form anda.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { title, description, category_id, status, file: validatedFile } = validatedFields.data

    if (!documentId && !validatedFile) {
      return { success: false, message: 'File PDF wajib diunggah untuk dokumen baru.' }
    }

    let fileUrl: string | undefined
    let fileSize: number | undefined

    if (validatedFile) {
      // Upload file to secure-documents
      try {
        const uploadResult = await uploadSecureFileToCloudinary(validatedFile, 'secure-documents')
        fileUrl = uploadResult.public_id
        fileSize = validatedFile.size
      } catch (uploadError) {
        console.error('Failed to upload PDF:', uploadError)
        return { success: false, message: 'Gagal mengunggah PDF ke server.' }
      }
    }

    if (documentId) {
      // Update
      const existingDoc = await prisma.document.findUnique({ where: { id: documentId } })
      if (!existingDoc) return { success: false, message: 'Dokumen tidak ditemukan.' }

      // Jika file diganti, hapus file lama dari Cloudinary
      if (fileUrl && existingDoc.file_url) {
        try {
          await deleteFromCloudinary(existingDoc.file_url, 'raw') // Excel/PDF are raw
        } catch (e) {
          console.error('Failed to delete old document from Cloudinary, ignoring.', e)
        }
      }

      // Generate base slug and ensure uniqueness if title changed
      let slug = existingDoc.slug
      if (existingDoc.title !== title) {
        const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        let uniqueSlug = baseSlug
        let counter = 1
        while (await prisma.document.findFirst({ where: { slug: uniqueSlug, id: { not: documentId } } })) {
          uniqueSlug = `${baseSlug}-${counter}`
          counter++
        }
        slug = uniqueSlug
      }

      await prisma.document.update({
        where: { id: documentId },
        data: {
          title,
          slug,
          description,
          category_id,
          status: status as DocumentStatus,
          published_at: status === 'PUBLISHED' && existingDoc.status !== 'PUBLISHED' ? new Date() : existingDoc.published_at,
          updated_by: session.user.id,
          file_url: fileUrl || existingDoc.file_url, // Keep old if not replaced
          file_size: fileSize || existingDoc.file_size,
        }
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'Document',
        entity_id: documentId,
        action: 'UPDATED',
        newData: { title, status }
      })

      revalidatePath('/dashboard/documents')
      return { success: true, message: 'Dokumen berhasil diperbarui.' }

    } else {
      // Create
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      let uniqueSlug = baseSlug
      let counter = 1
      while (await prisma.document.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`
        counter++
      }

      const newDoc = await prisma.document.create({
        data: {
          title,
          slug: uniqueSlug,
          description,
          category_id,
          status: status as DocumentStatus,
          published_at: status === 'PUBLISHED' ? new Date() : null,
          created_by: session.user.id,
          updated_by: session.user.id,
          file_url: fileUrl!,
          file_size: fileSize,
        }
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'Document',
        entity_id: newDoc.id,
        action: 'CREATED',
        newData: { title, status }
      })

      revalidatePath('/dashboard/documents')
      return { success: true, message: 'Dokumen berhasil ditambahkan.' }
    }

  } catch (error: unknown) {
    console.error('Save document error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem.' }
  }
}

export async function getSignedDocumentUrlAction(publicId: string) {
  // Hanya pengguna terautentikasi yang bisa mengambil (bisa ditambah cek RBAC jika mau)
  const session = await getUserSession()
  if (!session) return { success: false, url: null }

  const url = generateSecureDownloadUrl(publicId, 'raw')
  return { success: true, url }
}

export async function softDeleteDocumentAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getUserSession()
    if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
      return { success: false, message: 'Unauthorized' }
    }

    // Soft delete: set deleted_at (tidak menghapus dari cloudinary untuk arsip, unless explicitly required. ROADMAP says "saat record dihapus". Kita soft delete dulu, mungkin cloudinary dihapus kalau hard delete. Tapi di sini kita soft delete saja.)
    await prisma.document.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: session.user.id
      }
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'Document',
      entity_id: id,
      action: 'DELETED',
      newData: { soft_delete: true }
    })

    revalidatePath('/dashboard/documents')
    return { success: true, message: 'Dokumen berhasil dihapus (soft delete).' }
  } catch (error) {
    console.error('Delete document error:', error)
    return { success: false, message: 'Gagal menghapus dokumen.' }
  }
}
