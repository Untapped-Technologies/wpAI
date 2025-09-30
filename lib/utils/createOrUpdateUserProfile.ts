import { SupabaseClient, User } from '@supabase/supabase-js'

export async function createOrUpdateUserProfile(
  supabase: SupabaseClient,
  user: User,
  location?: Record<string, any>,
  userData?: Record<string, any>,
  userType?: string
): Promise<{ success: boolean; error?: string }> {
  const { id, email } = user

  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: id,
      updated_at: new Date().toISOString(),
      preferences: location ?? {},
      display_name: userData?.name,
      user_type_id: userType,
      profile_picture: userData?.avatar
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function fetchLocationFromIP(): Promise<Record<string, any>> {
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
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function saveCandidateProfile(
  supabase: SupabaseClient,
  userId: string,
  candidateData: any
): Promise<{ success: boolean; error?: string; data?: any }> {
  // First, let's check if the profile exists and what columns are available
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('id, user_id, preferences')
    .eq('user_id', userId)
    .single()

  if (checkError) {
    return { success: false, error: checkError.message }
  }

  if (!existingProfile) {
    return { success: false, error: 'No profile found for this user' }
  }

  // Try to update using candidate_profile column first, fallback to preferences
  let updateData: any = {
    updated_at: new Date().toISOString()
  }

  // Try candidate_profile column first
  try {
    updateData.candidate_profile = candidateData
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()

    if (!error && data && data.length > 0) {
      return { success: true, data: data[0] }
    }
  } catch (err) {
    // Fallback to preferences column
  }

  // Fallback: store in preferences column
  const currentPreferences = existingProfile.preferences || {}
  const updatedPreferences = {
    ...currentPreferences,
    candidate_profile: candidateData
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      preferences: updatedPreferences,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()

  if (error) {
    return { success: false, error: error.message }
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Update failed - no rows affected' }
  }

  return { success: true, data: data[0] }
}
