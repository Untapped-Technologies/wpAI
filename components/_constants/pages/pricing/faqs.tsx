import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PricingFaqs = () => {
  return (
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
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate any billing
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
                for your selected plan. You can cancel anytime during the trial
                period with no charges.
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
  )
}

export default PricingFaqs
