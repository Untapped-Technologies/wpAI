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

  useEffect(() => {
    const handleUserSetup = async () => {
      if (!user || !location) return

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

      await createOrUpdateUserProfile(
        supabase,
        user,
        locationData,
        userData,
        selectedUserType
      )

      // Clean up localStorage after profile creation
      localStorage.removeItem('selectedUserType')

      // Sync Stripe data with Supabase after OAuth login
      // Don't await - let it run in background
      fetch('/api/user/sync-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('✅ Stripe sync completed:', data)
          } else {
            console.error('❌ Stripe sync failed:', data.error)
          }
        })
        .catch(syncError => {
          // Log but don't block login if sync fails
          console.error('Stripe sync error (non-blocking):', syncError)
        })

      // Check if user is a candidate and redirect to onboarding if needed
      const candidateTypeId = '3dad0f25-2b3b-491b-9e82-9f9e71adad6f'
      if (selectedUserType === candidateTypeId) {
        // For new candidates, redirect to onboarding
        router.push('/candidate-onboarding')
      } else {
        router.push('/user/profile')
      }
    }

    handleUserSetup()
  }, [user, location, router, searchParams, supabase])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Setting up your account...</p>
      </div>
    </div>
  )
}
