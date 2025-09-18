// lib/utils/createOrUpdateUserProfile.ts
import { SupabaseClient, User } from '@supabase/supabase-js'

export async function createOrUpdateUserProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ success: boolean; error?: string }> {
  const { id, email } = user

  const { data, error } = await supabase.from('profiles').upsert(
    {
      user_id: id,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'user_id' }
  )
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
