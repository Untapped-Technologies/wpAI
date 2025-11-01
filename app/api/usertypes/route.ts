import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const countryCode = searchParams.get('country_code')

    console.log('User types API called with country_code:', countryCode)

    // Build query - always filter by active status (status is boolean, true = active)
    let query = supabaseAdmin.from('user_types').select('*').eq('status', true)

    // Filter by country code if provided
    if (countryCode) {
      // Match country code OR 'WW' (worldwide/expats) which applies to all countries
      // Using .in() for multiple values: show types for user's country or worldwide types
      query = query.in('country_code', [countryCode, 'US'])
    } else {
      // If no country code provided, only show worldwide types
      query = query.eq('country_code', 'US')
    }

    const { data, error } = await query.order('label', { ascending: true })

    if (error) {
      console.error('Error fetching user types:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('User types query returned:', data?.length || 0, 'results')
    return NextResponse.json(data || [], { status: 200 })
  } catch (error) {
    console.error('Error in user types GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
