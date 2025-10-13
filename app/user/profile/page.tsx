'use client'

import UserProfile from '@/components/user-profile'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserAndLoadProfile = async () => {
      try {
        const response = await fetch('/api/auth/user')

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login')
            return
          }
          throw new Error('Failed to fetch user')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error('Failed to get user data')
        }

        const { user } = result.data

        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)
      } catch (error) {
        console.error('Error in user profile check:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAndLoadProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return <UserProfile userId={user.id} />
}
