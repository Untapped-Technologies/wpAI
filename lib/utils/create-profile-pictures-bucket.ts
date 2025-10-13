import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'

export async function createProfilePicturesBucket() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return { success: false, error: listError.message }
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
        return { success: false, error: error.message }
      }

      console.log('Profile pictures bucket created successfully')
      return { success: true, data }
    } else {
      console.log('Profile pictures bucket already exists')
      return { success: true, message: 'Bucket already exists' }
    }
  } catch (error) {
    console.error('Error in bucket creation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  createProfilePicturesBucket()
    .then(result => {
      console.log('Migration result:', result)
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}
