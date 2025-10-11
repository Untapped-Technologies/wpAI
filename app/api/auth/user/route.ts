import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest } from 'next/server'

// GET /api/auth/user - Get current authenticated user
export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { data: user, error } =
      await supabaseAdmin.auth.admin.getUserById(userId)

    if (error) {
      console.error('Error fetching user:', error)
      return new Response(error.message, { status: 500 })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: user.user
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in auth user GET:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
