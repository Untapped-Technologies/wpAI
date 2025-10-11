import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

// POST /api/auth/login - Handle user login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return new Response('Email and password are required', { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return new Response(error.message, { status: 401 })
    }

    // Check if user is a candidate and needs onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type_id, onboarding_completed')
      .eq('user_id', data.user.id)
      .single()

    const candidateTypeId = '3dad0f25-2b3b-491b-9e82-9f9e71adad6f'
    const needsOnboarding =
      profile?.user_type_id === candidateTypeId &&
      !profile?.onboarding_completed

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: data.user,
          session: data.session,
          needsOnboarding,
          redirectPath: needsOnboarding
            ? '/candidate-onboarding'
            : '/user/profile'
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in auth login POST:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
