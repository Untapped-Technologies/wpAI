import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache with TTL, keyed by interval
type CacheEntry = { data: any; cachedAt: number }
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const pricingCache: Record<string, CacheEntry | undefined> = {}

export async function GET(req: NextRequest) {
  const intervalParam = req.nextUrl.searchParams.get('interval')
  const interval =
    intervalParam === 'month' || intervalParam === 'annual'
      ? intervalParam
      : 'all'

  // Serve from cache if fresh
  const cached = pricingCache[interval]
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json(
      { data: cached.data },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=300, max-age=120, stale-while-revalidate=60',
          'X-Cache': 'HIT'
        }
      }
    )
  }

  // Fetch fresh data
  let query = supabaseAdmin
    .from('plans')
    .select('*, plan_features(feature, description)')
    .eq('is_active', true)
    .order('sort')

  if (interval !== 'all') {
    query = query.eq('interval', interval)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Populate cache
  pricingCache[interval] = { data, cachedAt: Date.now() }

  return NextResponse.json(
    { data },
    {
      headers: {
        'Cache-Control':
          'public, s-maxage=300, max-age=120, stale-while-revalidate=60',
        'X-Cache': 'MISS'
      }
    }
  )
}
