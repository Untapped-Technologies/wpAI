import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()

    // Check if a subscription row already exists
    const { data: existing, error: existingError } = await supabase
      .from('user_subscriptions')
      .select('id, stripe_subscription_id, trial_end, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingError) {
      console.error('trial/start read error:', existingError)
    }

    const now = Date.now()
    const trialEnd = new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString()
    const trialStart = new Date(now).toISOString()

    // If already on paid subscription, do nothing
    if (existing?.stripe_subscription_id) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    if (!existing) {
      // Create trial subscription row
      const { error: insertErr } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: 'trial',
          stripe_price_id: 'price_trial',
          status: 'active',
          trial_start: trialStart,
          trial_end: trialEnd
        })
      if (insertErr) {
        console.error('trial/start insert error:', insertErr)
      }
    } else if (!existing.trial_end) {
      // Update to add trial fields
      const { error: updateErr } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'active',
          trial_start: trialStart,
          trial_end: trialEnd
        })
        .eq('id', existing.id)
      if (updateErr) {
        console.error('trial/start update error:', updateErr)
      }
    }

    // Ensure an access level exists (default to basic during trial)
    const { data: accessRow } = await supabase
      .from('user_access_levels')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (!accessRow) {
      await supabase.from('user_access_levels').insert({
        user_id: userId,
        plan_id: 'trial',
        access_level: 'basic',
        features: {},
        limits: {}
      })
    }

    return NextResponse.json({ ok: true, trial_end: trialEnd })
  } catch (e) {
    console.error('trial/start error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
