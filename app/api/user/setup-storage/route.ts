import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest } from 'next/server'

// GET /api/user/setup-storage - Check and create storage bucket
export async function GET(req: NextRequest) {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return new Response(
        JSON.stringify({
          success: false,
          message: `Error listing buckets: ${listError.message}`
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const bucketExists = buckets?.some(
      bucket => bucket.name === 'profile-pictures'
    )

    if (!bucketExists) {
      // Create the bucket
      const { data, error } = await supabaseAdmin.storage.createBucket(
        'profile-pictures',
        {
          public: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp'
          ],
          fileSizeLimit: 5242880 // 5MB
        }
      )

      if (error) {
        console.error('Error creating bucket:', error)
        return new Response(
          JSON.stringify({
            success: false,
            message: `Error creating bucket: ${error.message}`
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
          message: 'Profile pictures bucket created successfully',
          data
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Profile pictures bucket already exists'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error) {
    console.error('Error in storage setup:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
