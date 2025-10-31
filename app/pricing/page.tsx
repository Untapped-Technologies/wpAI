'use client'
import HomeCTA from '@/components/_constants/pages/home/homeCTA'
import EntPricingCard from '@/components/_constants/pages/pricing/entPricingCard'
import PricingFaqs from '@/components/_constants/pages/pricing/faqs'
import PricingCard from '@/components/_constants/pages/pricing/pricingCard'
import PricingHeader from '@/components/_constants/pages/pricing/pricingHeader'
import { pricingEnterprise } from '@/components/_constants/pricing/pricingData'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'
import { useEffect, useRef, useState } from 'react'

type DisplayPlan = {
  id: string
  priceId: string
  stripe_price_id: string
  paymentType: 'payment' | 'subscription'
  title: string
  subtitle?: string
  price: string
  timeframe?: string
  trial?: boolean
  trialButton?: boolean
  features: { fid: number; feature: string; description?: string }[]
}

const popular = 'basic'
const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null)
  const [plans, setPlans] = useState<DisplayPlan[]>([])
  const [plansLoading, setPlansLoading] = useState<boolean>(true)
  const [plansError, setPlansError] = useState<string | null>(null)
  const [interval, setInterval] = useState<'month' | 'annual'>('month')
  const cacheRef = useRef<{ month?: DisplayPlan[]; annual?: DisplayPlan[] }>({})
  const CACHE_KEY = 'pricingCache_v1'
  const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

  useEffect(() => {
    const toDisplayPlan = (plan: any, idx: number): DisplayPlan => {
      const amountCents = plan.price_cents ?? plan.price_cents ?? null
      const priceText =
        plan.price_cents ??
        (amountCents != null ? `$${(amountCents / 100).toFixed(2)}` : '')
      const interval = plan.timeframe ?? plan.interval ?? ''
      const feats = Array.isArray(plan.plan_features)
        ? plan.plan_features.map((pf: any, i: number) => ({
            fid: i + 1,
            feature: pf.feature ?? '',
            description: pf.description ?? ''
          }))
        : []
      return {
        id: plan.id ?? idx,
        priceId: plan.stripe_price_id ?? plan.stripe_price_id ?? '',
        paymentType: (plan.payment_type ?? 'subscription') as
          | 'payment'
          | 'subscription',
        title: plan.title ?? plan.name ?? 'Plan',
        subtitle: plan.subtitle ?? '',
        price: plan.price_display,
        timeframe: interval,
        trial: plan.trial ?? false,
        trialButton: plan.trial_button ?? plan.trial ?? false,
        features: feats,
        stripe_price_id: plan.stripe_price_id
      }
    }

    const fetchPlans = async () => {
      try {
        setPlansLoading(true)
        // 1) Try in-memory cache first
        const memCached = cacheRef.current[interval]
        if (memCached && memCached.length > 0) {
          setPlans(memCached)
          setPlansLoading(false)
          return
        }

        // 2) Try localStorage cache
        try {
          const raw =
            typeof window !== 'undefined'
              ? localStorage.getItem(CACHE_KEY)
              : null
          if (raw) {
            const parsed = JSON.parse(raw)
            if (
              parsed &&
              typeof parsed === 'object' &&
              typeof parsed.timestamp === 'number' &&
              Date.now() - parsed.timestamp < CACHE_TTL_MS &&
              parsed[interval] &&
              Array.isArray(parsed[interval])
            ) {
              cacheRef.current = {
                month: parsed.month || cacheRef.current.month,
                annual: parsed.annual || cacheRef.current.annual
              }
              // populate a shared global cache so other pages/components can reuse without refetching
              try {
                const root: any = (window as any).__pricingCache || {}
                if (parsed.month)
                  root['month'] = { ts: parsed.timestamp, data: parsed.month }
                if (parsed.annual)
                  root['annual'] = { ts: parsed.timestamp, data: parsed.annual }
                ;(window as any).__pricingCache = root
              } catch {}
              setPlans(parsed[interval])
              setPlansLoading(false)
              return
            }
          }
        } catch {}

        // 3) Fetch from API
        const res = await fetch(`/api/pricing?interval=${interval}`, {
          // allow browser caches to use Cache-Control from server
          cache: 'default'
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load plans')
        const data = Array.isArray(json?.data) ? json.data : []
        const mapped = data.map((p: any, i: number) => toDisplayPlan(p, i))
        setPlans(mapped)
        // update in-memory cache
        cacheRef.current[interval] = mapped
        // update localStorage cache snapshot for both intervals when present
        try {
          const existingRaw =
            typeof window !== 'undefined'
              ? localStorage.getItem(CACHE_KEY)
              : null
          const existing = existingRaw ? JSON.parse(existingRaw) : {}
          const snapshot = {
            month:
              interval === 'month'
                ? mapped
                : existing.month || cacheRef.current.month,
            annual:
              interval === 'annual'
                ? mapped
                : existing.annual || cacheRef.current.annual,
            timestamp: Date.now()
          }
          if (typeof window !== 'undefined')
            localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot))
          // also update a shared global cache for immediate reuse
          try {
            const root: any = (window as any).__pricingCache || {}
            if (snapshot.month)
              root['month'] = { ts: snapshot.timestamp, data: snapshot.month }
            if (snapshot.annual)
              root['annual'] = { ts: snapshot.timestamp, data: snapshot.annual }
            ;(window as any).__pricingCache = root
          } catch {}
        } catch {}
      } catch (e: any) {
        setPlansError(e?.message || 'Failed to load plans')
      } finally {
        setPlansLoading(false)
      }
    }
    fetchPlans()
  }, [interval])

  const handleCheckout = async (priceId: string, paymentType: string) => {
    setLoading(priceId)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, paymentType })
    })
    const data = await res.json()
    if (res.ok && data.url) {
      window.location.href = data.url // redirect to Stripe Checkout
      return
    }
    alert(`Checkout failed: ${data?.error || 'Unknown error'}`)
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
      {/* Header Section */}
      <PricingHeader interval={interval} setInterval={setInterval} />

      {/* Pricing Cards */}
      <section className="pt-20 pb-10 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plansLoading && (
              <div className="md:col-span-2 lg:col-span-3 text-center text-slate-500">
                Loading plans...
              </div>
            )}
            {plansError && (
              <div className="md:col-span-2 lg:col-span-3 text-center text-red-600">
                {plansError}
              </div>
            )}
            {!plansLoading &&
              !plansError &&
              plans.map(plan => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  popular={`${interval === 'annual' ? popular + ' ' + interval : popular}`}
                  handleCheckout={handleCheckout}
                />
              ))}
          </div>
          <EntPricingCard pricingEnterprise={pricingEnterprise} />
        </div>
      </section>

      {/* FAQ Section */}
      <PricingFaqs />

      {/* CTA Section */}
      <HomeCTA />
      <AuthAwareFooter />
    </div>
  )
}

export default Pricing
