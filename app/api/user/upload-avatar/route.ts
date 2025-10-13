import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest } from 'next/server'

// POST /api/user/upload-avatar - Upload profile picture to Supabase storage
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response('No file provided', { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return new Response('File too large. Maximum size is 5MB.', {
        status: 400
      })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`

    // Upload file to Supabase storage
    console.log('Uploading file to Supabase storage:', fileName)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return new Response(
        JSON.stringify({
          success: false,
          message: `Failed to upload file: ${uploadError.message}`
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('profile-pictures')
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      return new Response('Failed to get file URL', { status: 500 })
    }

    // Update user profile with new picture URL
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        profile_picture: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      // Try to delete the uploaded file if profile update fails
      await supabaseAdmin.storage.from('profile-pictures').remove([fileName])
      return new Response(
        JSON.stringify({
          success: false,
          message: `Failed to update profile: ${updateError.message}`
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
        data: {
          url: urlData.publicUrl,
          fileName: fileName
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in avatar upload:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

// DELETE /api/user/upload-avatar - Delete profile picture
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get current profile picture URL
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('profile_picture')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      return new Response('Profile not found', { status: 404 })
    }

    if (profile.profile_picture) {
      // Extract filename from URL
      const urlParts = profile.profile_picture.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete file from storage
      const { error: deleteError } = await supabaseAdmin.storage
        .from('profile-pictures')
        .remove([fileName])

      if (deleteError) {
        console.error('Error deleting file:', deleteError)
        // Continue with profile update even if file deletion fails
      }
    }

    // Update profile to remove picture URL
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        profile_picture: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return new Response('Failed to update profile', { status: 500 })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Profile picture deleted successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in avatar deletion:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
