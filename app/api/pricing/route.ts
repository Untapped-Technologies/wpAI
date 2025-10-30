import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  let query = supabaseAdmin
    .from('plans')
    .select('*, plan_features(feature, description)')
    .eq('is_active', true)
    .order('sort')

  // Optional filter by billing interval: 'month' | 'annual'
  const interval = req.nextUrl.searchParams.get('interval')
  if (interval === 'month' || interval === 'annual') {
    query = query.eq('interval', interval)
  }

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(
    {
      data
    },
    {
      headers: {
        // Cache for 5 minutes, allow stale while revalidating for 1 minute
        'Cache-Control':
          'public, s-maxage=300, max-age=120, stale-while-revalidate=60'
      }
    }
  )
}
