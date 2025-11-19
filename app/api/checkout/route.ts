import { getCurrentUserId } from '@/lib/auth/get-current-user'
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

    const { priceId, planId, paymentType, redirect } = await req.json()
    const origin = req.headers.get('origin') || req.nextUrl.origin

    // Get user ID - authentication is required
    const userId = await getCurrentUserId()

    if (!userId || userId === 'anonymous') {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to continue.' },
        { status: 401 }
      )
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    // Check if we're in development mode (using test price IDs)
    const isDevelopmentMode = priceId.startsWith('price_test_')

    let price
    if (isDevelopmentMode) {
      // For development mode, create a mock price object
      price = {
        id: priceId,
        unit_amount: 2000, // Default to $20 for testing
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

    const derivedMode: 'payment' | 'subscription' =
      price.type === 'recurring' ? 'subscription' : 'payment'

    const mode: 'payment' | 'subscription' =
      paymentType === 'subscription' || derivedMode === 'subscription'
        ? 'subscription'
        : 'payment'

    // Get or create Stripe customer for the user
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const userEmail = userData?.user?.email

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    // Check if user has existing subscription with Stripe customer ID
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    let stripeCustomerId = subscription?.stripe_customer_id

    // If no Stripe customer ID, check if one exists by email or create new
    if (!stripeCustomerId) {
      const existingCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id
        // Update subscription with Stripe customer ID if subscription exists
        if (subscription) {
          await supabase
            .from('user_subscriptions')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('user_id', userId)
        }
      } else {
        // Create new Stripe customer with user_id in metadata (REQUIRED for linking)
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            user_id: userId, // CRITICAL: Always include user_id to link to Supabase
            supabase_user_id: userId, // Redundant but explicit
            plan_id: planId || ''
          }
        })
        stripeCustomerId = customer.id

        // Update or create subscription record
        if (subscription) {
          await supabase
            .from('user_subscriptions')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('user_id', userId)
        } else {
          await supabase.from('user_subscriptions').insert({
            user_id: userId,
            plan_id: 'free',
            stripe_customer_id: stripeCustomerId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString()
          })
        }
      }
    } else {
      // If customer exists, ensure metadata has user_id
      const customer = await stripe.customers.retrieve(stripeCustomerId)
      if (customer && typeof customer === 'object' && !customer.deleted) {
        const needsUpdate = !customer.metadata?.user_id || customer.metadata.user_id !== userId
        if (needsUpdate) {
          await stripe.customers.update(stripeCustomerId, {
            metadata: {
              ...customer.metadata,
              user_id: userId,
              supabase_user_id: userId
            }
          })
          console.log(`✅ Updated Stripe customer ${stripeCustomerId} with user_id ${userId}`)
        }
      }
    }

    const successUrl =
      redirect === 'profile'
        ? `${origin}/user/profile?upgraded=true&session_id={CHECKOUT_SESSION_ID}`
        : `${origin}/success?session_id={CHECKOUT_SESSION_ID}`

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode,
      success_url: successUrl,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        user_id: userId,
        plan_id: planId || '',
        source: 'pricing_page',
        upgrade_flow: 'true'
      },
      allow_promotion_codes: true
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    const message =
      (error?.raw && error.raw.message) || error?.message || 'Server error'
    console.error('Checkout API error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
