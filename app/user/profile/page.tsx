'use client'

import PostSignupPlanModal from '@/components/post-signup-plan-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import UserProfile from '@/components/user-profile'
import { useAuthUser } from '@/hooks/useAuthUser'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserProfilePage() {
  const router = useRouter()
  const { data: user, loading: userLoading, error: userError } = useAuthUser()
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null)
  const [hasPaidSub, setHasPaidSub] = useState<boolean>(false)

  useEffect(() => {
    if (!userLoading && userError) {
      if (userError === 'Unauthorized') {
        router.push('/auth/login')
      }
    }
  }, [userLoading, userError, router])

  // Check for payment success and refresh data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const upgraded = params.get('upgraded')
    const sessionId = params.get('session_id')
    
    if (upgraded === 'true' || sessionId) {
      // Refresh access data after payment
      const refreshData = async () => {
        try {
          const res = await fetch('/api/user/access', { cache: 'no-store' })
          const data = await res.json()
          const sub = data?.subscription
          const paid = !!sub?.stripe_subscription_id
          setHasPaidSub(paid)
          if (sub?.trial_end && !paid) {
            const end = new Date(sub.trial_end).getTime()
            const msLeft = end - Date.now()
            const days = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
            setTrialDaysLeft(days)
          } else {
            setTrialDaysLeft(null)
          }
          
          // Dispatch event to refresh payment history and other components
          window.dispatchEvent(new CustomEvent('payment-success', { detail: { sessionId } }))
          
          // Clean up URL parameters
          if (upgraded || sessionId) {
            router.replace('/user/profile', { scroll: false })
          }
        } catch {
          setTrialDaysLeft(null)
        }
      }
      
      // Small delay to ensure webhook has processed
      setTimeout(refreshData, 2000)
    }
  }, [router])

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        // Sync Stripe data on profile load (runs once per session)
        const syncKey = `stripe_sync_${user?.id}`
        const lastSync = sessionStorage.getItem(syncKey)
        const now = Date.now()
        
        // Only sync once per session or if last sync was more than 5 minutes ago
        if (!lastSync || now - parseInt(lastSync) > 5 * 60 * 1000) {
          fetch('/api/user/sync-stripe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                console.log('✅ Stripe sync completed on profile load:', data)
                sessionStorage.setItem(syncKey, now.toString())
                // Refresh access data after sync
                setTimeout(() => {
                  fetch('/api/user/access', { cache: 'no-store' })
                    .then(res => res.json())
                    .then(accessData => {
                      const sub = accessData?.subscription
                      const paid = !!sub?.stripe_subscription_id
                      setHasPaidSub(paid)
                      // Dispatch event to refresh components
                      window.dispatchEvent(new CustomEvent('payment-success'))
                    })
                }, 1000)
              } else {
                console.error('❌ Stripe sync failed:', data.error)
              }
            })
            .catch(syncError => {
              console.error('Stripe sync error (non-blocking):', syncError)
            })
        }

        const res = await fetch('/api/user/access', { cache: 'no-store' })
        const data = await res.json()
        const sub = data?.subscription
        const paid = !!sub?.stripe_subscription_id
        setHasPaidSub(paid)
        if (sub?.trial_end && !paid) {
          const end = new Date(sub.trial_end).getTime()
          const msLeft = end - Date.now()
          const days = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
          setTrialDaysLeft(days)
        } else {
          setTrialDaysLeft(null)
        }
      } catch {
        setTrialDaysLeft(null)
      }
    }
    if (user) fetchAccess()
  }, [user])

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading user: {userError}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <UserProfile userId={user.id} />
      {!hasPaidSub && trialDaysLeft !== null && (
        <div className="w-full bg-blue-50 border-b border-blue-100">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-900">
              <Badge variant="secondary">
                {trialDaysLeft} days left in trial
              </Badge>
              <span className="text-blue-800">
                Upgrade now to keep full access after your trial ends.
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => {
                window.dispatchEvent(new Event('open-upgrade-modal'))
              }}
            >
              Upgrade
            </Button>
          </div>
        </div>
      )}
      <PostSignupPlanModal />
    </>
  )
}
