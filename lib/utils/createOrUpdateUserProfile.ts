import { SupabaseClient, User } from '@supabase/supabase-js'

export async function createOrUpdateUserProfile(
  supabase: SupabaseClient,
  user: User,
  preferences?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  const { id, email } = user

  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: id,
      // email: email ?? '',
      updated_at: new Date().toISOString(),
      preferences: preferences ?? {}
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function fetchPreferencesFromIP(): Promise<Record<string, any>> {
  const response = await fetch(
    `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`
  )
  const json = await response.json()

  const [city, state, postal, country, loc] = [
    json.city,
    json.region,
    json.postal,
    json.country,
    json.loc
  ]

  return {
    city,
    state,
    postalCode: postal,
    country,
    smsNotifs: true,
    emailNotifs: true,
    latitude: loc.split(',')[0],
    longitude: loc.split(',')[1]
  }
}

export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  payload: Partial<{
    display_name: string
    user_type_id: string
    bio: string
    preferences: Record<string, any> // For jsonb column
  }>
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...payload,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (error) {
    console.error('⚠️ updateUserProfile error:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function savePoliticianProfile(
  supabase: SupabaseClient,
  profileId: number,
  formValues: any
) {
  const {
    office,
    jurisdiction,
    district,
    website,
    affiliation,
    bio,
    photo,
    socialMedia
  } = formValues

  const { data, error } = await supabase.from('politicians').upsert({
    id: profileId, // must be bigint from `profiles.id`
    office,
    jurisdiction,
    district,
    website,
    affiliation,
    bio,
    photo,
    social_media: socialMedia
  })

  if (error) {
    console.error('🔴 Error saving politician profile:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
