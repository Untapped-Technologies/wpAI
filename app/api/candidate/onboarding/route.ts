import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest } from 'next/server'

// PATCH /api/candidate/onboarding - Update onboarding completion status
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { onboardingCompleted = true } = body

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        onboarding_completed: onboardingCompleted,
        onboarding_completed_at: onboardingCompleted
          ? new Date().toISOString()
          : null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('Error updating onboarding status:', error)
      return new Response(error.message, { status: 500 })
    }

    if (!data || data.length === 0) {
      return new Response('Update failed - no rows affected', { status: 500 })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: data[0]
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in candidate onboarding PATCH:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
