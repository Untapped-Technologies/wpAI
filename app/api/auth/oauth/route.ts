import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

// POST /api/auth/oauth - Handle OAuth login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { provider, redirectTo } = body

    if (!provider) {
      return new Response('Provider is required', { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/oauth`
      }
    })

    if (error) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in auth oauth POST:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
