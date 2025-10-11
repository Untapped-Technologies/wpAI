import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

// POST /api/auth/logout - Handle user logout
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logged out successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in auth logout POST:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
