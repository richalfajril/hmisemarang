export function getOptimizedUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'
  // If publicId is already a full URL, return as is
  if (publicId.startsWith('http')) return publicId
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`
}
