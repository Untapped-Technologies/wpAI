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

    // Get user's current subscription
    const supabase = await createClient()
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Create checkout session for upgrade
    const session = await stripe.checkout.sessions.create({
      customer: subscription.stripe_customer_id,
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
