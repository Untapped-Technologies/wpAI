import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const countryCode = params.id // e.g., 'US'

  const { data, error } = await supabaseAdmin
    .from('user_types')
    .select('id, label, description, country_code')
    .eq('country_code', countryCode)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data, { status: 200 })
}
