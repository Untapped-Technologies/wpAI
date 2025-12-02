/**
 * Converts a storage path to a public Supabase Storage URL
 * @param path - The storage path (e.g., "articles/123/image.jpg")
 * @returns The full public URL to the image
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null

  return `${supabaseUrl}/storage/v1/object/public/article-media/${path}`
}

