import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const scope = searchParams.get('scope') || 'local'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const country_code = searchParams.get('country_code')
  const postal_code = searchParams.get('postal_code')
  const region = searchParams.get('region')

  const offset = (page - 1) * limit

  let query = supabaseAdmin
    .from('trending_topics')
    .select('*', { count: 'exact' })
    .eq('location_type', scope)
    .eq('is_active', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (country_code) query = query.eq('country_code', country_code)
  if (postal_code) query = query.eq('postal_code', postal_code)
  if (region) query = query.eq('region', region)

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data,
    total: count,
    totalPages: Math.ceil((count || 0) / limit)
  })
}
