'use client'

import { LocationConfirmModal } from '@/components/_constants/pages/signUp/prefModal'
import { createClient } from '@/lib/supabase/client'
import {
  createOrUpdateUserProfile,
  fetchPreferencesFromIP
} from '@/lib/utils/createOrUpdateUserProfile'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<Record<string, any> | null>(
    null
  )
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (error || !user) return
      setUser(user)

      const prefs = await fetchPreferencesFromIP()
      setPreferences(prefs)
      setShowModal(true)
    }

    load()
  }, [])

  interface Preferences {
    country: string | null
    state: string | null
    postalCode: string | null
    email: string | null
    city: string | null
    latitude: number | null
    longitude: number | null
    emailNotifs: boolean | true
    smsNotifs: boolean | true
  }

  const handleConfirm = async (prefs: Preferences) => {
    if (user) {
      await createOrUpdateUserProfile(supabase, user, prefs)
      setShowModal(false)
      router.push('/user/profile')
    }
  }

  return (
    <>
      {showModal && preferences && user && (
        <LocationConfirmModal
          preferences={{
            city: preferences.city,
            state: preferences.state,
            postalCode: preferences.postalCode,
            country: preferences.country,
            latitude: preferences.latitude,
            longitude: preferences.longitude,
            email: preferences.email
          }}
          onConfirm={prefs =>
            handleConfirm({
              country: prefs.country,
              state: prefs.state,
              postalCode: prefs.postalCode,
              email: prefs.email,
              city: prefs.city,
              latitude: prefs.latitude,
              longitude: prefs.longitude,
              emailNotifs: true,
              smsNotifs: true
            })
          }
          onRetry={async () => {
            const newPrefs = await fetchPreferencesFromIP()
            setPreferences(newPrefs)
          }}
        />
      )}
    </>
  )
}
