'use client'

import { CheckCircle, CreditCard, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils/index'

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

type RegistrationStep = 'plans' | 'details' | 'payment' | 'processing'

export function RegistrationFlow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('plans')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState(
    '77503f6f-c160-4cca-9d13-70f08e09fcc4'
  ) // Default to Citizen
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/pricing')
      const data = await response.json()
      if (response.ok) {
        setPlans(data.data || [])
      } else {
        throw new Error(data.error || 'Failed to load plans')
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      setError('Failed to load pricing plans')
    }
  }

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan)
    setCurrentStep('details')
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setCurrentStep('payment')
  }

  const handlePayment = async () => {
    if (!selectedPlan) return

    setLoading(true)
    setError(null)

    try {
      // Create checkout session with user details
      const response = await fetch('/api/checkout/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          userType,
          planId: selectedPlan.id,
          priceId: selectedPlan.stripe_price_id,
          paymentType: selectedPlan.price_cents === 0 ? 'free' : 'subscription'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderPlansStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Choose Your Plan
        </h2>
        <p className="text-slate-600">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map(plan => (
          <Card
            key={plan.id}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-lg',
              plan.is_popular && 'ring-2 ring-blue-500 shadow-lg'
            )}
            onClick={() => handlePlanSelection(plan)}
          >
            <CardHeader className="text-center">
              {plan.is_popular && (
                <Badge className="mb-2 mx-auto">Most Popular</Badge>
              )}
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
              <ul className="space-y-2 text-sm">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Create Your Account
        </h2>
        <p className="text-slate-600">
          You selected: <strong>{selectedPlan?.name}</strong>
        </p>
      </div>

      <form onSubmit={handleDetailsSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>User Type</Label>
          <RadioGroup value={userType} onValueChange={setUserType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="77503f6f-c160-4cca-9d13-70f08e09fcc4"
                id="citizen"
              />
              <Label htmlFor="citizen">Citizen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="3dad0f25-2b3b-491b-9e82-9f9e71adad6f"
                id="candidate"
              />
              <Label htmlFor="candidate">Candidate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="ec870801-e748-4c62-ae44-041e47e4eca8"
                id="civil-servant"
              />
              <Label htmlFor="civil-servant">Civil Servant</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('plans')}
            className="flex-1"
          >
            Back to Plans
          </Button>
          <Button type="submit" className="flex-1">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Complete Your Registration
        </h2>
        <p className="text-slate-600">Secure payment powered by Stripe</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{selectedPlan?.name}</span>
            <span className="font-bold">
              {selectedPlan?.price_cents === 0
                ? 'Free'
                : `$${(selectedPlan?.price_cents || 0) / 100}`}
              {selectedPlan &&
                selectedPlan.price_cents > 0 &&
                `/${selectedPlan.interval}`}
            </span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>
                {selectedPlan?.price_cents === 0
                  ? 'Free'
                  : `$${(selectedPlan?.price_cents || 0) / 100}`}
                {selectedPlan &&
                  selectedPlan.price_cents > 0 &&
                  `/${selectedPlan.interval}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep('details')}
          className="flex-1"
        >
          Back to Details
        </Button>
        <Button onClick={handlePayment} disabled={loading} className="flex-1">
          {loading ? 'Processing...' : 'Complete Registration'}
        </Button>
      </div>
    </div>
  )

  return (
    <div className={cn('max-w-4xl mx-auto p-6', className)} {...props}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {currentStep === 'plans' && renderPlansStep()}
      {currentStep === 'details' && renderDetailsStep()}
      {currentStep === 'payment' && renderPaymentStep()}
    </div>
  )
}
