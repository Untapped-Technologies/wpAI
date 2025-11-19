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

    const { planId, priceId } = await req.json()
    const userId = await getCurrentUserId()
    const origin = req.headers.get('origin') || req.nextUrl.origin

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    if (!planId || !priceId) {
      return NextResponse.json(
        { error: 'Missing planId or priceId' },
        { status: 400 }
      )
    }

    // Get user's current subscription and profile
    const supabase = await createClient()
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    // Get user email for Stripe customer creation if needed
    const { data: userData } = await supabase.auth.getUser()
    const userEmail = userData?.user?.email

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    let stripeCustomerId = subscription?.stripe_customer_id

    // If user doesn't have a Stripe customer ID, create one
    if (!stripeCustomerId) {
      // Check if a Stripe customer already exists for this email
      const existingCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id
        // Update subscription with the Stripe customer ID
        await supabase
          .from('user_subscriptions')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('user_id', userId)
      } else {
        // Create new Stripe customer with user_id in metadata (REQUIRED for linking)
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            user_id: userId, // CRITICAL: Always include user_id to link to Supabase
            supabase_user_id: userId, // Redundant but explicit
            plan_id: planId
          }
        })
        stripeCustomerId = customer.id

        // Update or create subscription record with Stripe customer ID
        if (subscription) {
          await supabase
            .from('user_subscriptions')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('user_id', userId)
        } else {
          // Create subscription record if it doesn't exist
          await supabase.from('user_subscriptions').insert({
            user_id: userId,
            plan_id: 'free', // Default to free if no subscription exists
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

    // Create checkout session for upgrade
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${origin}/user/profile?upgraded=true`,
      cancel_url: `${origin}/user/profile?upgrade_canceled=true`,
      metadata: {
        user_id: userId,
        plan_id: planId,
        upgrade_flow: 'true'
      },
      // Allow promotion codes
      allow_promotion_codes: true
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create upgrade session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error in checkout/upgrade POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
