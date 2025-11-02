'use client'

import { AlertCircle, CreditCard, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

type AccessLevel = 'free' | 'basic' | 'premium' | 'enterprise'

interface Subscription {
  status: string
  current_period_end?: string
  plan_id?: string
  trial_end?: string | null
  stripe_subscription_id?: string | null
}

interface UserAccessData {
  access_level?: string
  level?: string
  features?: Record<string, boolean>
  limits?: Record<string, unknown>
  subscription?: Subscription | null
}

interface AccessGuardProps {
  children: React.ReactNode
  requiredLevel?: AccessLevel
  requiredFeature?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AccessGuard({
  children,
  requiredLevel,
  requiredFeature,
  fallback,
  redirectTo = '/pricing'
}: AccessGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [userAccess, setUserAccess] = useState<UserAccessData | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const response = await fetch('/api/user/access')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check access')
      }

      const accessData = data as UserAccessData
      setUserAccess(accessData)

      let access = true

      // Check required level
      if (requiredLevel) {
        const levelHierarchy: Record<AccessLevel, number> = {
          free: 0,
          basic: 1,
          premium: 2,
          enterprise: 3
        }

        const userLevel = (accessData.access_level ?? accessData.level ?? 'free') as AccessLevel
        access =
          access && levelHierarchy[userLevel] >= levelHierarchy[requiredLevel]
      }

      // Check required feature
      if (requiredFeature) {
        access = access && (accessData.features?.[requiredFeature] === true)
      }

      setHasAccess(access)
    } catch (error) {
      console.error('Error checking access:', error)
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Checking access permissions...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">Access Required</CardTitle>
              <CardDescription>
                {requiredLevel
                  ? `This feature requires a ${requiredLevel} subscription or higher.`
                  : requiredFeature
                    ? `This feature is not available in your current plan.`
                    : 'You need an active subscription to access this content.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userAccess && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Current plan: <strong>{userAccess.access_level}</strong>
                    {userAccess.subscription?.status !== 'active' && (
                      <span className="text-red-600 ml-2">(Inactive)</span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Go Back
                </Button>
                <Button
                  onClick={() => router.push(redirectTo)}
                  className="flex-1"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Hook for checking access in components
export function useAccess() {
  const [access, setAccess] = useState<UserAccessData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccess()
  }, [])

  const fetchAccess = async () => {
    try {
      const response = await fetch('/api/user/access')
      const data = await response.json()

      if (response.ok) {
        setAccess(data as UserAccessData)
      }
    } catch (error) {
      console.error('Error fetching access:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasFeature = (feature: string) => {
    return access?.features?.[feature] === true
  }

  const hasLevel = (level: AccessLevel) => {
    const levelHierarchy: Record<AccessLevel, number> = {
      free: 0,
      basic: 1,
      premium: 2,
      enterprise: 3
    }

    const userLevel = (access?.access_level ?? 'free') as AccessLevel
    return levelHierarchy[userLevel] >= levelHierarchy[level]
  }

  const isSubscriptionActive = () => {
    return access?.subscription?.status === 'active'
  }

  return {
    access,
    loading,
    hasFeature,
    hasLevel,
    isSubscriptionActive,
    refetch: fetchAccess
  }
}
