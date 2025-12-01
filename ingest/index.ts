// Main entry point for the ingestion engine
export * from './types.js'
export * from './rssSources.js'
export * from './fetchRss.js'
export * from './normalize.js'
export * from './uploadImage.js'
export * from './saveToSupabase.js'
export * from './utils/hash.js'

import { fetchRssFeed } from './fetchRss.js'
import { normalizeRssItem } from './normalize.js'
import { downloadAndUploadImage } from './uploadImage.js'
import { saveArticle } from './saveToSupabase.js'
import { getEnabledRssSources } from './rssSources.js'
import { createClient } from '@supabase/supabase-js'
import type { RssSource, NormalizedArticle } from './types.js'

/**
 * Updates the main_image_storage_path for an article
 */
async function updateArticleImagePath(
  articleId: string,
  storagePath: string
): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration')
    return false
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { error } = await supabase
      .from('articles')
      .update({ main_image_storage_path: storagePath })
      .eq('id', articleId)

    if (error) {
      console.error(`Error updating article image path for ${articleId}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error updating article image path:', error)
    return false
  }
}

/**
 * Processes a single RSS source
 */
async function processSource(source: RssSource): Promise<{
  fetched: number
  inserted: number
  errors: number
}> {
  const stats = {
    fetched: 0,
    inserted: 0,
    errors: 0,
  }

  console.log(`\n📡 Processing source: ${source.name} (${source.url})`)

  try {
    // Step 1: Fetch RSS feed
    console.log(`  → Fetching RSS feed...`)
    const rawItems = await fetchRssFeed(source.url)
    stats.fetched = rawItems.length
    console.log(`  ✓ Fetched ${rawItems.length} items`)

    if (rawItems.length === 0) {
      console.log(`  ⚠ No items found in feed`)
      return stats
    }

    // Step 2: Process each item
    for (let i = 0; i < rawItems.length; i++) {
      const rawItem = rawItems[i]
      try {
        // Normalize the item
        const normalizedArticle = normalizeRssItem(rawItem, source.name)
        console.log(`  → Processing item ${i + 1}/${rawItems.length}: "${normalizedArticle.title.substring(0, 60)}..."`)

        // Save article to Supabase (with deduplication)
        const result = await saveArticle(normalizedArticle)

        if (!result.id) {
          console.log(`    ✗ Failed to save article`)
          stats.errors++
          continue
        }

        // If article was newly inserted and has an image URL, download and upload image
        if (result.inserted && normalizedArticle.mainImageUrl) {
          console.log(`    → Downloading and uploading image...`)
          const storagePath = await downloadAndUploadImage(
            normalizedArticle.mainImageUrl,
            result.id
          )

          if (storagePath) {
            // Update article with storage path
            const updated = await updateArticleImagePath(result.id, storagePath)
            if (updated) {
              console.log(`    ✓ Image uploaded: ${storagePath}`)
            } else {
              console.log(`    ⚠ Image uploaded but failed to update article record`)
            }
          } else {
            console.log(`    ⚠ Failed to download/upload image`)
          }
        } else if (result.inserted) {
          console.log(`    ✓ Article inserted (no image URL)`)
        } else {
          console.log(`    ✓ Article already exists (skipped)`)
        }

        if (result.inserted) {
          stats.inserted++
        }
      } catch (error) {
        console.error(`    ✗ Error processing item ${i + 1}:`, error)
        stats.errors++
      }
    }

    return stats
  } catch (error) {
    console.error(`  ✗ Error processing source ${source.name}:`, error)
    stats.errors++
    return stats
  }
}

/**
 * Main ingestion pipeline
 */
async function main() {
  console.log('🚀 Starting RSS ingestion pipeline...\n')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:')
    console.error('   - NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  // Fetch enabled RSS sources
  console.log('📋 Fetching enabled RSS sources...')
  const sources = await getEnabledRssSources()

  if (sources.length === 0) {
    console.log('⚠ No enabled RSS sources found')
    process.exit(0)
  }

  console.log(`✓ Found ${sources.length} enabled source(s)\n`)

  // Process each source
  const overallStats = {
    totalFetched: 0,
    totalInserted: 0,
    totalErrors: 0,
    sourceErrors: 0,
  }

  for (const source of sources) {
    const stats = await processSource(source)
    overallStats.totalFetched += stats.fetched
    overallStats.totalInserted += stats.inserted
    overallStats.totalErrors += stats.errors

    if (stats.errors > 0 && stats.errors === stats.fetched) {
      // All items failed for this source
      overallStats.sourceErrors++
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Ingestion Summary')
  console.log('='.repeat(60))
  console.log(`Total items fetched:     ${overallStats.totalFetched}`)
  console.log(`Total items inserted:     ${overallStats.totalInserted}`)
  console.log(`Total errors:             ${overallStats.totalErrors}`)
  console.log(`Sources with errors:      ${overallStats.sourceErrors}`)
  console.log('='.repeat(60))

  if (overallStats.totalErrors > 0) {
    console.log('\n⚠ Some errors occurred during ingestion. Check logs above.')
    process.exit(1)
  } else {
    console.log('\n✓ Ingestion completed successfully!')
    process.exit(0)
  }
}

// Run the pipeline if this file is executed directly
// Works with Bun, ts-node, and Node.js
const isMainModule = (() => {
  // Bun
  if (typeof import.meta.main !== 'undefined' && import.meta.main) {
    return true
  }
  // Node.js/ts-node - check if this file is being executed directly
  if (typeof process !== 'undefined' && process.argv[1]) {
    const scriptPath = process.argv[1].replace(/\\/g, '/')
    const currentPath = import.meta.url.replace('file://', '').replace(/\\/g, '/')
    return currentPath.endsWith(scriptPath) || scriptPath.endsWith('ingest/index.ts')
  }
  return false
})()

if (isMainModule) {
  main().catch((error) => {
    console.error('❌ Fatal error in ingestion pipeline:', error)
    process.exit(1)
  })
}

