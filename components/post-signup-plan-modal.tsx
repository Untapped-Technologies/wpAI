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
import { usePricing } from '@/hooks/usePricing'
import { toast } from 'sonner'

type DisplayPlan = {
  id: string
  title: string
  subtitle?: string
  priceId: string
  paymentType: 'payment' | 'subscription'
  price: string
  timeframe?: string
  isPopular?: boolean
  features?: { feature: string; description?: string }[]
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
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [interval, setInterval] = useState<'month' | 'annual'>('month')
  const { data: intervalData, loading, error } = usePricing(interval)
  const { data: allData } = usePricing('all')

  const hasActivePaidSub = (access: AccessResponse) => {
    const sub = access.subscription
    if (!sub) return false
    if (sub.stripe_subscription_id) return true
    return false
  }

  // Check access and show/hide modal
  useEffect(() => {
    const init = async () => {
      try {
        const accessRes = await fetch('/api/user/access', { cache: 'no-store' })
        const accessJson: AccessResponse = await accessRes.json()

        if (accessRes.ok && hasActivePaidSub(accessJson)) {
          setOpen(false)
          return
        }

        if (
          !accessJson.subscription ||
          accessJson.subscription.trial_end == null
        ) {
          await fetch('/api/user/trial/start', { method: 'POST' })
        }

        const accessRes2 = await fetch('/api/user/access', {
          cache: 'no-store'
        })
        const accessJson2: AccessResponse = await accessRes2.json()

        // if (!hasActivePaidSub(accessJson2)) {
        //   setOpen(true)
        // }
      } catch {}
    }
    init()
  }, [])

  // Transform raw data to DisplayPlan format
  const plans: DisplayPlan[] = intervalData.map((p: any) => ({
    id: String(p.id ?? ''),
    title: p.name ?? p.title ?? 'Plan',
    subtitle: p.description ?? p.subtitle ?? '',
    priceId: p.stripe_price_id ?? p.price_id ?? '',
    paymentType:
      p.interval && p.interval !== 'one_time' ? 'subscription' : 'payment',
    price: p.price
      ? String(p.price)
      : p.price_cents != null
        ? `$${(p.price_cents / 100).toFixed(0)}`
        : '',
    timeframe: p.interval,
    isPopular: p.is_popular ?? false,
    features: Array.isArray(p.plan_features)
      ? p.plan_features.map((pf: any) => ({
          feature: pf.feature,
          description: pf.description
        }))
      : []
  }))

  const allPlans = allData || []

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
      toast.error(e?.message || 'Checkout failed')
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
      <DialogContent className="sm:max-w-[860px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose your plan</DialogTitle>
          <DialogDescription>
            Start your 14‑day trial now. Upgrade anytime to keep full access
            after the trial.
          </DialogDescription>
        </DialogHeader>
        <div
          className="overflow-y-auto pr-1"
          style={{ maxHeight: 'calc(85vh - 120px)' }}
        >
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
                  className={`border rounded-lg p-4 ${plan.isPopular ? 'border-blue-600' : 'border-gray-200'} h-[420px] flex flex-col`}
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
                  {/* Annual savings blurb when applicable */}
                  {interval === 'annual' &&
                    (() => {
                      const normalize = (s: string | undefined) =>
                        (s || '').toLowerCase().trim()
                      const key = normalize(plan.title)
                      const m = allPlans.find(
                        p =>
                          normalize(p.name ?? p.title) === key &&
                          p.interval === 'month'
                      )
                      if (
                        m &&
                        typeof m.price_cents === 'number' &&
                        m.price_cents > 0
                      ) {
                        const annualCents =
                          typeof allPlans.find(
                            p =>
                              normalize(p.name ?? p.title) === key &&
                              p.interval === 'annual'
                          )?.price_cents === 'number'
                            ? (allPlans.find(
                                p =>
                                  normalize(p.name ?? p.title) === key &&
                                  p.interval === 'annual'
                              )?.price_cents as number)
                            : undefined
                        if (annualCents != null) {
                          const monthlyCents = m.price_cents as number
                          const baseline = monthlyCents * 12
                          const saved = baseline - annualCents
                          if (baseline > 0 && saved > 0) {
                            const pct = Math.round((saved / baseline) * 100)
                            return (
                              <div className="mt-1 text-xs text-green-700">
                                Save {pct}% annually
                              </div>
                            )
                          }
                        }
                      }
                      return null
                    })()}
                  {/* Feature list to mirror pricing page, scrollable area */}
                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-gray-700 list-disc pl-5 flex-1 overflow-y-auto min-h-0 pr-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="marker:text-gray-400">
                          <span className="font-medium">{f.feature}</span>
                          {f.description ? (
                            <span className="text-gray-500">
                              {' '}
                              — {f.description}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
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
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function setError(err: any) {
  const message =
    typeof err === 'string'
      ? err
      : (err?.message ?? String(err ?? 'An error occurred'))
  // Log for debugging
  console.error(message)
  // Try to show a non-intrusive toast if the app exposes one, otherwise fallback to alert
  try {
    // @ts-ignore - some apps provide a global toast/notify helper
    if (typeof (window as any).toast === 'function') {
      // @ts-ignore
      ;(window as any).toast(message, { type: 'error' })
      return
    }
  } catch {}
  if (typeof window !== 'undefined') {
    alert(message)
  }
}
