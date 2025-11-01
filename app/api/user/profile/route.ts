import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest } from 'next/server'

// GET /api/user/profile - Fetch user profile data
export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user profile:', error)
      return new Response(error.message, { status: 500 })
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
    console.error('Error in user profile GET:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

// PATCH /api/user/profile - Update user profile data
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    // Explicitly exclude email from updates - email cannot be changed after registration
    const { display_name, user_type_id, bio, preferences, profile_picture } =
      body

    // Check if profile exists to determine if we need to include email
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('user_id, email')
      .eq('user_id', userId)
      .maybeSingle()

    const updateData: any = {
      user_id: userId,
      updated_at: new Date().toISOString()
    }

    // Include email for new profiles (when creating)
    if (!existingProfile) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId)
      if (authUser?.user?.email) {
        updateData.email = authUser.user.email
      }
    }

    if (display_name !== undefined) updateData.display_name = display_name
    // Only include user_type_id if it's provided and not an empty string (UUID fields can't be empty strings)
    if (user_type_id !== undefined && user_type_id !== null && user_type_id !== '') {
      updateData.user_type_id = user_type_id
    }
    if (bio !== undefined) updateData.bio = bio
    if (preferences !== undefined) updateData.preferences = preferences
    if (profile_picture !== undefined)
      updateData.profile_picture = profile_picture

    // Use upsert to create or update the profile
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(updateData, { onConflict: 'user_id' })
      .select()

    if (error) {
      console.error('Error upserting user profile:', error)
      return new Response(
        JSON.stringify({
          success: false,
          message: `Database error: ${error.message}`
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to save profile'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
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
    console.error('Error in user profile PATCH:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
