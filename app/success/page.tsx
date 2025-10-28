import { CheckCircle, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import {
  successNext,
  successSupport
} from '@/components/_constants/pages/successData'
import AuthAwareNavigation from '@/components/auth-aware-navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { stripe } from '../../lib/stripe'

export default async function Success({ searchParams }: any) {
  const { session_id, registration, plan, user_id } = await searchParams

  // Handle registration success (no session_id needed for free plans)
  if (registration === 'true') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AuthAwareNavigation />

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Registration Successful!
              </h1>
              <p className="text-xl text-slate-600">
                Welcome to World Politics! Your account has been created
                successfully.
              </p>
            </div>

            {/* Account Details Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Created
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Plan</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {plan === 'free' ? 'Free Tier' : plan}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Status</p>
                    <p className="text-lg font-semibold text-green-600">
                      Active
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-500 mb-2">
                    Next Steps
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Check your email for a welcome message</li>
                    <li>• Complete your profile setup</li>
                    <li>• Start exploring our features</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/user/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Complete Profile
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/" className="flex items-center gap-2">
                  Start Exploring
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to 404 if no session_id provided for payment success
  if (!session_id) {
    redirect('/404')
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent', 'customer']
    })

    // Redirect to 404 if session doesn't exist or is invalid
    if (!session) {
      redirect('/404')
    }

    // Handle different session statuses
    const status = session.status as
      | 'complete'
      | 'open'
      | 'expired'
      | 'cancelled'
      | null

    // Redirect to home if session is still open (not completed)
    if (status === 'open') {
      redirect('/')
    }

    // Redirect to 404 if session is expired, cancelled, or null
    if (status === 'expired' || status === 'cancelled' || status === null) {
      redirect('/404')
    }

    // Only show success page if payment is complete
    if (status === 'complete') {
      const customerEmail = session.customer_details?.email
      const customerName = session.customer_details?.name
      const amountTotal = session.amount_total
      const currency = session.currency?.toUpperCase()

      // Format amount for display
      const formattedAmount = amountTotal
        ? (amountTotal / 100).toFixed(2)
        : '0.00'

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <AuthAwareNavigation />

          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto">
              {/* Success Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Payment Successful!
                </h1>
                <p className="text-xl text-slate-600">
                  Thank you for your purchase. Your payment has been processed
                  successfully.
                </p>
              </div>

              {/* Payment Details Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Payment Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Amount Paid
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {currency} {formattedAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Payment Status
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        Completed
                      </p>
                    </div>
                  </div>

                  {customerEmail && (
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-sm font-medium text-slate-500 mb-2">
                        Confirmation Email
                      </p>
                      <p className="text-slate-700">
                        A confirmation email has been sent to{' '}
                        <span className="font-medium">{customerEmail}</span>
                      </p>
                    </div>
                  )}

                  {customerName && (
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Customer
                      </p>
                      <p className="text-slate-700">{customerName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {successNext.map(item => (
                      <div className="flex items-start gap-3" key={item.id}>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-blue-600">
                            {item.id}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-sm text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" size="lg">
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </Link>
                </Button>
              </div>

              {/* Support Information */}
              <div className="text-center mt-12 p-6 bg-white rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {successSupport.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {successSupport.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {successSupport.buttons.map(btns => (
                    <Button asChild variant="outline" size="sm" key={btns.id}>
                      <Link href={btns.url}>{btns.label}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // If status is not complete, redirect to 404
    redirect('/404')
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    // Redirect to 404 page on any error (invalid session, network issues, etc.)
    redirect('/404')
  }
}
