'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

type DisplayPlan = {
  id: string
  title: string
  subtitle?: string
  priceId: string
  paymentType: 'payment' | 'subscription'
  price: string
  timeframe?: string
  isPopular?: boolean
}

type AccessResponse = {
  level?: string
  access_level?: string
  subscription: {
    status?: string
    stripe_subscription_id?: string | null
    trial_end?: string | null
  } | null
}

export default function PostSignupPlanModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<DisplayPlan[]>([])
  const [error, setError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [interval, setInterval] = useState<'month' | 'annual'>('month')

  const hasActivePaidSub = (access: AccessResponse) => {
    const sub = access.subscription
    if (!sub) return false
    if (sub.stripe_subscription_id) return true
    return false
  }

  const trialIsActive = (access: AccessResponse) => {
    const sub = access.subscription
    if (!sub) return false
    if (!sub.trial_end) return false
    try {
      const end = new Date(sub.trial_end).getTime()
      return Date.now() < end
    } catch {
      return false
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        // 1) Fetch access status
        const accessRes = await fetch('/api/user/access', { cache: 'no-store' })
        const accessJson: AccessResponse = await accessRes.json()

        // If user already has an active paid sub, do not show modal
        if (accessRes.ok && hasActivePaidSub(accessJson)) {
          setOpen(false)
          return
        }

        // If no subscription record or no trial fields, start a trial
        if (
          !accessJson.subscription ||
          accessJson.subscription.trial_end == null
        ) {
          await fetch('/api/user/trial/start', { method: 'POST' })
        }

        // Re-check access to get trial_end
        const accessRes2 = await fetch('/api/user/access', {
          cache: 'no-store'
        })
        const accessJson2: AccessResponse = await accessRes2.json()

        // If trial active or no paid sub, show modal
        if (!hasActivePaidSub(accessJson2)) {
          setOpen(true)
        }

        // 2) Fetch plans to display for selected interval
        const plansRes = await fetch(`/api/pricing?interval=${interval}`)
        const plansJson = await plansRes.json()
        const data = Array.isArray(plansJson?.data) ? plansJson.data : []
        const mapped: DisplayPlan[] = data.map((p: any) => ({
          id: String(p.id ?? ''),
          title: p.name ?? p.title ?? 'Plan',
          subtitle: p.description ?? p.subtitle ?? '',
          priceId: p.stripe_price_id ?? p.price_id ?? '',
          paymentType:
            p.interval && p.interval !== 'one_time'
              ? 'subscription'
              : 'payment',
          price: p.price
            ? String(p.price)
            : p.price_cents != null
              ? `$${(p.price_cents / 100).toFixed(0)}`
              : '',
          timeframe: p.interval,
          isPopular: p.is_popular ?? false
        }))
        setPlans(mapped)
      } catch (e: any) {
        setError(e?.message || 'Failed to initialize plan selection')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [interval])

  // Allow external trigger to open the modal
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-upgrade-modal', handler)
    return () => window.removeEventListener('open-upgrade-modal', handler)
  }, [])

  const onSelectPlan = async (plan: DisplayPlan) => {
    try {
      setCheckoutLoading(plan.id)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          planId: plan.id,
          paymentType: plan.paymentType,
          // Let backend decide mode; we just want to come back to profile
          redirect: 'profile'
        })
      })
      const json = await res.json()
      if (!res.ok || !json?.url) {
        throw new Error(json?.error || 'Failed to start checkout')
      }
      window.location.href = json.url
    } catch (e: any) {
      setError(e?.message || 'Checkout failed')
    } finally {
      setCheckoutLoading(null)
    }
  }

  const trialEndsText = useMemo(() => {
    // Best-effort display: ask access endpoint for current trial end
    return ''
  }, [])

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Choose your plan</DialogTitle>
          <DialogDescription>
            Start your 14‑day trial now. Upgrade anytime to keep full access
            after the trial.
          </DialogDescription>
        </DialogHeader>

        {/* Interval toggle */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Billing interval:</span>
          <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${interval === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setInterval('month')}
              aria-pressed={interval === 'month'}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1 text-sm border-l border-gray-200 ${interval === 'annual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setInterval('annual')}
              aria-pressed={interval === 'annual'}
            >
              Annual
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-6">Loading plans…</div>
        ) : error ? (
          <div className="py-4 text-red-600 text-sm">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`border rounded-lg p-4 ${plan.isPopular ? 'border-blue-600' : 'border-gray-200'}`}
              >
                <div className="text-sm text-gray-500">{plan.subtitle}</div>
                <div className="mt-1 text-lg font-semibold">{plan.title}</div>
                {plan.price && (
                  <div className="mt-2 text-2xl font-bold">
                    {plan.price}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      {plan.timeframe === 'year'
                        ? '/yr'
                        : plan.timeframe === 'month'
                          ? '/mo'
                          : ''}
                    </span>
                  </div>
                )}
                <Button
                  className="mt-4 w-full"
                  disabled={!!checkoutLoading}
                  onClick={() => onSelectPlan(plan)}
                >
                  {checkoutLoading === plan.id ? 'Redirecting…' : 'Select'}
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
