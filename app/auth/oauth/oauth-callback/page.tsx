'use client'

import { createClient } from '@/lib/supabase/client'
import { createOrUpdateUserProfile } from '@/lib/utils/createOrUpdateUserProfile'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuth = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError('Failed to retrieve user')
        return
      }

      const { success, error: profileError } = await createOrUpdateUserProfile(
        supabase,
        user
      )

      if (!success) {
        setError(profileError || 'Failed to create user profile')
        return
      }

      router.push('/user/profile')
    }

    handleOAuth()
  }, [])

  return (
    <div className="p-6 text-center">
      {error ? (
        <p className="text-red-500 font-medium">Error: {error}</p>
      ) : (
        <p className="text-gray-500">Finishing login…</p>
      )}
    </div>
  )
}
