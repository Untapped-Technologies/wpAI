'use client'

import { UserTypes } from '@/components/_constants/pages/signUp/signupTypes'
import { createClient } from '@/lib/supabase/client'
import {
  createOrUpdateUserProfile,
  fetchLocationFromIP
} from '@/lib/utils/createOrUpdateUserProfile'
import { User } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [location, setLocation] = useState<Record<string, any> | null>(null)
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

      const prefs = await fetchLocationFromIP()

      setLocation(prefs)
    }

    load()
  }, [supabase.auth])

  if (user && location) {
    const locationData = {
      city: location?.city,
      state: location?.state,
      postalCode: location?.postalCode,
      country: location?.country,
      latitude: location?.latitude,
      longitude: location?.longitude,
      emailNotifs: true,
      smsNotifs: true
    }
    const userData = {
      name: user.user_metadata.name,
      avatar: user.user_metadata.avatar_url
    }

    // Get selected user type from URL parameter first, then localStorage as fallback
    const urlUserType = searchParams.get('userType')
    const localStorageUserType = localStorage.getItem('selectedUserType')
    const selectedUserType =
      urlUserType ||
      localStorageUserType ||
      '77503f6f-c160-4cca-9d13-70f08e09fcc4'

    createOrUpdateUserProfile(
      supabase,
      user,
      locationData,
      userData,
      selectedUserType
    )

    // Clean up localStorage after profile creation
    localStorage.removeItem('selectedUserType')

    router.push('/user/profile')
  }
}
