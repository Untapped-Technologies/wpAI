import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UploadImageOptions } from './types.js'

/**
 * Maps content-type to file extension
 */
function getExtensionFromContentType(contentType: string): string {
  const contentTypeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico'
  }

  // Extract base content type (remove charset, etc.)
  const baseType = contentType.split(';')[0].trim().toLowerCase()
  return contentTypeMap[baseType] || 'jpg' // Default to jpg if unknown
}

/**
 * Extracts file extension from URL
 */
function getExtensionFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const lastDot = pathname.lastIndexOf('.')
    if (lastDot !== -1 && lastDot < pathname.length - 1) {
      const ext = pathname.substring(lastDot + 1).toLowerCase()
      // Remove query params if any
      const cleanExt = ext.split('?')[0].split('#')[0]
      // Validate extension (common image extensions)
      const validExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico']
      if (validExts.includes(cleanExt)) {
        return cleanExt === 'jpeg' ? 'jpg' : cleanExt
      }
    }
  } catch {
    // Invalid URL, fall through to default
  }
  return 'jpg' // Default extension
}

/**
 * Downloads an image from a URL and uploads it to Supabase Storage
 * @param url - The URL of the image to download
 * @param articleId - The article ID to use in the storage path
 * @returns The storage path on success, null on failure
 */
export async function downloadAndUploadImage(
  url: string,
  articleId: string
): Promise<string | null> {
  try {
    // Fetch the image
    const response = await fetch(url)
    if (!response.ok) {
      return null
    }

    // Get content type and determine extension
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    // Try to get extension from URL first, fallback to content-type
    const extensionFromUrl = getExtensionFromUrl(url)
    const extensionFromContentType = getExtensionFromContentType(contentType)
    const extension = extensionFromUrl !== 'jpg' || contentType.includes('image/') 
      ? extensionFromUrl 
      : extensionFromContentType

    // Get image data as buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return null
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upload to Supabase Storage: articles/<articleId>/image.<ext>
    const storagePath = `articles/${articleId}/image.${extension}`
    const { error } = await supabase.storage
      .from('article-media')
      .upload(storagePath, buffer, {
        contentType,
        upsert: true
      })

    if (error) {
      console.error('Error uploading image to Supabase:', error)
      return null
    }

    // Return storagePath (not full URL)
    return storagePath
  } catch (error) {
    console.error('Error downloading/uploading image:', error)
    return null
  }
}

export async function uploadImage(
  supabase: SupabaseClient,
  imageUrl: string,
  articleId: string,
  options?: UploadImageOptions
): Promise<string | null> {
  return null
}

export async function uploadImages(
  supabase: SupabaseClient,
  imageUrls: string[],
  articleId: string,
  options?: UploadImageOptions
): Promise<string[]> {
  return []
}

export async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  return null
}
