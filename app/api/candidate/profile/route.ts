import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest } from 'next/server'

// GET /api/candidate/profile - Fetch candidate profile data
export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select(
        'candidate_profile, preferences, onboarding_completed, onboarding_completed_at, approved, rejected_message'
      )
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching candidate profile:', error)
      return new Response(error.message, { status: 500 })
    }

    // Try candidate_profile column first, then fallback to preferences
    const candidateData =
      data?.candidate_profile || data?.preferences?.candidate_profile

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          candidateProfile: candidateData,
          onboardingCompleted: data?.onboarding_completed,
          onboardingCompletedAt: data?.onboarding_completed_at,
          approved: data?.approved,
          rejectedMessage: data?.rejected_message,
          preferences: data?.preferences
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in candidate profile GET:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

// POST /api/candidate/profile - Save candidate profile data
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { candidateData } = body

    if (!candidateData) {
      return new Response('Candidate data is required', { status: 400 })
    }

    // First, check if the profile exists and what columns are available
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('id, user_id, preferences')
      .eq('user_id', userId)
      .maybeSingle()

    if (checkError) {
      return new Response(checkError.message, { status: 500 })
    }

    if (!existingProfile) {
      return new Response('No profile found for this user', { status: 404 })
    }

    // Try to update using candidate_profile column first, fallback to preferences
    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Try candidate_profile column first
    try {
      updateData.candidate_profile = candidateData
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select()

      if (!error && data && data.length > 0) {
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
      }
    } catch (err) {
      // Fallback to preferences column
    }

    // Fallback: store in preferences column
    const currentPreferences = existingProfile.preferences || {}
    const updatedPreferences = {
      ...currentPreferences,
      candidate_profile: candidateData
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        preferences: updatedPreferences,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()

    if (error) {
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
    console.error('Error in candidate profile POST:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
