'use client'

import {
  AlertCircle,
  Building,
  CheckCircle,
  CreditCard,
  Crown,
  Loader2,
  Star,
  Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

type Plan = {
  id: string
  name: string
  description: string
  price_cents: number
  currency: string
  interval: string
  stripe_price_id: string
  features: any
  limits: any
  is_popular: boolean
}

type Subscription = {
  id: string
  plan_id: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at: string | null
  stripe_customer_id: string
  stripe_subscription_id: string
}

type UserAccess = {
  access_level: string
  features: Record<string, any>
  limits: Record<string, any>
  subscription: Subscription | null
}

export function SubscriptionManagement() {
  const [userAccess, setUserAccess] = useState<UserAccess | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [accessResponse, plansResponse] = await Promise.all([
        fetch('/api/user/access'),
        fetch('/api/pricing')
      ])

      const accessData = await accessResponse.json()
      const plansData = await plansResponse.json()

      if (accessResponse.ok) {
        setUserAccess(accessData)
      }

      if (plansResponse.ok) {
        setPlans(plansData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string, priceId: string) => {
    setUpgrading(planId)
    setError(null)

    try {
      const response = await fetch('/api/checkout/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId,
          priceId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create upgrade session')
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setUpgrading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!userAccess?.subscription?.stripe_subscription_id) return

    try {
      const response = await fetch('/api/user/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel subscription')
      }

      // Refresh data
      await fetchData()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-5 h-5" />
      case 'basic':
        return <Star className="w-5 h-5" />
      case 'premium':
        return <Crown className="w-5 h-5" />
      case 'enterprise':
        return <Building className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const getDaysUntilExpiry = () => {
    if (!userAccess?.subscription?.current_period_end) return null

    const expiryDate = new Date(userAccess.subscription.current_period_end)
    const now = new Date()
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    return daysUntilExpiry > 0 ? daysUntilExpiry : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading subscription details...</p>
        </div>
      </div>
    )
  }

  if (!userAccess) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load subscription information. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  const currentPlan = plans.find(p => p.id === userAccess.subscription?.plan_id)
  const daysUntilExpiry = getDaysUntilExpiry()

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getPlanIcon(userAccess.subscription?.plan_id || 'free')}
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Plan</p>
              <p className="text-lg font-semibold">
                {currentPlan?.name || 'Free Tier'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Status</p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    userAccess.subscription?.status === 'active'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {userAccess.subscription?.status || 'inactive'}
                </Badge>
                {userAccess.subscription?.cancel_at_period_end && (
                  <Badge variant="destructive">Canceling</Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Next Billing</p>
              <p className="text-lg font-semibold">
                {userAccess.subscription?.current_period_end
                  ? new Date(
                      userAccess.subscription.current_period_end
                    ).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          {daysUntilExpiry !== null && daysUntilExpiry <= 7 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription expires in {daysUntilExpiry} days.
                {userAccess.subscription?.cancel_at_period_end
                  ? ' Your subscription will be canceled at the end of the billing period.'
                  : ' Consider renewing to continue enjoying our services.'}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            {userAccess.subscription?.status === 'active' &&
              !userAccess.subscription?.cancel_at_period_end && (
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  className="text-red-600 hover:text-red-700"
                >
                  Cancel Subscription
                </Button>
              )}
            <Button asChild>
              <a href="/pricing">Manage Billing</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(plan => {
            const isCurrentPlan = plan.id === userAccess.subscription?.plan_id
            const isUpgrade = plan.price_cents > (currentPlan?.price_cents || 0)

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative',
                  plan.is_popular && 'ring-2 ring-blue-500',
                  isCurrentPlan && 'bg-blue-50'
                )}
              >
                {plan.is_popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                {isCurrentPlan && (
                  <Badge className="absolute -top-2 right-4 bg-green-500">
                    Current Plan
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold text-slate-900">
                    {plan.price_cents === 0
                      ? 'Free'
                      : `$${(plan.price_cents / 100).toFixed(0)}`}
                    {plan.price_cents > 0 && (
                      <span className="text-lg font-normal text-slate-500">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 text-sm mb-6">
                    {plan.features &&
                      Object.entries(plan.features)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <li key={key} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>
                              {key.replace(/_/g, ' ')}: {String(value)}
                            </span>
                          </li>
                        ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? 'outline' : 'default'}
                    disabled={isCurrentPlan || upgrading === plan.id}
                    onClick={() => handleUpgrade(plan.id, plan.stripe_price_id)}
                  >
                    {upgrading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {isCurrentPlan
                      ? 'Current Plan'
                      : isUpgrade
                        ? 'Upgrade'
                        : 'Downgrade'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
