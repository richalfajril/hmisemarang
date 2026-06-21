'use server'

import { uploadFileToCloudinary } from '@/shared/lib/cloudinary'

export async function uploadMediaAction(formData: FormData, folder: string) {
  try {
    const file = formData.get('file') as File | null
    if (!file) {
      throw new Error('No file provided')
    }

    // You can add file size and type validation here
    // e.g., if (file.size > 5 * 1024 * 1024) throw new Error('File too large')

    const result = await uploadFileToCloudinary(file, folder)
    return { success: true, url: result.secure_url, publicId: result.public_id }
  } catch (error: unknown) {
    console.error('Failed to upload media:', error)
    return { success: false, error: (error as Error).message || 'Failed to upload media' }
  }
}
