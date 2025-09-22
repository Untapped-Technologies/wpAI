import { SupabaseClient, User } from '@supabase/supabase-js'

export async function saveToSupabase(
  user: User,
  preferences: Record<string, any>,
  supabase: SupabaseClient
) {
  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: user.id,
      email: user.email,
      preferences,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    console.error('Supabase error:', error.message)
    throw error
  }
}
