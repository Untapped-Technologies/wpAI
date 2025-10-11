import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

// POST /api/auth/forgot-password - Handle forgot password
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return new Response('Email is required', { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`
    })

    if (error) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password reset email sent'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in auth forgot-password POST:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
