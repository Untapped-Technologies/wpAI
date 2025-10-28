import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(secretKey as string, {})

export async function POST(req: NextRequest) {
  try {
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured on the server' },
        { status: 500 }
      )
    }

    const { email, password, userType, planId, priceId, paymentType } =
      await req.json()
    const origin = req.headers.get('origin') || req.nextUrl.origin

    if (!email || !password || !planId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, planId, priceId' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if we're in development mode (using test price IDs)
    const isDevelopmentMode = priceId.startsWith('price_test_')

    let price
    if (isDevelopmentMode) {
      // For development mode, create a mock price object
      price = {
        id: priceId,
        unit_amount:
          planId === 'free'
            ? 0
            : planId === 'basic'
              ? 2000
              : planId === 'premium'
                ? 5000
                : 10000,
        currency: 'usd',
        type: 'recurring',
        recurring: { interval: 'month' }
      }
    } else {
      // For production mode, verify the price exists in Stripe
      try {
        price = await stripe.prices.retrieve(priceId)
      } catch (e: any) {
        const hint =
          'Verify the price belongs to the same Stripe account and mode (test vs live) as your secret key.'
        return NextResponse.json(
          { error: `Stripe says: ${e?.message || 'No such price'}. ${hint}` },
          { status: 400 }
        )
      }
    }

    // Handle free plan registration
    if (paymentType === 'free' || price.unit_amount === 0) {
      return await handleFreeRegistration(
        email,
        password,
        userType,
        planId,
        origin
      )
    }

    // For paid plans, create Stripe customer and checkout session
    const supabase = await createClient()

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        plan_id: planId,
        user_type: userType
      }
    })

    const derivedMode: 'payment' | 'subscription' =
      price.type === 'recurring' ? 'subscription' : 'payment'

    const mode: 'payment' | 'subscription' =
      paymentType === 'subscription' || derivedMode === 'subscription'
        ? 'subscription'
        : 'payment'

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&registration=true`,
      cancel_url: `${origin}/register?canceled=true`,
      metadata: {
        email,
        password_hash: await hashPassword(password), // We'll hash the password
        user_type: userType,
        plan_id: planId,
        registration_flow: 'true'
      },
      // Enable customer creation for new customers
      customer_creation: 'always',
      // Collect billing address for tax purposes
      billing_address_collection: 'required',
      // Allow promotion codes
      allow_promotion_codes: true
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error in checkout/register POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleFreeRegistration(
  email: string,
  password: string,
  userType: string,
  planId: string,
  origin: string
) {
  try {
    const supabase = await createClient()

    // Create user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/oauth?next=/success?plan=${planId}&registration=true`
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create user profile
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: data.user.id,
      email: data.user.email,
      display_name: data.user.email?.split('@')[0] || 'User',
      user_type_id: userType,
      preferences: {},
      updated_at: new Date().toISOString()
    })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail the registration if profile creation fails
    }

    // Create free subscription
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: data.user.id,
        plan_id: planId,
        stripe_customer_id: null,
        stripe_subscription_id: null,
        stripe_price_id: 'price_free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString() // 1 year from now
      })

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError)
      // Don't fail the registration if subscription creation fails
    }

    // Redirect to success page
    return NextResponse.json({
      url: `${origin}/success?plan=${planId}&registration=true&user_id=${data.user.id}`
    })
  } catch (error) {
    console.error('Error in free registration:', error)
    return NextResponse.json(
      { error: 'Failed to create free account' },
      { status: 500 }
    )
  }
}

async function hashPassword(password: string): Promise<string> {
  // In a real implementation, you'd use a proper password hashing library
  // For now, we'll use a simple hash (you should use bcrypt or similar)
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
