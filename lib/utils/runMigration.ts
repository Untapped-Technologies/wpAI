import { createClient } from '@/lib/supabase/client'

export async function runOnboardingMigration() {
  const supabase = createClient()

  try {
    // Check if the columns already exist
    const { data: existingColumns, error: checkError } = await supabase
      .from('profiles')
      .select(
        'onboarding_completed, onboarding_completed_at, candidate_profile'
      )
      .limit(1)

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('Columns might not exist, attempting to add them...')

      // Try to add the columns using raw SQL
      const { error: migrationError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE public.profiles 
          ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
          ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS candidate_profile JSONB;
          
          CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed 
          ON public.profiles(onboarding_completed);
          
          CREATE INDEX IF NOT EXISTS idx_profiles_user_type_id 
          ON public.profiles(user_type_id);
        `
      })

      if (migrationError) {
        console.error('Migration failed:', migrationError)
        return { success: false, error: migrationError.message }
      }

      console.log('Migration completed successfully')
      return { success: true }
    }

    console.log('Columns already exist')
    return { success: true }
  } catch (error) {
    console.error('Migration check failed:', error)
    return { success: false, error: 'Migration check failed' }
  }
}
