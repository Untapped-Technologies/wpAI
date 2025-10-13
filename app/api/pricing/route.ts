import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  let query = supabaseAdmin
    .from('plans')
    .select('*, plan_features(feature, description)')
    .eq('is_active', true)
    .order('id')

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data
  })
}
