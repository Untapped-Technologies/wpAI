'use client'
import HomeCTA from '@/components/_constants/pages/home/homeCTA'
import {
  pricingData,
  pricingEnterprise
} from '@/components/_constants/pricing/pricingData'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SimpleButton from '@/components/ui/buttons/simpleButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string, paymentType: string) => {
    setLoading(priceId)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, paymentType })
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url // redirect to Stripe Checkout
    } else {
      alert('Checkout failed')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
      {/* Header Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start free and upgrade as your needs grow. All plans include
              access to our core political intelligence platform.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingData.map(plan => (
              <Card
                key={plan.id}
                className={`border-2 transition-colors duration-300 ${
                  plan.id === 2
                    ? 'border-[#203c39] relative'
                    : 'border-slate-200 hover:border-[#203c39]'
                }`}
              >
                {plan.id === 2 && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#203c39] text-white">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.title}</CardTitle>
                  <div className="text-3xl font-bold text-[#203c39] mb-2">
                    {plan.price}
                    {plan.timeframe && (
                      <span className="text-lg font-normal">
                        /{plan.timeframe}
                      </span>
                    )}
                  </div>
                  {plan.subtitle && (
                    <CardDescription className="text-sm">
                      {plan.subtitle}
                    </CardDescription>
                  )}
                  {plan.trialButton && (
                    <Badge
                      variant="outline"
                      className="mt-2 text-xs flex justify-center p-2 bg-gray-200"
                    >
                      10 Day Free Trial
                    </Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map(feature => (
                      <li key={feature.fid} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature.feature}</span>
                      </li>
                    ))}
                  </ul>

                  <SimpleButton
                    classes={`w-full ${
                      plan.id === 2
                        ? 'bg-[#203c39] hover:bg-[#203c39]/90 text-white'
                        : 'variant-outline'
                    }`}
                    handleClick={() =>
                      handleCheckout(plan.priceId, plan.paymentType)
                    }
                    label="Start Free Trial"
                  />

                  {plan.trial && (
                    <p className="mt-2 text-xs text-center text-slate-500">
                      Cancel anytime
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {
            <Card
              key={pricingEnterprise.id}
              className={`m-auto p-4 border-2 transition-colors duration-300 max-w-2xl mt-6 justify-center items-center flex border-slate-200 hover:border-[#203c39]`}
            >
              {/* Enterprise Pricing */}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  {pricingEnterprise.title}
                </CardTitle>
                <div className="text-3xl font-bold text-[#203c39] mb-2">
                  {pricingEnterprise.price}
                  {pricingEnterprise.timeframe && (
                    <span className="text-lg font-normal">
                      /{pricingEnterprise.timeframe}
                    </span>
                  )}
                </div>
                {pricingEnterprise.subtitle && (
                  <CardDescription className="text-sm">
                    {pricingEnterprise.subtitle}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-4">
                <ul className="space-y-3 mb-6">
                  {pricingEnterprise.features.map(feature => (
                    <li key={feature.fid} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature.feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full ${
                    pricingEnterprise.id === 2
                      ? 'bg-[#203c39] hover:bg-[#203c39]/90 text-white'
                      : 'variant-outline'
                  }`}
                  variant={pricingEnterprise.id === 2 ? 'default' : 'outline'}
                >
                  <Link
                    href={
                      pricingEnterprise.url === '#'
                        ? '/contact'
                        : pricingEnterprise.url
                    }
                  >
                    {pricingEnterprise.trial
                      ? 'Start Free Trial'
                      : 'Contact Sales'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          }
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I change plans anytime?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes take effect immediately, and we'll prorate any billing
                  differences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  What happens after my free trial?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  After your 10-day free trial, you'll automatically be charged
                  for your selected plan. You can cancel anytime during the
                  trial period with no charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We offer a 30-day money-back guarantee for all paid plans. If
                  you're not satisfied with our service, contact us for a full
                  refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <HomeCTA />
      <AuthAwareFooter />
    </div>
  )
}

export default Pricing
