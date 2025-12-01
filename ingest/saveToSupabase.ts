import type { SupabaseClient } from '@supabase/supabase-js'
import type { NormalizedArticle, SaveToSupabaseOptions } from './types.js'

export async function saveArticleToSupabase(
  supabase: SupabaseClient,
  article: NormalizedArticle,
  options?: SaveToSupabaseOptions
): Promise<{ id: string } | null> {
  return null
}

export async function saveArticlesToSupabase(
  supabase: SupabaseClient,
  articles: NormalizedArticle[],
  options?: SaveToSupabaseOptions
): Promise<{ id: string }[]> {
  return []
}

export async function checkArticleExists(
  supabase: SupabaseClient,
  hash: string,
  table?: string
): Promise<boolean> {
  return false
}
