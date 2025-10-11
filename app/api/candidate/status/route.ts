import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest } from 'next/server'

// GET /api/candidate/status - Check if user is a candidate and onboarding status
export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('user_type_id, onboarding_completed, onboarding_completed_at')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user status:', error)
      return new Response(error.message, { status: 500 })
    }

    if (!data) {
      return new Response('Profile not found', { status: 404 })
    }

    // Check if user is a candidate (ID: 3dad0f25-2b3b-491b-9e82-9f9e71adad6f)
    const candidateTypeId = '3dad0f25-2b3b-491b-9e82-9f9e71adad6f'
    const isCandidate = data.user_type_id === candidateTypeId

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          isCandidate,
          onboardingCompleted: data.onboarding_completed,
          onboardingCompletedAt: data.onboarding_completed_at,
          userTypeId: data.user_type_id
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in candidate status GET:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
