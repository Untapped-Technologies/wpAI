import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

// POST /api/auth/signup - Handle user signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, userType, locationData } = body

    if (!email || !password) {
      return new Response('Email and password are required', { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/oauth?next=/auth/oauth/oauth-callback`
      }
    })

    if (error) {
      return new Response(error.message, { status: 400 })
    }

    // Create user profile with selected user type
    if (data.user) {
      try {
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id,
          email: data.user.email,
          display_name: data.user.email?.split('@')[0] || 'User',
          user_type_id: userType,
          preferences: locationData || {},
          updated_at: new Date().toISOString()
        })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't fail the signup if profile creation fails
        }
      } catch (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail the signup if profile creation fails
      }
    }

    const candidateTypeId = '3dad0f25-2b3b-491b-9e82-9f9e71adad6f'
    const needsOnboarding = userType === candidateTypeId

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: data.user,
          session: data.session,
          needsEmailConfirmation: !data.user?.email_confirmed_at,
          needsOnboarding,
          redirectPath: needsOnboarding
            ? '/candidate-onboarding'
            : '/user/profile'
        }
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in auth signup POST:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
