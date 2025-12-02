// ingest/singleFeed.ts
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { runSingleSource } from './index.js'

dotenv.config({ path: '.env.local' })

async function main() {
  const sourceId = process.argv[2]

  if (!sourceId) {
    console.error('❌ Usage: npm run ingest:one <source_id>')
    process.exit(1)
  }

  // Check both SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL for compatibility
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      '❌ Missing required environment variables (SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'
    )
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: source, error } = await supabase
    .from('sources')
    .select('*')
    .eq('id', sourceId)
    .maybeSingle()

  if (error) {
    console.error('❌ Error fetching source:', error)
    process.exit(1)
  }

  if (!source) {
    console.error(`❌ No source found with id: ${sourceId}`)
    process.exit(1)
  }

  console.log(`⚡ Running single feed: ${source.name}`)
  const stats = await runSingleSource(source)

  console.log(
    `✅ Done. fetched: ${stats.fetched}, inserted: ${stats.inserted}, duplicates: ${stats.duplicates}, errors: ${stats.errors}`
  )
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Fatal error in single feed ingestion:', err)
  process.exit(1)
})
