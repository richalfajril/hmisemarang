'use server'
import { prisma } from '@/shared/api/prisma/client'

import { revalidatePath } from 'next/cache'
import { GalleryStatus } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { albumSchema, photoSchema } from '@/entities/gallery/model/schema'
import { ActionState } from '@/shared/lib/action-state'
import { logAuditAction } from '@/shared/lib/audit-logger'
import { uploadFileToCloudinary, deleteFromCloudinary } from '@/shared/lib/cloudinary'



// -- ALBUM ACTIONS --

export async function saveAlbumAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getUserSession()
    if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
      return { success: false, message: 'Unauthorized.' }
    }

    const albumId = formData.get('id') as string | null
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
    }

    const validatedFields = albumSchema.safeParse(rawData)
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Mohon periksa kembali form anda.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { title, description, status } = validatedFields.data

    if (albumId) {
      const existing = await prisma.galleryAlbum.findUnique({ where: { id: albumId } })
      if (!existing) return { success: false, message: 'Album tidak ditemukan.' }

      let slug = existing.slug
      if (existing.title !== title) {
        const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        let uniqueSlug = baseSlug
        let counter = 1
        while (await prisma.galleryAlbum.findFirst({ where: { slug: uniqueSlug, id: { not: albumId } } })) {
          uniqueSlug = `${baseSlug}-${counter}`
          counter++
        }
        slug = uniqueSlug
      }

      await prisma.galleryAlbum.update({
        where: { id: albumId },
        data: {
          title,
          slug,
          description,
          status: status as GalleryStatus,
          updated_by: session.user.id
        }
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'GalleryAlbum',
        entity_id: albumId,
        action: 'UPDATED',
        newData: { title, status }
      })

      revalidatePath('/dashboard/galleries')
      revalidatePath(`/dashboard/galleries/${albumId}`)
      return { success: true, message: 'Album berhasil diperbarui.' }

    } else {
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      let uniqueSlug = baseSlug
      let counter = 1
      while (await prisma.galleryAlbum.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`
        counter++
      }

      const newAlbum = await prisma.galleryAlbum.create({
        data: {
          title,
          slug: uniqueSlug,
          description,
          status: status as GalleryStatus,
          created_by: session.user.id,
          updated_by: session.user.id,
        }
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'GalleryAlbum',
        entity_id: newAlbum.id,
        action: 'CREATED',
        newData: { title, status }
      })

      revalidatePath('/dashboard/galleries')
      return { success: true, message: 'Album berhasil dibuat.' }
    }
  } catch (error) {
    console.error('Save album error:', error)
    return { success: false, message: 'Gagal menyimpan album.' }
  }
}

export async function softDeleteAlbumAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getUserSession()
    if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.galleryAlbum.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: session.user.id
      }
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'GalleryAlbum',
      entity_id: id,
      action: 'DELETED',
      newData: { soft_delete: true }
    })

    revalidatePath('/dashboard/galleries')
    return { success: true, message: 'Album berhasil dihapus (soft delete).' }
  } catch (error) {
    console.error('Delete album error:', error)
    return { success: false, message: 'Gagal menghapus album.' }
  }
}

// -- PHOTO ACTIONS --

export async function uploadSinglePhotoAction(albumId: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getUserSession()
    if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
      return { success: false, message: 'Unauthorized' }
    }

    const file = formData.get('file') as File | null
    if (!file) return { success: false, message: 'File tidak ditemukan.' }

    const validated = photoSchema.safeParse({ file })
    if (!validated.success) {
      const issues = validated.error.issues
      return { success: false, message: issues[0]?.message || 'File tidak valid.' }
    }

    const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } })
    if (!album) return { success: false, message: 'Album tidak ditemukan.' }

    // Upload to Cloudinary under generic media or gallery
    const uploadResult = await uploadFileToCloudinary(file, 'image')
    const imageUrl = uploadResult.public_id

    // Check count for sorting
    const count = await prisma.galleryPhoto.count({ where: { album_id: albumId } })

    await prisma.galleryPhoto.create({
      data: {
        album_id: albumId,
        image_url: imageUrl,
        sort_order: count + 1
      }
    })

    // If album has no cover image yet, set it automatically
    if (!album.cover_image_url) {
      await prisma.galleryAlbum.update({
        where: { id: albumId },
        data: { cover_image_url: imageUrl }
      })
    }

    revalidatePath(`/dashboard/galleries/${albumId}`)
    return { success: true, message: 'Berhasil mengunggah foto.' }
  } catch (error) {
    console.error('Upload photo error:', error)
    return { success: false, message: 'Gagal mengunggah foto.' }
  }
}

export async function setAlbumCoverAction(albumId: string, photoId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getUserSession()
    if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
      return { success: false, message: 'Unauthorized' }
    }

    const photo = await prisma.galleryPhoto.findUnique({ where: { id: photoId } })
    if (!photo || photo.album_id !== albumId) return { success: false, message: 'Foto tidak valid.' }

    await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: { cover_image_url: photo.image_url }
    })

    revalidatePath(`/dashboard/galleries/${albumId}`)
    revalidatePath('/dashboard/galleries')
    return { success: true, message: 'Cover album berhasil diperbarui.' }
  } catch (error) {
    console.error('Set cover error:', error)
    return { success: false, message: 'Gagal memperbarui cover album.' }
  }
}

export async function deletePhotoAction(photoId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getUserSession()
    if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
      return { success: false, message: 'Unauthorized' }
    }

    const photo = await prisma.galleryPhoto.findUnique({ where: { id: photoId }, include: { album: true } })
    if (!photo) return { success: false, message: 'Foto tidak ditemukan.' }

    // Delete from DB first
    await prisma.galleryPhoto.delete({ where: { id: photoId } })

    // Clean up cover image if it was the cover
    if (photo.album.cover_image_url === photo.image_url) {
      const remaining = await prisma.galleryPhoto.findFirst({ where: { album_id: photo.album_id } })
      await prisma.galleryAlbum.update({
        where: { id: photo.album_id },
        data: { cover_image_url: remaining ? remaining.image_url : null }
      })
    }

    // Attempt to remove from Cloudinary
    try {
      await deleteFromCloudinary(photo.image_url)
    } catch (e) {
      console.error('Failed to delete from Cloudinary:', e)
    }

    revalidatePath(`/dashboard/galleries/${photo.album_id}`)
    return { success: true, message: 'Foto berhasil dihapus.' }
  } catch (error) {
    console.error('Delete photo error:', error)
    return { success: false, message: 'Gagal menghapus foto.' }
  }
}
