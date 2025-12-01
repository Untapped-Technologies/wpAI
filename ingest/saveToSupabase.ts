import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NormalizedArticle, SaveToSupabaseOptions } from './types.js'
import { sha256 } from './utils/hash.js'

/**
 * Saves an article to Supabase with de-duplication based on URL hash
 * @param article - The normalized article to save
 * @returns The article ID if successful, null otherwise, and whether it was newly inserted
 */
export async function saveArticle(
  article: NormalizedArticle
): Promise<{ id: string | null; inserted: boolean }> {
  // Create Supabase client with service role key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration')
    return { id: null, inserted: false }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Step 1: Compute URL hash
    const urlHash = sha256(article.url)

    // Step 2: Check if article already exists
    const { data: existingArticle, error: checkError } = await supabase
      .from('articles')
      .select('id')
      .eq('url_hash', urlHash)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is expected, other errors are real issues
      console.error('Error checking for existing article:', checkError)
      return { id: null, inserted: false }
    }

    // If article exists, return existing ID
    if (existingArticle) {
      return { id: existingArticle.id, inserted: false }
    }

    // Step 3: Lookup source_id from sources table
    let sourceId: string | null = null
    if (article.sourceName) {
      const { data: source, error: sourceError } = await supabase
        .from('sources')
        .select('id')
        .eq('name', article.sourceName)
        .maybeSingle()

      if (sourceError && sourceError.code !== 'PGRST116') {
        console.error('Error looking up source:', sourceError)
        // Continue with null source_id as fallback
      } else if (source) {
        sourceId = source.id
      }
    }

    // Step 4: Insert new article
    const { data: insertedArticle, error: insertError } = await supabase
      .from('articles')
      .insert({
        source_id: sourceId,
        external_id: article.externalId,
        url: article.url,
        url_hash: urlHash,
        title: article.title,
        summary: article.summary,
        content_text: article.summary, // Using summary for now as per requirements
        author: article.author,
        published_at: article.publishedAt?.toISOString() || null,
        main_image_source_url: article.mainImageUrl,
        main_image_storage_path: null // Placeholder for now, will be updated later
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Error inserting article:', insertError)
      return { id: null, inserted: false }
    }

    // Step 5: Return inserted article ID
    return { id: insertedArticle.id, inserted: true }
  } catch (error) {
    console.error('Unexpected error saving article:', error)
    return { id: null, inserted: false }
  }
}

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
