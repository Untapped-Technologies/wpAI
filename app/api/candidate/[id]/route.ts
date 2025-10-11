import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest } from 'next/server'

// GET /api/candidate/[id] - Fetch public candidate profile by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return new Response('Candidate ID is required', { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('candidate_profile, preferences, onboarding_completed, approved')
      .eq('user_id', id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching candidate profile:', error)
      return new Response(error.message, { status: 500 })
    }

    // Try candidate_profile column first, then fallback to preferences
    const candidateData =
      data?.candidate_profile || data?.preferences?.candidate_profile

    if (!candidateData) {
      return new Response('No candidate profile data found', { status: 404 })
    }

    // Check if profile is approved (onboarding completed and approved)
    if (!data?.onboarding_completed) {
      return new Response('This candidate profile is not yet approved', {
        status: 403
      })
    }

    // Check if candidate review has been approved
    if (!data?.approved) {
      return new Response('This candidate profile is not publicly visible', {
        status: 403
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          candidateProfile: candidateData,
          onboardingCompleted: data?.onboarding_completed
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in candidate public profile GET:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
