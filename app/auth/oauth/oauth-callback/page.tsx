'use client'

import { LocationConfirmModal } from '@/components/_constants/pages/signUp/prefModal'
import { createClient } from '@/lib/supabase/client'
import {
  createOrUpdateUserProfile,
  fetchPreferencesFromIP
} from '@/lib/utils/createOrUpdateUserProfile'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState(null)
  const [preferences, setPreferences] = useState(null)
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
    region: string | null
    email: string | null
    city: string | null
    latitude: number | null
    longitude: number | null
  }

  const handleConfirm = async (prefs: Preferences) => {
    console.log('🚀 ~ handleConfirm ~ user:', user)
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
          preferences={preferences}
          onConfirm={handleConfirm}
          onEdit={handleConfirm}
          onRetry={async () => {
            const newPrefs = await fetchPreferencesFromIP()
            setPreferences(newPrefs)
          }}
        />
      )}
    </>
  )
}
