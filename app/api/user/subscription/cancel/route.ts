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

    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get user's current subscription
    const supabase = await createClient()
    const { data: subscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subscriptionError || !subscription?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Cancel subscription in Stripe
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: true
      }
    )

    // Update subscription in database
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.stripe_subscription_id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message:
        'Subscription will be canceled at the end of the current billing period',
      cancel_at: canceledSubscription.cancel_at
    })
  } catch (error) {
    console.error('Error in subscription/cancel POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
