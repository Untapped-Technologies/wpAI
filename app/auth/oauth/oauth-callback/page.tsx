'use client'

import { LocationConfirmModal } from '@/components/_constants/pages/signUp/prefModal'
import {
  Preferences,
  UserTypes
} from '@/components/_constants/pages/signUp/signupTypes'
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
  const [userTypes, setUserTypes] = useState<UserTypes[]>([])
  const [userType, setUserType] = useState<string>('')

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

      const userTypesData = await fetch(
        `/api/usertypes/${prefs.country || 'US'}`
      )
      if (!userTypesData.ok) return
      const userTypesJson = await userTypesData.json()
      setUserTypes(userTypesJson)

      setShowModal(true)
    }

    load()
  }, [])

  const handleConfirm = async (prefs: Preferences, userType: string) => {
    if (!userType) {
      alert('Please select an account type.')
      return
    }

    if (user) {
      await createOrUpdateUserProfile(supabase, user, prefs, userType)
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
            email: preferences.email,
            emailNotifs: true,
            smsNotifs: true
          }}
          setUserType={setUserType}
          userType={userType}
          userTypes={userTypes}
          onConfirm={(prefs, userType) =>
            handleConfirm(
              {
                country: prefs.country,
                state: prefs.state,
                postalCode: prefs.postalCode,
                email: prefs.email,
                city: prefs.city,
                latitude: prefs.latitude,
                longitude: prefs.longitude,
                emailNotifs: true,
                smsNotifs: true
              },
              userType
            )
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
