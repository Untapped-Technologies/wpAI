import type { SupabaseClient } from '@supabase/supabase-js'
import type { UploadImageOptions } from './types.js'

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
