'use client'
import HomeCTA from '@/components/_constants/pages/home/homeCTA'
import EntPricingCard from '@/components/_constants/pages/pricing/entPricingCard'
import PricingFaqs from '@/components/_constants/pages/pricing/faqs'
import PricingCard from '@/components/_constants/pages/pricing/pricingCard'
import PricingHeader from '@/components/_constants/pages/pricing/pricingHeader'
import { pricingEnterprise } from '@/components/_constants/pricing/pricingData'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'
import { usePricing } from '@/hooks/usePricing'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [interval, setInterval] = useState<'month' | 'annual'>('month')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const {
    data: rawData,
    loading: plansLoading,
    error: plansError
  } = usePricing(interval)
  const { data: monthlyData } = usePricing('month')
  const { data: annualData } = usePricing('annual')

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsAuthenticated(false)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Transform raw API data to DisplayPlan format
  const toDisplayPlan = (plan: any, idx: number): DisplayPlan => {
    const amountCents = plan.price_cents ?? null
    const priceText =
      plan.price_display ??
      (amountCents != null ? `$${(amountCents / 100).toFixed(2)}` : '')
    const intervalStr = plan.interval ?? ''
    const feats = Array.isArray(plan.plan_features)
      ? plan.plan_features.map((pf: any, i: number) => ({
          fid: i + 1,
          feature: pf.feature ?? '',
          description: pf.description ?? ''
        }))
      : []
    return {
      id: plan.id ?? idx,
      priceId: plan.stripe_price_id ?? '',
      paymentType: (plan.payment_type ?? 'subscription') as
        | 'payment'
        | 'subscription',
      title: plan.name ?? plan.title ?? 'Plan',
      subtitle: plan.description ?? plan.subtitle ?? '',
      price: priceText,
      timeframe: intervalStr,
      trial: plan.trial ?? false,
      trialButton: plan.trial_button ?? plan.trial ?? false,
      features: feats,
      stripe_price_id: plan.stripe_price_id
    }
  }

  const plans = rawData.map((p: any, i: number) => toDisplayPlan(p, i))

  // Calculate savings percentage when annual is selected
  const calculateSavingsPercentage = (): number | null => {
    if (interval !== 'annual' || !monthlyData.length || !annualData.length) {
      return null
    }

    // Match plans by name (assuming same plan names exist in both intervals)
    const savings: number[] = []
    
    monthlyData.forEach((monthlyPlan: any) => {
      const annualPlan = annualData.find(
        (ap: any) => ap.name === monthlyPlan.name || ap.id === monthlyPlan.id
      )
      
      if (annualPlan) {
        const monthlyPrice = monthlyPlan.price_cents ?? 0
        const annualPrice = annualPlan.price_cents ?? 0
        
        if (monthlyPrice > 0 && annualPrice > 0) {
          const monthlyYearly = monthlyPrice * 12
          const savingsAmount = monthlyYearly - annualPrice
          const savingsPercent = (savingsAmount / monthlyYearly) * 100
          if (savingsPercent > 0) {
            savings.push(savingsPercent)
          }
        }
      }
    })

    if (savings.length === 0) return null
    
    // Return average savings percentage
    const avgSavings = savings.reduce((a, b) => a + b, 0) / savings.length
    return Math.round(avgSavings)
  }

  const savingsPercentage = calculateSavingsPercentage()

  const handleCheckout = async (priceId: string, paymentType: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the selected plan in sessionStorage and redirect to signup
      sessionStorage.setItem('selectedPlan', JSON.stringify({ priceId, paymentType }))
      sessionStorage.setItem('redirectAfterAuth', '/pricing')
      router.push('/auth/sign-up?redirect=pricing')
      return
    }

    setLoading(priceId)
    try {
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
      // If authentication error, redirect to signup
      if (res.status === 401) {
        sessionStorage.setItem('selectedPlan', JSON.stringify({ priceId, paymentType }))
        sessionStorage.setItem('redirectAfterAuth', '/pricing')
        router.push('/auth/sign-up?redirect=pricing')
        return
      }
      alert(`Checkout failed: ${data?.error || 'Unknown error'}`)
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred during checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  // Handle redirect after authentication
  useEffect(() => {
    if (isAuthenticated && !checkingAuth) {
      const selectedPlan = sessionStorage.getItem('selectedPlan')
      const redirectAfterAuth = sessionStorage.getItem('redirectAfterAuth')
      
      if (selectedPlan && redirectAfterAuth === '/pricing') {
        // Clear the stored data
        sessionStorage.removeItem('selectedPlan')
        sessionStorage.removeItem('redirectAfterAuth')
        
        // Auto-trigger checkout if plan was selected
        try {
          const plan = JSON.parse(selectedPlan)
          // Use a small delay to ensure state is ready
          setTimeout(() => {
            handleCheckout(plan.priceId, plan.paymentType)
          }, 100)
        } catch (error) {
          console.error('Error parsing selected plan:', error)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, checkingAuth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
      {/* Header Section */}
      <PricingHeader 
        interval={interval} 
        setInterval={setInterval} 
        savingsPercentage={savingsPercentage}
      />

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
