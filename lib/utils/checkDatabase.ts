import { createClient } from '@/lib/supabase/client'

export async function checkDatabaseSchema() {
  const supabase = createClient()

  try {
    // Check if profiles table exists and has the required columns
    const { data, error } = await supabase.from('profiles').select('*').limit(1)

    if (error) {
      console.error('Database check error:', error)
      return { success: false, error: error.message }
    }

    console.log('Database schema check passed')
    return { success: true, data }
  } catch (error) {
    console.error('Database check failed:', error)
    return { success: false, error: 'Database connection failed' }
  }
}

export async function checkUserProfile(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Profile check error:', error)
      return { success: false, error: error.message, code: error.code }
    }

    console.log('User profile found:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Profile check failed:', error)
    return { success: false, error: 'Profile check failed' }
  }
}
