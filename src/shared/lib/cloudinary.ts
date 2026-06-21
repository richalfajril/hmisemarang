import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a Web File object (from FormData) to Cloudinary via stream.
 * 
 * @param file The File object to upload
 * @param folder The target folder in Cloudinary
 * @param options Additional upload options (e.g. { type: 'private' } for secure docs)
 * @returns UploadApiResponse from Cloudinary
 */
export async function uploadFileToCloudinary(
  file: File,
  folder: string,
  options?: UploadApiOptions
): Promise<UploadApiResponse> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadOptions: UploadApiOptions = {
      folder,
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Upload to Cloudinary failed with no result.'));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes a file from Cloudinary given its public_id.
 * 
 * @param publicId The unique public ID of the resource
 * @param resourceType The resource type (image, video, raw)
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary:`, error);
    throw error;
  }
}

/**
 * Generates an optimized public URL using Cloudinary transformations (WebP/AVIF, auto quality).
 * 
 * @param publicId The public ID of the resource
 */
export function getOptimizedUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  });
}

/**
 * Generates a signed URL for private/authenticated assets (like Excel cadre verifications).
 * 
 * @param publicId The public ID of the resource
 * @param resourceType The resource type (default: raw for excel/docs)
 */
export function generateSecureDownloadUrl(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): string {
  return cloudinary.url(publicId, {
    type: 'authenticated',
    resource_type: resourceType,
    sign_url: true, // Generate signed URL
    expires_at: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
  });
}

/**
 * Upload secure file to Cloudinary with type="authenticated"
 */
export async function uploadSecureFileToCloudinary(
  file: File,
  folder: string = 'secure-verifications'
): Promise<{ secure_url: string; public_id: string }> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        type: 'authenticated',
        resource_type: 'raw', // Used for documents/excel
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'))
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          })
        }
      }
    )

    uploadStream.end(buffer)
  })
}
